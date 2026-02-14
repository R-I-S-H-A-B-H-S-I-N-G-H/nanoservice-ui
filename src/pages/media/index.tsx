import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import type { Media, Quota } from "@/types/media";
import { Badge } from "@/components/ui/badge";
import { DialogComp } from "@/components/custom/dilogComp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { FileUploadArea } from "@/components/custom/fileUploadArea";
import mime from "mime";
import { getTokenFromLocalStorage } from "@/utils/jwtUtil";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
    Trash2,
    HardDrive,
    Files,
    Database,
    AlertCircle,
    ExternalLink,
    Calendar,
    // Image as ImageIcon,
    Video,
} from "lucide-react";
import { conf } from "../../../config";

// --- API Utility Functions ---

async function getMediaStats(userid = "", orgid = "") {
    const url = `${conf.BASE_URL}/account/asset/stat?orgId=${orgid}&userId=${userid}`;
    const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    });
    return res.data.data;
}

async function getMediaList(userid = "", orgid = "") {
    const url = `${conf.BASE_URL}/account/asset/list?orgId=${orgid}&userId=${userid}`;
    const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    });
    return res.data.data;
}

async function uploadCompleteHook(hook = "", orgId = "", userId = "") {
    const url = `${hook}?orgId=${orgId}&userId=${userId}`;
    const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    });
    return res.data.data;
}

async function createMedia(payload: Media, orgid = "", userid = "") {
    const url = `${conf.BASE_URL}/account/asset?orgId=${orgid}&userId=${userid}`;
    const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    });
    return res.data.data;
}

async function fetchQuotas(orgId: string, userId: string) {
    try {
        const res = await fetch(
            `${conf.BASE_URL}/account/quota?orgId=${orgId}&userId=${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${getTokenFromLocalStorage()}`,
                },
            },
        );
        const json = await res.json();
        return json.data;
    } catch (err) {
        console.error("Failed to fetch quotas", err);
    }
}

