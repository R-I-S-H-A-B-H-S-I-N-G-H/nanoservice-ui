import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import axios from "axios";
import { conf } from "../../../../config";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router";
import { Loader2, Play, Copy, Check, AlertCircle } from "lucide-react"; // Assuming you have lucide-react installed

// interface for the API response
interface StreamResponse {
    remotePath: string;
    mediaUrl: string;
    chunkSize: number;
    streamUrl: string;
}

// Refactored to return the data directly
async function WatchCreateApi(
    mediaUrl: string,
    streamId: string = nanoid(),
    chunkSize: number = 6
): Promise<StreamResponse> {
    const data = JSON.stringify({
        remotePath: "",
        mediaUrl: mediaUrl,
        chunkSize: chunkSize,
        streamUrl: "",
    });

    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${conf.STREAM_BASE_URL}/stream/${streamId}/init`,
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };

    const response = await axios.request(config);
    return response.data;
}

export default function WatchCreate() {
    const navigate = useNavigate();
    const [mediaUrl, setMediaUrl] = useState("");
    const [result, setResult] = useState<StreamResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // 1. On Mount: Check URL for existing state
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlParam = params.get("mediaUrl");
        const streamParam = params.get("streamUrl");

        if (urlParam) setMediaUrl(urlParam);

        if (streamParam && urlParam) {
            setResult({
                mediaUrl: urlParam,
                streamUrl: streamParam,
                chunkSize: Number(params.get("chunkSize")) || 6,
                remotePath: params.get("remotePath") || "",
            });
        }
    }, []);

    // 2. Helper to update URL without reloading
    const updateUrlParams = (data: StreamResponse) => {
        const params = new URLSearchParams();
        params.set("mediaUrl", data.mediaUrl);
        if (data.streamUrl) params.set("streamUrl", data.streamUrl);
        if (data.chunkSize) params.set("chunkSize", data.chunkSize.toString());
        if (data.remotePath) params.set("remotePath", data.remotePath);

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
    };

    async function saveWatch() {
        if (!mediaUrl) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await WatchCreateApi(mediaUrl);
            setResult(data);
            updateUrlParams(data);
        } catch (error) {
            console.error("Failed to create watch", error);
            setError(
                "Failed to create stream. Please check the URL and try again."
            );
        } finally {
            setLoading(false);
        }
    }

    const copyToClipboard = () => {
        if (result?.streamUrl) {
            navigator.clipboard.writeText(result.streamUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleWatchClick = () => {
        if (result?.streamUrl) {
            const streamId = result.streamUrl.split("/")[1];
            navigate(`/watch/${streamId}`);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-6">
            <div className="w-full max-w-lg space-y-6">
                {/* Header Section */}
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Create Stream
                    </h1>
                    <p className="text-muted-foreground">
                        Enter a media URL to generate a streamable playlist.
                    </p>
                </div>

                {/* Main Card Area */}
                <div className="border rounded-xl bg-card text-card-foreground shadow-sm p-6 space-y-6">
                    <div className="space-y-2">
                        <FieldLabel htmlFor="media-url">
                            Source Media URL
                        </FieldLabel>
                        <Input
                            id="media-url"
                            placeholder="https://example.com/video.mp4"
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={saveWatch}
                        disabled={loading || !mediaUrl}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Generate Stream"
                        )}
                    </Button>
                </div>

                {/* Result Section */}
                {result && (
                    <div className="border rounded-xl bg-secondary/20 p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                Stream Ready
                            </h3>
                        </div>

                        {/* Stream URL Display with Copy */}
                        <div className="space-y-1.5">
                            <FieldLabel className="text-xs text-muted-foreground">
                                Stream URL
                            </FieldLabel>
                            <div className="flex gap-2">
                                <Input
                                    readOnly
                                    value={result.streamUrl}
                                    className="font-mono text-xs bg-background"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={copyToClipboard}
                                    title="Copy URL"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Meta Data Grid */}
                        <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                            <div>
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Chunk Size
                                </span>
                                <span>{result.chunkSize}MB</span>
                            </div>
                            <div>
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Remote Path
                                </span>
                                <span
                                    className="truncate block"
                                    title={result.remotePath || "N/A"}
                                >
                                    {result.remotePath || "-"}
                                </span>
                            </div>
                        </div>

                        {/* Primary Action */}
                        <Button
                            onClick={handleWatchClick}
                            className="w-full gap-2"
                            size="lg"
                        >
                            <Play className="h-4 w-4" fill="currentColor" />
                            Watch Now
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
