export interface StreamRes {
    id: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    stream_id?: string;
    res: number;
    input_media_url: string;
    stream_url: string;
    prefix: string;
    status: string;
    error_message?: string;
    chunk_dur_sec: number;
    total_chunks?: number;
}

export interface Stream {
    id: string;
    shortId: string;

    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;

    title?: string 
    res: [number];
    userId?: string;
    orgId?: string;
    mediaSource?: string
    hlsPlaylist: string;
    thumbnail: string;
    metadata: any
    description?: string
}

export interface CreateStreamPayload {
    title: string;
    description: string;
    mediaSource: string;
}

//  {
//             "id": "c7fed92c-5225-4198-99f1-b1ef49560138",
//             "shortId": "4TfP5OPR",
//             "createdAt": "2025-12-28T00:05:25.466917+05:30",
//             "updatedAt": "2025-12-28T00:05:25.466917+05:30",
//             "isDeleted": false,
//             "userId": "hphqXuQI",
//             "orgId": "sdLAU4T9",
//             "title": "Test Stream 2",
//             "description": "Sintel",
//             "status": "PENDING",
//             "mediaSource": "https://github.com/mediaelement/mediaelement-files/raw/refs/heads/master/big_buck_bunny.mp4",
//             "hlsPlaylist": "stream/4TfP5OPR/playlist.m3u8",
//             "thumbnail": "",
//             "metadata": {}
//         }
