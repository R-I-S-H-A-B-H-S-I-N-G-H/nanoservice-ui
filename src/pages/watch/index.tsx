import { useParams } from "react-router";
import { useState } from "react";
import { conf } from "../../../config";
import { VideoPlayer } from "@/components/custom/videoPlayer";
import { Button } from "@/components/ui/button";
import { Copy, Check, Play } from "lucide-react";
import { toast } from "sonner"; // Assuming you use sonner or similar for toasts

export default function Watch() {
    const { watchid } = useParams();
    const [copied, setCopied] = useState(false);

    function generateMediaUrl() {
        return `${conf.STREAM_BASE_URL}/stream/${watchid}/playlist.m3u8`;
    }

    const videoJsOptions = {
        src: generateMediaUrl(),
        poster: "" // Add poster URL if available
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        // 1. Full screen black background container
        <div className="min-h-screen w-full bg-[#0a0a0a] text-zinc-100 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
            
            <div className="w-full max-w-5xl mx-auto flex flex-col">
                
                {/* 2. Video Player Wrapper with subtle border */}
                {/* The 'group' class allows us to style children based on hover state if needed */}
                <div className="relative w-full aspect-video bg-black border border-zinc-800 shadow-2xl overflow-hidden rounded-t-sm z-10">
                    <VideoPlayer {...videoJsOptions} />
                </div>

                {/* 3. The "Mux Style" Footer Bar */}
                {/* We use a grid to create that divided look from the screenshot */}
                <div className="grid grid-cols-1 md:grid-cols-4 border-x border-b border-zinc-800 bg-black/40 rounded-b-sm backdrop-blur-sm">
                    
                    {/* Section A: Copy Link (Spans 2-3 cols or centered on mobile) */}
                    <div className="md:col-span-3 flex items-center justify-center md:justify-start p-4 border-b md:border-b-0 md:border-r border-zinc-800">
                        <Button 
                            variant="ghost" 
                            onClick={handleCopyLink}
                            className="text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 font-mono text-xs tracking-wider uppercase h-8"
                        >
                            {copied ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                            {copied ? "Copied" : "Copy Link"}
                        </Button>
                    </div>

                    {/* Section B: Branding (Right aligned) */}
                    <div className="md:col-span-1 flex items-center justify-center md:justify-end p-4">
                        <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono tracking-[0.2em] text-zinc-600 uppercase">
                            <span>Powered by</span>
                            {/* Replace MUX logo with text or your own logo */}
                            <span className="text-white font-bold flex items-center gap-1">
                                <Play className="w-3 h-3 fill-white" />
                                Nanoservice
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Optional: Background ambient glow for cinematic effect */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black opacity-50" />
        </div>
    );
}