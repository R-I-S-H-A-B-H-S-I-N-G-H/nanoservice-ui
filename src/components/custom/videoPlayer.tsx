import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

interface VideoPlayerProps {
  src: string; 
  poster?: string;
  onReady?: () => void;
}

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
  if (!src) return <div style={{color:"white"}}>Invalid URL</div>
  console.log(src);
  
  return (
    <MediaPlayer title="" src={src}>
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};