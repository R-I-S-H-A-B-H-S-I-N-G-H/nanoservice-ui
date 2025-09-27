import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import type { Media } from "@/types/media";

async function getMediaList(userid = "", orgid = "") {
	const url = `http://localhost:8000/media/list?orgid=${orgid}&userid=${userid}`;

	let res = await axios.get(url);
	return res.data;
}

export default function MediaPage() {
	const { userid, orgid } = useParams();
	const [mediaList, setMediaList] = useState<Media[]>([]);

	useEffect(() => {
		if (userid && orgid) {
			getMediaList(userid, orgid).then((res) => {
				console.log(res);
				setMediaList(res);
			});
		}
	}, [userid, orgid]);

	return (
		<div className="p-4">
			<div className="mb-4">
				<h1 className="text-2xl font-bold">Media Library</h1>
				<p className="text-muted-foreground">
					OrgId: {orgid} / UserId: {userid}
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{mediaList.map((item) => (
					<div key={item.id} className="bg-card border rounded-lg shadow-lg overflow-hidden">
						<div className="p-4">
							<h3 className="text-lg font-bold">{item.name}</h3>
							<p className="text-sm text-muted-foreground">{item.media_type}</p>
							<div className="mt-4 space-y-2 text-sm">
								<div>
									<strong>URL:</strong> <span className="font-mono">{item.url}</span>
								</div>
								<div>
									<strong>Created:</strong> {new Date(item.created_at).toLocaleString()}
								</div>
								<div>
									<strong>Updated:</strong> {new Date(item.updated_at).toLocaleString()}
								</div>
								<div>
									<strong>Deleted:</strong> {String(item.is_deleted)}
								</div>
								<div>
									<strong>User ID:</strong> <span className="font-mono">{item.user_id}</span>
								</div>
								<div>
									<strong>Org ID:</strong> <span className="font-mono">{item.org_id}</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
