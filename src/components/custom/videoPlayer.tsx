// components/custom/videoPlayer.tsx
import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type Player from 'video.js/dist/types/player';

interface VideoPlayerProps {
  options: any;
  onReady?: (player: Player) => void;
}

export const VideoPlayer = ({ options, onReady }: VideoPlayerProps) => {
  const videoNode = useRef<HTMLDivElement>(null);
  const player = useRef<Player | null>(null);

  useEffect(() => {
    if (!player.current) {
      const videoElement = document.createElement("video-js");
      
      // Add 'vjs-neo-brutal' for our custom scoping
      videoElement.classList.add('vjs-big-play-centered', 'vjs-neo-brutal');
      
      if (videoNode.current) {
         videoNode.current.appendChild(videoElement);
      }

      player.current = videojs(videoElement, options, () => {
        onReady && onReady(player.current!);
      });

    } else {
      const p = player.current;
      if(options.sources) {
          p.src(options.sources);
      }
    }
  }, [options, onReady]);

  useEffect(() => {
    const playerCurrent = player.current;
    return () => {
      if (playerCurrent && !playerCurrent.isDisposed()) {
        playerCurrent.dispose();
        player.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full font-mono">
      {/* Container Chassis:
        - Black border (3px)
        - Hard Black Shadow (8px)
      */}
      <div 
        ref={videoNode} 
        className="w-full h-full border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-black" 
      />

      <style>{`
        /* --- FONTS & BASICS --- */
        .vjs-neo-brutal {
          font-family: 'Courier New', monospace;
          background-color: #000; /* Black screen background */
        }

        /* --- BIG PLAY BUTTON --- */
        /* Center it, make it square, yellow, and hard shadowed */
        .vjs-neo-brutal .vjs-big-play-button {
          background-color: #FFD93D !important; /* Yellow */
          color: black !important;
          border: 3px solid black !important;
          border-radius: 0 !important; /* SQUARE */
          width: 80px;
          height: 80px;
          line-height: 76px;
          font-size: 4em;
          margin-top: -40px; /* Center adjustment */
          margin-left: -40px;
          box-shadow: 6px 6px 0px 0px #000 !important;
          transition: transform 0.1s, box-shadow 0.1s;
        }

        /* Hover Effect: "Press" the button */
        .vjs-neo-brutal .vjs-big-play-button:hover {
          background-color: #FF6B6B !important; /* Pink on Hover */
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0px 0px #000 !important;
        }

        /* --- CONTROL BAR --- */
        /* Solid black bar, white icons */
        .vjs-neo-brutal .vjs-control-bar {
          background-color: #000 !important;
          border-top: 3px solid #000;
          height: 3.5em;
          opacity: 1;
        }

        /* Icons */
        .vjs-neo-brutal .vjs-button {
          color: white !important;
        }
        .vjs-neo-brutal .vjs-button:hover {
          color: #FFD93D !important; /* Yellow Hover */
        }

        /* --- PROGRESS BAR --- */
        /* Make it thick and blocky */
        .vjs-neo-brutal .vjs-progress-holder {
          height: 1.2em !important;
          background-color: #333 !important; /* Dark Grey Track */
          margin: 0 !important;
          border-top: 3px solid black;
        }

        /* The Played Part (Green) */
        .vjs-neo-brutal .vjs-play-progress {
          background-color: #6BCB77 !important; /* Green */
        }

        /* The Buffer Part */
        .vjs-neo-brutal .vjs-load-progress {
          background: #555 !important;
        }
        .vjs-neo-brutal .vjs-load-progress div {
          background: #555 !important;
        }

        /* Remove the little circle handle (we want a flat bar) */
        .vjs-neo-brutal .vjs-play-progress:before {
          display: none; 
        }

        /* --- VOLUME PANEL --- */
        .vjs-neo-brutal .vjs-volume-panel {
           margin-left: 10px;
        }
        .vjs-neo-brutal .vjs-volume-level {
          background-color: #FFD93D !important; /* Yellow Volume */
        }
        .vjs-neo-brutal .vjs-volume-level:before {
            display: none;
        }

        /* --- CLEANUP --- */
        /* Remove gradients and text shadows */
        .vjs-neo-brutal .vjs-text-track-display div, 
        .vjs-neo-brutal .vjs-modal-dialog-content {
           text-shadow: none !important;
        }
      `}</style>
    </div>
  );
}