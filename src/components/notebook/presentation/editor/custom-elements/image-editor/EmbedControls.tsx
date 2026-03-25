"use client";

import { useUploadFile } from "@/components/plate/hooks/use-upload-file";
import {
  detectEmbedType,
  getAllEmbedTypes,
  isValidEmbedUrl,
} from "@/components/plate/ui/media-embeds";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  AlertTriangle,
  ExternalLink,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { type TElement } from "platejs";
import { useEffect, useRef, useState } from "react";
import { type RootImage as RootImageType } from "../../../utils/parser";
import { type ImageCropSettings } from "../../../utils/types";
import { EmbedRenderer } from "../embeds/EmbedRenderer";
import { ActionButtons } from "./ActionButtons";
import { ImagePreview } from "./ImagePreview";
import { type ImageDimensions } from "./useImageDimensions";

interface EmbedControlsProps {
  embedType?: string;
  embedUrl?: string;
  onEmbedChange: (embedType: string, url: string) => void;
  onClearEmbed: () => void;
  imageDimensions?: ImageDimensions;
  // Additional props for full image functionality
  element?: TElement & RootImageType;
  slideId?: string;
  isRootImage?: boolean;
  onOpenCrop?: () => void;
  cropSettings?: ImageCropSettings;
  onCropSettingsChange?: (settings: ImageCropSettings) => void;
}

export function EmbedControls({
  embedType,
  embedUrl,
  onEmbedChange,
  onClearEmbed,
  imageDimensions,
  element,
  slideId,
  isRootImage = true,
  onOpenCrop,
  cropSettings,
  onCropSettingsChange,
}: EmbedControlsProps) {
  const [selectedType, setSelectedType] = useState(embedType || "image");
  const [url, setUrl] = useState(embedUrl || "");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const embedTypes = getAllEmbedTypes();

  // Upload hook for image upload
  const { uploadFile, isUploading, progress } = useUploadFile({
    onUploadComplete: (file) => {
      const uploadedUrl = file.ufsUrl ?? file.ufsUrl;
      setUrl(uploadedUrl);
      setSelectedType("image");
      setIsValid(true);
      setError(null);
      // Automatically apply the embed with the uploaded image URL
      onEmbedChange("image", uploadedUrl);
    },
    onUploadError: (error) => {
      setError("Failed to upload image");
      console.error(error);
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

  useEffect(() => {
    if (url && selectedType) {
      const valid = isValidEmbedUrl(url, selectedType);
      setIsValid(valid);
      setError(valid ? null : "Invalid URL for selected embed type");
    } else {
      setIsValid(false);
      setError(null);
    }
  }, [url, selectedType]);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);

    // Auto-detect embed type if not selected
    if (!selectedType && newUrl) {
      const detectedType = detectEmbedType(newUrl);
      if (detectedType) {
        setSelectedType(detectedType);
      }
    }
  };

  const handleApply = () => {
    if (selectedType && url && isValid) {
      onEmbedChange(selectedType, url);
    }
  };

  const handleClear = () => {
    setSelectedType("");
    setUrl("");
    setError(null);
    setIsValid(false);
    onClearEmbed();
  };

  // Calculate thumbnail scale to fit in 90x90 box
  const thumbnailDimensions = imageDimensions
    ? {
        ...imageDimensions,
        scale: Math.min(
          360 / imageDimensions.width,
          360 / imageDimensions.height,
        ),
      }
    : { width: 360, height: 360, scale: 1 };

  // Create element for ImagePreview when type is "image"
  const imageElement = element ?? {
    type: "rootImage" as const,
    children: [] as never[],
    url: url,
    query: "",
  };

  // Local crop settings for image preview
  const localCropSettings = cropSettings ?? {
    objectFit: "cover" as const,
    objectPosition: { x: 50, y: 50 },
    zoom: 1,
  };

  const isImageType = selectedType === "image";

  return (
    <div className="flex w-90 flex-col space-y-6 overflow-clip">
      {/* Mini Preview */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-center">
          <div className="relative flex size-90 items-center justify-center overflow-hidden rounded-md border bg-muted shadow-xs">
            {isImageType ? (
              imageDimensions ? (
                <ImagePreview
                  element={
                    {
                      ...imageElement,
                      url: url || imageElement.url,
                    } as TElement & RootImageType
                  }
                  currentMode="embed"
                  localCropSettings={localCropSettings}
                  imageDimensions={thumbnailDimensions}
                  onCropSettingsChange={onCropSettingsChange ?? (() => {})}
                  hideControls={true}
                />
              ) : url ? (
                // biome-ignore lint/performance/noImgElement: This is necessary to support different types of thing
                <img
                  src={url}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  Enter an image URL
                </div>
              )
            ) : (
              <div
                style={{
                  width: thumbnailDimensions.width * thumbnailDimensions.scale,
                  height:
                    thumbnailDimensions.height * thumbnailDimensions.scale,
                }}
              >
                <EmbedRenderer
                  embedType={selectedType}
                  url={url}
                  className="pointer-events-none h-full w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Only show for image type when we have a URL */}
        {isImageType && (url || embedUrl) && element && (
          <div className="flex justify-center">
            <ActionButtons
              element={element}
              slideId={slideId}
              isRootImage={isRootImage}
              imageUrl={url || embedUrl}
              onOpenCrop={onOpenCrop}
              cropSettings={localCropSettings}
              onCropSettingsChange={onCropSettingsChange}
              showInOverlay={true}
            />
          </div>
        )}
      </div>

      <div className="max-w-full space-y-3">
        <Label className="text-sm font-medium">Embed Type</Label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Select embed type" />
          </SelectTrigger>
          <SelectContent>
            {embedTypes.map(({ type, config }) => (
              <SelectItem key={type} value={type}>
                {config.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="max-w-full space-y-3">
        <Label className="text-sm font-medium">URL</Label>
        <div className="flex gap-2">
          <Input
            placeholder={
              isImageType
                ? "Paste your image URL here..."
                : "Paste your embed URL here..."
            }
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="flex-1 font-mono text-sm"
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
              className="shrink-0"
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
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-3 pt-2">
        <Button
          onClick={handleApply}
          disabled={!selectedType || !url || !isValid}
          className="w-full"
        >
          {isImageType ? "Apply Image URL" : "Apply Embed"}
        </Button>

        {embedType && (
          <Button
            variant="outline"
            onClick={handleClear}
            className="w-full text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Embed
          </Button>
        )}
      </div>

      {url && (
        <div className="flex items-center gap-2 overflow-hidden rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
          <ExternalLink className="h-3 w-3 shrink-0" />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-1 max-w-full flex-1 text-ellipsis hover:underline"
          >
            {url}
          </a>
        </div>
      )}
    </div>
  );
}
