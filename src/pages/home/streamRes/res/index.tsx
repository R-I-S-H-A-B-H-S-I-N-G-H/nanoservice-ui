// pages/StreamResPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getStreamRes } from '@/api/streamsApi';
import type { StreamRes } from '@/types/stream';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity, 
  Calendar, 
  Copy, 
  Server, 
  AlertCircle, 
  MonitorPlay,
  FileVideo,
  Clock
} from 'lucide-react';
import { format } from 'date-fns'; 
import { VideoPlayer } from '@/components/custom/videoPlayer';
import { conf } from "../../../../../config"; 

export default function StreamResPage() {
    const { userid, orgid, streamResid } = useParams();
    const [streamRes, setStreamRes] = useState<StreamRes | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(userid && orgid && streamResid) {
            getStreamResHandler();
        }
    }, [userid, orgid, streamResid]);

    async function getStreamResHandler() {
        try {
            setLoading(true);
            const data = await getStreamRes(orgid, userid, streamResid);
            
            // FIX: Use 'data.stream_url', not 'streamRes.stream_url'
            // We also handle the slash logic to ensure we don't get double slashes //
            const baseUrl = conf.CDN_BASE_URL.replace(/\/$/, ""); // remove trailing slash if present
            const streamPath = data.stream_url.replace(/^\//, ""); // remove leading slash if present
            const fullUrl = `${baseUrl}/${streamPath}?cb=2`;

            // Create a new object with the updated URL
            setStreamRes({
                ...data,
                stream_url: fullUrl
            });

            console.log(streamRes);
            

        } catch (error) {
            console.error("Failed to fetch stream res", error);
        } finally {
            setLoading(false);
        }
    }

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        // Optional: Add toast success message here
    };

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!streamRes) {
        return <div className="p-8 text-center">Stream resource not found.</div>;
    }

    const videoJsOptions = {
        src: streamRes.stream_url ?? ""
    };

    return (
        <div className="container mx-auto p-6 space-y-6 max-w-7xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        Stream Details
                        <StatusBadge status={streamRes.status} />
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        ID: <span className="font-mono text-xs">{streamRes.id}</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={getStreamResHandler}>Refresh Data</Button>
                </div>
            </div>

            {streamRes.error_message && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Streaming Error</AlertTitle>
                    <AlertDescription>{streamRes.error_message}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Player & Technical URLs (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden border-none shadow-none ring-1 ring-border">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            <VideoPlayer {...videoJsOptions} />
                        </div>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Server className="w-5 h-5" /> Source & Output
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <UrlDisplay 
                                label="Stream URL (HLS)" 
                                url={streamRes.stream_url} 
                                onCopy={() => copyToClipboard(streamRes.stream_url)} 
                            />
                            <Separator />
                            <UrlDisplay 
                                label="Input Media URL" 
                                url={streamRes.input_media_url} 
                                onCopy={() => copyToClipboard(streamRes.input_media_url)} 
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Metadata (1/3 width) */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MonitorPlay className="w-4 h-4" /> Resolution
                                </div>
                                <span className="font-medium text-lg">{streamRes.res}p</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" /> Chunk Duration
                                </div>
                                <span>{streamRes.chunk_dur_sec}s</span>
                            </div>
                            <Separator />
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileVideo className="w-4 h-4" /> Total Chunks
                                </div>
                                <span>{streamRes.total_chunks || 0}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Activity className="w-4 h-4" /> Prefix
                                </div>
                                <Badge variant="secondary" className="font-mono">{streamRes.prefix}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Timestamps</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Created At
                                </p>
                                <p className="text-sm font-medium">
                                    {format(new Date(streamRes.created_at), "PPpp")}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Activity className="w-3 h-3" /> Last Updated
                                </p>
                                <p className="text-sm font-medium">
                                    {format(new Date(streamRes.updated_at), "PPpp")}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// --- Subcomponents ---

function UrlDisplay({ label, url, onCopy }: { label: string, url: string, onCopy: () => void }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>
            <div className="flex items-center gap-2">
                <code className="relative rounded bg-muted px-[0.5rem] py-[0.4rem] font-mono text-sm flex-1 truncate">
                    {url || "N/A"}
                </code>
                <Button variant="outline" size="icon" onClick={onCopy} disabled={!url}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
    let className = "";

    if (s === 'completed' || s === 'ready') {
        variant = "default"; // Usually black/primary
        className = "bg-green-600 hover:bg-green-700";
    } else if (s === 'processing') {
        variant = "secondary";
        className = "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100";
    } else if (s === 'failed' || s === 'error') {
        variant = "destructive";
    }

    return (
        <Badge variant={variant} className={`capitalize ${className}`}>
            {status}
        </Badge>
    );
}

function LoadingSkeleton() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-[150px] w-full" />
                </div>
            </div>
        </div>
    )
}