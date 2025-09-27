
import axios from "axios";
import type { Media } from "@/types/media";
import { API_BASE_URL } from "./constants";

export async function getMediaList(userid = "", orgid = "") {
	const url = `${API_BASE_URL}/media/list?orgid=${orgid}&userid=${userid}`;
	const res = await axios.get(url);
	return res.data.data;
}

export async function createMedia(payload: Media) {
	const url = `${API_BASE_URL}/media`;
	const res = await axios.post(url, payload);
	return res.data.data;
}

export async function uploadFileToPresignedUrl(file: File, presignedUrl: string, onProgress: (percent: number) => void) {
	await axios.put(presignedUrl, file, {
		headers: { "Content-Type": file.type },
		onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
			    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
			    onProgress(percent);
            }
		},
	});
}
