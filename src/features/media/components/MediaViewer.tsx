import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Media } from "../types";
import { API_BASE_URL } from "../constants";

interface MediaViewerProps {
  media: Media;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function MediaViewer({ media, onClose, onNext, onPrev }: MediaViewerProps) {
  return (
    <Dialog open={!!media} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{media.name}</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <img
            alt="Media preview"
            className="aspect-video w-full rounded-md object-contain"
            src={`${API_BASE_URL}${media.url}`}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2"
            onClick={onPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onClick={onNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
