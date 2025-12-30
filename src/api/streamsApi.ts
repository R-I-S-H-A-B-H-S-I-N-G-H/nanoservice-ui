import axios from "axios"
import { conf } from "../../config"
import type { CreateStreamPayload } from "@/types/stream";

export async function getStreamResList(
    orgId: string = "",
    userId: string = "",
    stream_id: string = ""
) {
    const url = `${conf.BASE_URL}/stream/stream-res/list?user_id=${userId}&org_id=${orgId}&stream_id=${stream_id}`;
    const res = await axios.get(url);
    return res.data.data;
}

export async function getStream(
    orgId: string = "",
    userId: string = "",
    stream_id: string = ""
) {
    const url = `${conf.BASE_URL}/account/stream/${stream_id}?user_id=${userId}&org_id=${orgId}`;
    const res = await axios.get(url);
    return res.data.data;
}

export async function getStreamRes(
    orgId: string = "",
    userId: string = "",
    stream_res_id: string = ""
) {
    const url = `${conf.BASE_URL}/stream/stream-res/${stream_res_id}?user_id=${userId}&org_id=${orgId}`;
    const res = await axios.get(url);
    return res.data.data;
}

export async function getStreamList(orgId: string = "", userId: string = "") {
    const url = `${conf.BASE_URL}/account/stream/list?user_id=${userId}&org_id=${orgId}`;
    const res = await axios.get(url);
    return res.data.data;
}


export async function createStream(orgId: string = "", userId: string = "", payload: CreateStreamPayload) {
    const url = `${conf.BASE_URL}/account/stream?orgId=${orgId}&userId=${userId}`
    const res = await axios.post(url, payload)
    return res.data;
}