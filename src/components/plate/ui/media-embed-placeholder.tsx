"use client";

import { useUploadFile } from "@/components/plate/hooks/use-upload-file";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertTriangle, ExternalLink, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { embedTypeConfig, isValidEmbedUrl } from "./media-embeds";

interface MediaEmbedPlaceholderProps {
  embedType: string;
  onUrlSubmit: (url: string) => void;
  className?: string;
}

export function MediaEmbedPlaceholder({
  embedType,
  onUrlSubmit,
  className,
}: MediaEmbedPlaceholderProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config =
    embedTypeConfig[embedType as keyof typeof embedTypeConfig] ||
    embedTypeConfig.youtube;

  const isImageType = embedType === "image";

  // Upload hook for image upload
  const { uploadFile, isUploading, progress } = useUploadFile({
    onUploadComplete: (file) => {
      const uploadedUrl = file.ufsUrl ?? file.url;
      if (uploadedUrl) {
        setUrl(uploadedUrl);
        setIsValid(true);
        setError(null);
        // Automatically submit the uploaded image URL
        onUrlSubmit(uploadedUrl);
      }
    },
    onUploadError: (uploadError) => {
      setError("Failed to upload image");
      console.error(uploadError);
    },
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    // Reset the input so the same file can be re-selected
    e.target.value = "";
  };

  if (!config) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
        <p>Invalid embed type: {embedType}</p>
      </div>
    );
  }

  // TypeScript assertion that config is defined after the null check
  const safeConfig = config;

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setError(null);

    if (newUrl.trim()) {
      const valid = isValidEmbedUrl(newUrl, embedType);
      setIsValid(valid);
      if (!valid) {
        setError(`Invalid ${safeConfig.name} URL format`);
      }
    } else {
      setIsValid(false);
    }
  };

  const handleSubmit = () => {
    if (url.trim() && isValid) {
      onUrlSubmit(url.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && url.trim() && isValid) {
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg border-2 border-dashed",
        className,
      )}
    >
      {/* Background with embed type color */}
      <div className="absolute inset-0 opacity-5" />

      {/* Content */}
      <div className="relative flex min-h-[200px] flex-col items-center justify-center space-y-4 p-6">
        {/* Icon and title */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-xs">
            {safeConfig.icon}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{safeConfig.name}</h3>
            <p className="text-sm text-muted-foreground">
              {safeConfig.description}
            </p>
          </div>
        </div>

        {/* URL Input */}
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="embed-url" className="text-sm font-medium">
            URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="embed-url"
              type="url"
              placeholder={safeConfig.placeholder}
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-10 flex-1"
              disabled={isUploading}
            />
            {isImageType && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleUploadClick}
                disabled={isUploading}
                title="Upload image"
                className="h-10 w-10 shrink-0"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            )}
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {isUploading && (
            <div className="text-xs text-muted-foreground">
              Uploading... {Math.round(progress)}%
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!url.trim() || !isValid || isUploading}
          className="h-10 px-6 font-medium"
        >
          Add {safeConfig.name}
        </Button>

        {/* Example URL */}
        {url && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            <span className="max-w-xs truncate">{url}</span>
          </div>
        )}
      </div>
    </div>
  );
}