async function uploadFileToPresignedUrl(
    file: File,
    presignedUrl: string,
    onProgress: (percent: number) => void,
    signal?: AbortSignal,
): Promise<void> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presignedUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (event) => {
            if (!event.lengthComputable) return;
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`Upload failed with status ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.onabort = () => reject(new Error("Upload aborted"));
        if (signal) signal.addEventListener("abort", () => xhr.abort());
        xhr.send(file);
    });
}

async function deleteMedia(id: string, orgid: string, userid?: string) {
    const url = `${conf.BASE_URL}/account/asset/${id}?orgId=${orgid}&userId=${userid}`;
    const res = await axios.delete(url, {
        headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
    });
    return res.data.data;
}

// --- Helpers ---

function isImage(fileNameWithExt?: string) {
    if (!fileNameWithExt) return false;
    return mime.getType(fileNameWithExt)?.startsWith("image/") || false;
}

const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// --- Main Component ---

export default function MediaPage() {
    const MEDIA_BASE_PATH = conf.ASSET_CDN_URL + "/";
    const { userid, orgid } = useParams();
    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [mediaPayload, setMediaPayload] = useState<Media>(
        getInitialMediaPayload(),
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploading, setUploading] = useState<boolean>(false);
    const [stats, setStats] = useState<any>(null);
    const [quotas, setQuotas] = useState<Quota[]>([]);

    useEffect(() => {
        updateMediaData();
    }, [userid, orgid]);

    function getInitialMediaPayload() {
        return { name: "", user_id: userid, org_id: orgid, media_type: "" };
    }

    async function updateMediaData() {
        if (userid && orgid) {
            const [list, statsData, quotaData] = await Promise.all([
                getMediaList(userid, orgid),
                getMediaStats(userid, orgid),
                fetchQuotas(orgid, userid),
            ]);
            setMediaList(list.items);
            setStats(statsData);
            setQuotas(quotaData || []);
        }
    }

    // async function updateMediaList() {
    //     if (userid && orgid) {
    //         const list = await getMediaList(userid, orgid);
    //         const statsData = await getMediaStats(userid, orgid); // Update stats too
    //         setMediaList(list.items);
    //         setStats(statsData);
    //     }
    // }

    async function handleSubmit() {
        if (!selectedFile) return;
        const payload = { ...mediaPayload };
        if (!payload.name) payload.name = selectedFile.name;
        payload.extension = selectedFile.name.split(".").pop() || "";
        payload.size = selectedFile.size;
        payload.mimeType = selectedFile.type;

        setUploading(true);
        setUploadProgress(0);

        try {
            const savedMedia = await createMedia(payload, orgid, userid);
            const presignedUrl = savedMedia.presignedObj?.preSignedUrl?.url;
            const uploadCompleteHookUrl =
                savedMedia.presignedObj?.uploadCompleteHook;

            await uploadFileToPresignedUrl(selectedFile, presignedUrl, (p) =>
                setUploadProgress(p),
            );
            await uploadCompleteHook(uploadCompleteHookUrl, orgid, userid);
            await updateMediaData(); // Refresh everything
        } finally {
            setUploading(false);
            setUploadProgress(0);
            setSelectedFile(null);
            setMediaPayload(getInitialMediaPayload());
        }
    }

    async function deleteHandler(mediaId: string | undefined) {
        if (!mediaId || !orgid) return;
        await deleteMedia(mediaId, orgid, userid);
        await updateMediaData();
    }

    return (
        <div className="p-6 space-y-8 bg-background min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Media Library
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="font-mono text-[10px]"
                        >
                            {orgid}
                        </Badge>
                        <span className="text-xs">•</span>
                        <span className="text-sm font-medium">{userid}</span>
                    </p>
                </div>

                <DialogComp
                    title="Upload New Media"
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setMediaPayload(getInitialMediaPayload());
                        setSelectedFile(null);
                    }}
                >
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>File Name</Label>
                            <Input
                                placeholder="Descriptive name"
                                value={mediaPayload.name}
                                onChange={(e) =>
                                    setMediaPayload({
                                        ...mediaPayload,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <FileUploadArea
                            selectedFile={selectedFile}
                            onFileSelect={(file) => {
                                setSelectedFile(file);
                                setMediaPayload({
                                    ...mediaPayload,
                                    name:
                                        mediaPayload.name ||
                                        file.name
                                            .split(".")
                                            .slice(0, -1)
                                            .join("."),
                                    extension: file.name.split(".").pop(),
                                });
                            }}
                        />
                        {uploading && (
                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <Progress
                                    value={uploadProgress}
                                    className="h-2"
                                />
                            </div>
                        )}
                    </div>
                </DialogComp>
            </div>

            {/* Stats & Quota Section */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Primary Resource Card */}
                <div className="md:col-span-2 p-6 bg-card border rounded-xl shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-primary" />
                            <h3 className="font-bold text-lg">
                                Storage Overview
                            </h3>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {quotas.map((quota) => {
                            const isStorage =
                                quota.resourceKey === "storage_bytes";
                            const currentVal = isStorage
                                ? stats?.totalActiveBytes || 0
                                : quota.currentUsage;
                            const limitVal = quota.limit;
                            const percentage = Math.min(
                                (currentVal / limitVal) * 100,
                                100,
                            );
                            const isWarning = percentage > 80;

                            return (
                                <div key={quota.id} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                                                {quota.resourceKey.replace(
                                                    "_",
                                                    " ",
                                                )}
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold">
                                                    {isStorage
                                                        ? formatBytes(
                                                              currentVal,
                                                          )
                                                        : currentVal}
                                                </span>
                                                <span className="text-muted-foreground text-sm font-medium">
                                                    of{" "}
                                                    {isStorage
                                                        ? formatBytes(limitVal)
                                                        : limitVal}
                                                </span>
                                            </div>
                                        </div>
                                        {isWarning && (
                                            <div className="flex items-center gap-1 text-destructive animate-pulse pb-1">
                                                <AlertCircle className="h-4 w-4" />
                                                <span className="text-[10px] font-bold">
                                                    CRITICAL
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative w-full h-2.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-700 ease-out ${isWarning ? "bg-destructive" : "bg-primary"}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Secondary Stats Column */}
                <div className="flex flex-col gap-6">
                    <div className="p-6 bg-primary text-primary-foreground rounded-xl shadow-md flex flex-col justify-between h-[160px] relative overflow-hidden group">
                        <Files className="h-16 w-16 absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform" />
                        <h4 className="text-sm font-bold uppercase tracking-widest opacity-80">
                            Total Files
                        </h4>
                        <div className="relative z-10">
                            <span className="text-5xl font-black">
                                {stats?.fileCount || 0}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 bg-orange-50 border border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/30 rounded-xl flex flex-col justify-between h-[160px]">
                        <div className="flex justify-between items-start">
                            <Database className="h-6 w-6 text-orange-500" />
                            {stats?.pendingUploadsCount > 0 && (
                                <Badge className="bg-orange-500 text-[10px] animate-bounce">
                                    Pending
                                </Badge>
                            )}
                        </div>
                        <div>
                            <span className="text-4xl font-black text-orange-600 leading-none">
                                {stats?.pendingUploadsCount || 0}
                            </span>
                            <p className="text-xs font-bold text-orange-700/70 dark:text-orange-400 mt-1 uppercase">
                                Pending Actions
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Grid Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">Library</h3>
                    <Badge variant="secondary">{mediaList.length}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {mediaList.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-card border border-border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
                        >
                            <div className="h-44 bg-muted flex items-center justify-center relative overflow-hidden">
                                {isImage(item.extension) ? (
                                    <img
                                        src={`${MEDIA_BASE_PATH}${item.resourcePath}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Video className="h-10 w-10 opacity-20" />
                                        <span className="text-[10px] font-bold uppercase">
                                            {item.extension}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none">
                                        {item.extension}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-sm font-bold text-foreground line-clamp-1 flex-1">
                                        {item.name}
                                    </h3>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() =>
                                                        deleteHandler(
                                                            item.shortId,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Delete Media</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <ExternalLink className="h-3 w-3" />
                                        <a
                                            href={`${MEDIA_BASE_PATH}${item.resourcePath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-mono truncate hover:text-primary transition-colors"
                                        >
                                            {item.resourcePath}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                            {item.createdAt
                                                ? new Date(
                                                      item.createdAt,
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
