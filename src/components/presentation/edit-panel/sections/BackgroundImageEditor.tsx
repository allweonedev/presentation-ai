"use client";

import { SharedGenerateControls } from "@/components/presentation/shared/SharedGenerateControls";
import { SharedImageSearchControls } from "@/components/presentation/shared/SharedImageSearchControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUploadFile } from "@/hooks/canvas/useUploadFile";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import React from "react";

export function BackgroundImageEditor({
  config,
  updateConfig,
  onApply,
  className,
}: {
  config: Record<string, unknown>;
  updateConfig: (patch: Record<string, unknown>) => void;
  onApply: () => void;
  className?: string;
}) {
  const [imageMode, setImageMode] = React.useState<
    "upload-url" | "ai" | "search"
  >("upload-url");

  const { uploadFile, uploadedFile, isUploading, progress } = useUploadFile();
  const [previewUrl, setPreviewUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (uploadedFile?.url) setPreviewUrl(uploadedFile.url);
  }, [uploadedFile?.url]);

  const applyUrl = React.useCallback(() => {
    const url = previewUrl || (config?.backgroundImageUrl as string) || "";
    if (!url) return;
    const position = (config?.backgroundImagePosition as string) ?? "center";
    const repeat = (config?.backgroundImageRepeat as string) ?? "no-repeat";
    const background = `url(${url}) ${position}/cover ${repeat}`;
    updateConfig({
      backgroundType: "image",
      backgroundOverride: background,
      backgroundImageUrl: url,
    });
    onApply();
  }, [config, updateConfig, onApply, previewUrl]);

  return (
    <div className={cn("flex h-full min-h-0 flex-col gap-5 p-1", className)}>
      <div className="space-y-2">
        <Label className="text-xs">Source</Label>
        <Select
          value={imageMode}
          onValueChange={(v) => setImageMode(v as typeof imageMode)}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upload-url">Image upload or URL</SelectItem>
            <SelectItem value="ai">AI images</SelectItem>
            <SelectItem value="search">Web & Stock images</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {imageMode === "upload-url" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">URL</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Paste or enter image URL"
                value={(config?.backgroundImageUrl as string) ?? ""}
                onChange={(e) =>
                  updateConfig({ backgroundImageUrl: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Upload</Label>
            <PrettyUploadZone
              isUploading={isUploading}
              progress={progress}
              onPick={(file) => void uploadFile(file)}
            />
          </div>

          <Button className="w-full" onClick={applyUrl}>
            Apply Image Background
          </Button>
        </div>
      )}

      {imageMode === "ai" && (
        <SharedGenerateControls
          onImageSelect={(url) => setPreviewUrl(url)}
          className="min-h-0 flex-1"
        />
      )}

      {imageMode === "search" && (
        <SharedImageSearchControls
          onImageSelect={(url) => setPreviewUrl(url)}
          className="min-h-0 flex-1"
        />
      )}

      {previewUrl && imageMode !== "upload-url" && (
        <div className="sticky right-0 bottom-0 left-0 z-10 mt-auto border-t bg-background/80 p-2 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
          <div className="flex gap-2">
            <Button className="flex-1" onClick={applyUrl}>
              Apply Selected
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setPreviewUrl("")}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function PrettyUploadZone({
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
    <div className="relative w-full rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:bg-accent/10">
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
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-md border p-2 text-primary">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div className="text-sm">
          Drag a file or
          <button
            type="button"
            onClick={openPicker}
            className="ml-1 text-primary underline underline-offset-2"
          >
            click to upload
          </button>
        </div>
        <div className="text-xs text-muted-foreground">
          Tip: You can also paste an image URL above
        </div>
        {isUploading && (
          <div className="mt-1 text-xs text-muted-foreground">
            Uploading… {progress}%
          </div>
        )}
      </div>
    </div>
  );
}
