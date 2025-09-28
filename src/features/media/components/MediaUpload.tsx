import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MediaUploadProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: FileList) => void;
}

export function MediaUpload({ open, onClose, onUpload }: MediaUploadProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Select files to upload to your media library.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <Input
              id="files"
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  onUpload(e.target.files);
                }
              }}
            />
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={() => { /* Handle upload */ }}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
