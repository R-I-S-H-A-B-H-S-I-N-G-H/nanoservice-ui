import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import type { Media } from "@/types/media";
import { Badge } from "@/components/ui/badge";
import { DialogComp } from "@/components/custom/dilogComp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { FileUploadArea } from "@/components/custom/fileUploadArea";
import mime from "mime";

// API calls
async function getMediaList(userid = "", orgid = "") {
	const url = `http://localhost:8000/media/list?orgid=${orgid}&userid=${userid}`;
	const res = await axios.get(url);
	return res.data.data;
}

async function createMedia(payload: Media) {
	const url = `http://localhost:8000/media`;
	const res = await axios.post(url, payload);
	return res.data.data;
}

async function uploadFileToPresignedUrl(file: File, presignedUrl: string, onProgress: (percent: number) => void) {
	await axios.put(presignedUrl, file, {
		headers: { "Content-Type": file.type },
		onUploadProgress: (progressEvent) => {
			const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
			onProgress(percent);
		},
	});
}

function isImage(fileNameWithExt?: string) {
	if (!fileNameWithExt) return false;
	return mime.getType(fileNameWithExt)?.startsWith("image/") || false;
}

export default function MediaPage() {
	const MEDIA_BASE_PATH = "https://media.r2s.space";
	const { userid, orgid } = useParams();
	const [mediaList, setMediaList] = useState<Media[]>([]);
	const [mediaPayload, setMediaPayload] = useState<Media>({
		name: "",
		user_id: userid,
		org_id: orgid,
		media_type: "",
	});
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [uploading, setUploading] = useState<boolean>(false);

	useEffect(() => {
		updateMediaList();
	}, [userid, orgid]);

	async function updateMediaList() {
		if (userid && orgid) {
			const list = await getMediaList(userid, orgid);
			setMediaList(list);
		}
	}

	async function handleSubmit() {
		if (!selectedFile) return;

		const payload = { ...mediaPayload };
		if (!payload.name) payload.name = selectedFile.name;
		payload.media_type = selectedFile.name.split(".").pop() || "";

		setUploading(true);
		setUploadProgress(0);

		try {
			// 1. Create media record
			const savedMedia = await createMedia(payload);
			// 2. Upload file to presigned URL with progress
			await uploadFileToPresignedUrl(selectedFile, savedMedia.presigned_url, (percent) => {
				setUploadProgress(percent);
			});

			// 3. Refresh list
			await updateMediaList();
		} finally {
			setUploading(false);
			setUploadProgress(0);
			setSelectedFile(null);
			setMediaPayload({ name: "", user_id: userid!, org_id: orgid!, media_type: "" });
		}
	}

	return (
		<div className="p-4">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Media Library</h1>
					<p className="text-muted-foreground">
						OrgId: {orgid} / UserId: {userid}
					</p>
				</div>

				<DialogComp title="Create Media" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<Label>Name</Label>
							<Input placeholder="Media Name" value={mediaPayload.name} onChange={(e) => setMediaPayload({ ...mediaPayload, name: e.target.value })} />
						</div>

						<FileUploadArea
							selectedFile={selectedFile}
							onFileSelect={(file) => {
								setSelectedFile(file);
								setMediaPayload({
									...mediaPayload,
									name: mediaPayload.name || file.name.split(".").slice(0, -1).join("."),
									media_type: file.name.split(".").pop(),
								});
							}}
						/>

						{uploading && (
							<div className="mt-2">
								<Progress value={uploadProgress} className="h-2 rounded-full" />
								<p className="text-sm mt-1">{uploadProgress}% uploaded</p>
							</div>
						)}
					</div>
				</DialogComp>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{mediaList.map((item) => (
					<div key={item.id} className="bg-card border rounded-lg shadow overflow-hidden">
						<div className="h-48 bg-muted flex items-center justify-center">
							{isImage(item.media_type) && <img src={`${MEDIA_BASE_PATH}${item.url}`} alt={item.name} className="w-full h-full object-cover" />}
							{(item.media_type === "mp4" || item.media_type === "webm" || item.media_type === "ogg") && (
								<video controls className="w-full h-full">
									<source src={`${MEDIA_BASE_PATH}${item.url}`} type={`video/${item.media_type}`} />
									Your browser does not support the video tag.
								</video>
							)}
						</div>
						<div className="p-4">
							<h3 className="text-lg font-bold truncate">{item.name}</h3>
							<Badge variant="outline">{item.media_type}</Badge>
							<div className="mt-2 text-sm space-y-1">
								<div>
									<strong>URL:</strong>{" "}
									<a
										href={`${MEDIA_BASE_PATH}${item.url}`}
										target="_blank"
										rel="noopener noreferrer"
										className="font-mono break-all hover:underline"
									>{`${MEDIA_BASE_PATH}${item.url}`}</a>
								</div>
								<div>
									<strong>Created:</strong> {new Date(item.created_at).toLocaleString()}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
