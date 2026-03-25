import { cn } from "@/lib/utils";
import { Loader2, Upload } from "lucide-react";
import React from "react";

export function CompactUploadZone({
  isUploading,
  progress,
  onPick,
}: {
  isUploading: boolean;
  progress: number;
  onPick: (file: File) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const openPicker = () => inputRef.current?.click();

  return (
    <div
      onClick={openPicker}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/50 bg-muted/20 px-4 py-8 text-center transition-all hover:border-primary/50 hover:bg-muted/40",
        isUploading && "pointer-events-none opacity-60",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        }}
      />
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Uploading... {progress}%
          </span>
        </div>
      ) : (
        <>
          <div className="rounded-full bg-background p-2 shadow-xs ring-1 ring-border/50">
            <Upload className="size-4 text-muted-foreground" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-foreground">
              Click to upload
            </p>
            <p className="text-[10px] text-muted-foreground">
              SVG, PNG, JPG or GIF
            </p>
          </div>
        </>
      )}
    </div>
  );
}
