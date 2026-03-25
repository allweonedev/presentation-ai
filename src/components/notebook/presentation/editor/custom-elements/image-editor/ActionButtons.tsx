"use client";

import { useUploadFile } from "@/components/plate/hooks/use-upload-file";
import { Button } from "@/components/ui/button";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { Download, Loader2, Scan, Scissors, Trash, Upload } from "lucide-react";
import { type TElement } from "platejs";
import { useEditorRef } from "platejs/react";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { type RootImage as RootImageType } from "../../../utils/parser";
import { type ImageCropSettings } from "../../../utils/types";

interface ActionButtonsProps {
  imageUrl?: string;
  slideId?: string;
  isRootImage: boolean;
  element: TElement & RootImageType;
  onOpenCrop?: () => void;
  cropSettings?: ImageCropSettings;
  onCropSettingsChange?: (settings: ImageCropSettings) => void;
  showInOverlay?: boolean;
}

export function ActionButtons({
  element,
  slideId,
  isRootImage,
  imageUrl,
  onOpenCrop,
  cropSettings,
  onCropSettingsChange,
  showInOverlay = false,
}: ActionButtonsProps) {
  const editor = useEditorRef(slideId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveImmediately } = useDebouncedSave();

  const { uploadFile, isUploading, progress } = useUploadFile({
    onUploadComplete: (file) => {
      const { setSlides } = usePresentationState.getState();
      if (isRootImage) {
        setSlides((slides) =>
          slides.map((slide) =>
            slide.id === slideId
              ? {
                  ...slide,
                  rootImage: {
                    ...slide.rootImage!,
                    url: file.ufsUrl,
                    embedType: undefined, // Clear embed type when uploading image
                  },
                }
              : slide,
          ),
        );
        void saveImmediately();
      } else {
        editor.tf.setNodes(
          { url: file.ufsUrl, embedType: undefined }, // Clear embed type when uploading image
          { at: editor.api.findPath(element) },
        );
      }
    },
    onUploadError: (error) => {
      toast.error("Failed to upload image");
      console.error(error);
    },
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
  };

  const handleDownload = useCallback(async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download image:", err);
      toast.error("Failed to download image");
    }
  }, [imageUrl]);

  const handleToggleFit = useCallback(() => {
    if (!cropSettings || !onCropSettingsChange) return;
    const newFit = cropSettings.objectFit === "cover" ? "contain" : "cover";
    onCropSettingsChange({
      ...cropSettings,
      objectFit: newFit,
    });
  }, [cropSettings, onCropSettingsChange]);

  const handleDelete = useCallback(() => {
    const { setSlides, clearRootImageGeneration } =
      usePresentationState.getState();
    if (isRootImage) {
      setSlides((slides) =>
        slides.map((slide) =>
          slide.id === slideId
            ? {
                ...slide,
                rootImage: {
                  ...slide.rootImage!,
                  url: undefined,
                  embedType: undefined,
                  imageSource: undefined,
                  cropSettings: undefined,
                },
              }
            : slide,
        ),
      );
      if (slideId) {
        clearRootImageGeneration(slideId);
      }
      void saveImmediately();
    } else {
      editor.tf.setNodes(
        {
          url: undefined,
          query: undefined,
          embedType: undefined,
          cropSettings: undefined,
        },
        { at: editor.api.findPath(element) },
      );
      void saveImmediately();
    }
    toast.success("Image deleted");
  }, [isRootImage, slideId, editor, element, saveImmediately]);

  if (showInOverlay) {
    return (
      <>
        <div className="flex items-center gap-2">
          {imageUrl && (
            <>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full"
                onClick={handleDownload}
                title="Download Image"
              >
                <Download className="h-4 w-4" />
              </Button>

              {onOpenCrop && (
                <>
                  <div className="h-4 w-px bg-border/50" />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full"
                    onClick={onOpenCrop}
                    title="Crop Image"
                  >
                    <Scissors className="h-4 w-4" />
                  </Button>
                </>
              )}

              {cropSettings && onCropSettingsChange && (
                <Button
                  size="icon"
                  variant="secondary"
                  className={cn(
                    "h-8 w-8 rounded-full",
                    cropSettings.objectFit === "contain" &&
                      "bg-primary/20 text-primary hover:bg-primary/30",
                  )}
                  onClick={handleToggleFit}
                  title="Toggle Fit/Cover"
                >
                  <Scan className="h-4 w-4" />
                </Button>
              )}

              <div className="h-4 w-px bg-border/50" />
            </>
          )}

          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full"
            onClick={handleUploadClick}
            disabled={isUploading}
            title="Upload Image"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>

          {imageUrl && (
            <>
              <div className="h-4 w-px bg-border/50" />
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleDelete}
                title="Delete Image"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </>
    );
  }

  return (
    <div className="flex gap-2">
      {/* Upload Button - Direct Action */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleUploadClick}
        className="gap-2"
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {isUploading ? `${progress}%` : "Upload"}
      </Button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
