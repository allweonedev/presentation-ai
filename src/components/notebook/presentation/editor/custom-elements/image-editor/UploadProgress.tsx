"use client";

import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
}

export function UploadProgress({ isUploading, progress }: UploadProgressProps) {
  if (!isUploading) return null;

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">Uploading image...</div>
      <div className="flex items-center gap-3">
        <Progress value={progress} className="flex-1" />
        <span className="w-12 text-right text-xs text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
