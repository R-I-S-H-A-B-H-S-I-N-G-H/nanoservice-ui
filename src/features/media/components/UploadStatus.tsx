
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Upload {
  file: { name: string } | File;
  progress: number;
}

interface UploadStatusProps {
  uploads: Upload[];
}

export function UploadStatus({ uploads }: UploadStatusProps) {
  if (uploads.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Uploads</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {uploads.map((upload) => (
          <div key={upload.file.name} className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate">{upload.file.name}</span>
              <span className="text-sm text-muted-foreground">{Math.round(upload.progress)}%</span>
            </div>
            <Progress value={upload.progress} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
