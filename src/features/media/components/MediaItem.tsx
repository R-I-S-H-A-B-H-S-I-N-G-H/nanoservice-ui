import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Media } from "../types";
import { API_BASE_URL } from "../constants";

interface MediaItemProps {
  media: Media;
  onClick: (media: Media) => void;
}

export function MediaItem({ media, onClick }: MediaItemProps) {
  return (
    <Card onClick={() => onClick(media)} className="cursor-pointer">
      <CardContent className="p-0">
        <img
          alt="Media preview"
          className="aspect-square w-full rounded-t-md object-cover"
          src={`${API_BASE_URL}${media.url}`}
        />
      </CardContent>
      <CardHeader className="p-2">
        <CardTitle className="text-sm">{media.name}</CardTitle>
      </CardHeader>
    </Card>
  );
}
