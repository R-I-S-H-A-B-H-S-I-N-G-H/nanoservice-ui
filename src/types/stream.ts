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
    created_at: string;
    updated_at: string;
    is_deleted: boolean;

    name?: string 
    res: [number];
    user_id?: string;
    org_id?: string;
    input_media_url?: string
    stream_url: string;
}
