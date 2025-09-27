import type { Media } from "../types";
import { MediaItem } from "./MediaItem";

interface MediaGridProps {
  media: Media[];
  onItemClick: (media: Media) => void;
}

export function MediaGrid({ media, onItemClick }: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {media.map((item) => (
        <MediaItem key={item.id} media={item} onClick={onItemClick} />
      ))}
    </div>
  );
}
