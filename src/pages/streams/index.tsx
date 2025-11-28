"use client";

import React, { useEffect, useState } from "react";
import { 
  Copy, 
  Check, 
  AlertCircle, 
  Activity, 
  Server, 
  Calendar,
  RefreshCw,
  Settings,
  Signal,
  MonitorPlay
} from "lucide-react";
import { format } from "date-fns";
import { useParams } from "react-router";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Custom Components & API
import { VideoPlayer } from "@/components/custom/videoPlayer";
import type { Stream } from "@/types/stream";
import { getStream } from "@/api/streamsApi";
import { conf } from "../../../config";

// --- COMPONENT: STATUS BADGE ---
// const StreamStatusBadge = ({ status }: { status: string }) => {
//     const normalized = status?.toLowerCase() || "unknown";
    
//     const styles = {
//       active: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
//       ready: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
//       processing: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
//       failed: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
//       default: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
//     };
  
//     const currentStyle = styles[normalized as keyof typeof styles] || styles.default;
//     const isLive = normalized === 'active' || normalized === 'ready';
  
//     return (
//       <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${currentStyle}`}>
//         {isLive && (
//           <span className="relative flex h-2 w-2">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
//           </span>
//         )}
//         {status}
//       </div>
//     );
// };

export default function Stream() {
    const params = useParams();
    const { userid, orgid, streamid } = params;
    const [data, setData] = useState<Stream | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [params]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const streamId = streamid;
            const result = await getStream(orgid, userid, streamId);
            result["stream_url"] = `${conf.CDN_BASE_URL}/${result["stream_url"]}`
            setData(result);
        } catch (err: any) {
            console.error(err);
            setError("Failed to load stream details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text: string, field: string) => {
        if(!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // --- LOADING STATE ---
    if (loading) {
        return (
            <div className="min-h-screen bg-muted/30 p-8 space-y-8">
                <div className="container mx-auto max-w-7xl space-y-6">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Skeleton className="lg:col-span-2 h-[450px] rounded-xl" />
                        <Skeleton className="h-[450px] rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    // --- ERROR STATE ---
    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
                <Card className="max-w-md w-full border-destructive/50">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="p-3 bg-destructive/10 rounded-full">
                            <AlertCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <div className="flex-1">
                            <CardTitle>Error Loading Stream</CardTitle>
                            <CardDescription>{error || "Stream not found"}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" onClick={fetchData} className="w-full">
                            Retry Connection
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const playerOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{ src: data.stream_url, type: "application/x-mpegURL" }],
    };

    return (
        <div className="min-h-screen bg-muted/30 font-sans pb-12">
            
            {/* Header Section */}
            <header className="bg-background border-b sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
                    
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                            {data.name || "Untitled Stream"}
                        </h1>
                        <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                            <span className="opacity-50">ID:</span> {data.id}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Last Updated</span>
                            <span className="text-xs font-medium">
                                {data.updated_at ? format(new Date(data.updated_at), "MMM d, HH:mm") : "-"}
                            </span>
                        </div>
                        <Separator orientation="vertical" className="h-8 hidden sm:block" />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            type="button" 
                            onClick={(e) => {
                                e.preventDefault();
                                fetchData();
                            }} 
                            title="Refresh Data"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        {/* <StreamStatusBadge status={data?.status || 'unknown'} /> */}
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-7xl p-6 space-y-8 mt-2">
                
                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Player & Metrics */}
                    <div className="xl:col-span-2 space-y-6">
                        <Card className="overflow-hidden border-none shadow-lg bg-black ring-1 ring-border/50">
                            <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                                {data.stream_url ? (
                                    <VideoPlayer options={playerOptions} />
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-white/30">
                                        <MonitorPlay className="h-16 w-16 opacity-50" />
                                        <p className="font-medium">Stream Offline</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatsCard 
                                label="Resolution" 
                                value={data.res?.[0] ? `${data.res[0]}p` : "N/A"} 
                                icon={<Activity className="h-4 w-4 text-primary" />} 
                            />
                            <StatsCard 
                                label="Source Type" 
                                value={data.input_media_url ? "VOD / URL" : "Live"} 
                                icon={<Server className="h-4 w-4 text-primary" />} 
                            />
                            <StatsCard 
                                label="Bitrate" 
                                value="Adaptive" 
                                icon={<Signal className="h-4 w-4 text-primary" />} 
                            />
                            <StatsCard 
                                label="Created" 
                                value={format(new Date(data.created_at), "MMM d")} 
                                icon={<Calendar className="h-4 w-4 text-primary" />} 
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Configuration */}
                    <div className="space-y-6">
                        <Card className="h-full shadow-sm border-border/60">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Connection Details
                                </CardTitle>
                                <CardDescription>Endpoints for playback and integration.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                
                                {/* HLS Output */}
                                <div className="space-y-2">
                                    <Label htmlFor="hls-url" className="text-xs font-semibold uppercase text-muted-foreground">
                                        HLS Output URL
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            id="hls-url"
                                            value={data.stream_url || ""}
                                            readOnly
                                            className="font-mono text-xs bg-muted/50 h-9"
                                        />
                                        <Button 
                                            type="button" 
                                            size="sm" 
                                            variant="secondary" 
                                            className="h-9 w-9 p-0 shrink-0"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleCopy(data.stream_url, 'stream_url');
                                            }}
                                        >
                                            {copiedField === 'stream_url' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                {/* Input Source */}
                                <div className="space-y-2">
                                    <Label htmlFor="input-url" className="text-xs font-semibold uppercase text-muted-foreground">
                                        Source Input
                                    </Label>
                                    {data.input_media_url ? (
                                        <div className="flex gap-2">
                                            <Input 
                                                id="input-url"
                                                value={data.input_media_url}
                                                readOnly
                                                className="font-mono text-xs bg-muted/50 h-9 text-muted-foreground"
                                            />
                                            <Button 
                                                type="button"
                                                size="sm" 
                                                variant="outline" 
                                                className="h-9 w-9 p-0 shrink-0"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCopy(data.input_media_url!, 'input_url');
                                                }}
                                            >
                                                {copiedField === 'input_url' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="h-9 flex items-center px-3 border rounded-md bg-muted/20 text-xs text-muted-foreground italic">
                                            Direct Upload / Push
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-lg bg-muted/40 p-3 space-y-3 mt-4 border">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground text-xs">Org ID</span>
                                        <code className="text-xs bg-background px-1.5 py-0.5 rounded border">{data.org_id}</code>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground text-xs">User ID</span>
                                        <code className="text-xs bg-background px-1.5 py-0.5 rounded border">{data.user_id}</code>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatsCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <Card className="border shadow-sm bg-card/50">
            <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2 opacity-70">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">{label}</span>
                    {icon}
                </div>
                <span className="text-lg font-bold tracking-tight truncate">{value}</span>
            </CardContent>
        </Card>
    );
}