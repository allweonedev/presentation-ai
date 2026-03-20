"use client";

import type React from "react";

import { isChartType } from "@/components/notebook/presentation/editor/lib";
import { useUploadFile } from "@/components/plate/hooks/use-upload-file";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import {
  type ImageEditorMode,
  usePresentationState,
} from "@/states/presentation-state";
import { DRAG_ITEM_BLOCK } from "@platejs/dnd";
import {
  BarChart3,
  ImageIcon,
  Loader2,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";
import { type TElement } from "platejs";
import { useRef } from "react";
import { useDrop } from "react-dnd";
import { toast } from "sonner";

export interface ImagePlaceholderProps {
  isStatic?: boolean;
  className?: string;
  slideId: string;
  onOpenEditor?: (mode: ImageEditorMode) => void;
}

export default function ImagePlaceholder({
  isStatic = false,
  className,
  slideId,
  onOpenEditor,
}: ImagePlaceholderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setSlides = usePresentationState((s) => s.setSlides);
  const setCurrentSlideId = usePresentationState((s) => s.setCurrentSlideId);
  const { saveImmediately } = useDebouncedSave();
  const { uploadFile, isUploading, progress } = useUploadFile({
    onUploadComplete: (file) => {
      if (slideId) {
        setSlides((slides) =>
          slides.map((slide) =>
            slide.id === slideId
              ? {
                  ...slide,
                  rootImage: { ...slide.rootImage!, url: file.ufsUrl },
                }
              : slide,
          ),
        );
        void saveImmediately();
      }
    },
    onUploadError: (error) => {
      toast.error("Failed to upload image");
      console.error(error);
    },
  });
  const uploadProgress = Math.trunc(progress);

  const handleUploadClick = () => {
    if (!isStatic && fileInputRef.current) {
      setCurrentSlideId(slideId);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !isStatic) {
      setCurrentSlideId(slideId);
      void uploadFile(file);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isStatic) {
      setCurrentSlideId(slideId);
      onOpenEditor?.("generate");
    }
  };

  // Drop handler for charts
  const [{ isOver, canDrop }, drop] = useDrop<
    { element?: TElement },
    void,
    { isOver: boolean; canDrop: boolean }
  >(
    () => ({
      accept: DRAG_ITEM_BLOCK,
      canDrop: (item: { element?: TElement }) => {
        // Only accept chart elements
        return Boolean(item.element && isChartType(item.element.type));
      },
      drop: (item: { element?: TElement }) => {
        if (!item.element || isStatic) return;

        const chartType = item.element.type;
        const chartData = (item.element as unknown as { data?: unknown }).data;
        const chartOptions = {
          variant: (item.element as unknown as { variant?: string }).variant,
          disableAnimation: true,
        };

        // Update the slide's rootImage with the chart data
        setSlides(
          (slides) =>
            slides.map((slide) =>
              slide.id === slideId
                ? {
                    ...slide,
                    rootImage: {
                      ...slide.rootImage!,
                      chartType,
                      chartData,
                      chartOptions,
                      // Clear any existing image/embed data
                      url: undefined,
                      embedType: undefined,
                      imageSource: undefined,
                    },
                }
                : slide,
            ),
        );
        toast.success("Chart added to slide");
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [isStatic, setSlides, slideId],
  );

  return (
    <div
      ref={(el) => {
        if (el && !isStatic) drop(el);
      }}
      className={cn(
        "flex min-h-full items-center justify-center bg-background transition-colors",
        isOver && canDrop && "bg-primary/10 ring-2 ring-primary ring-inset",
        className,
      )}
      onDoubleClick={handleDoubleClick}
    >
      {isOver && canDrop ? (
        <div className="flex flex-col items-center gap-2 text-primary">
          <BarChart3 className="h-12 w-12" />
          <p className="text-sm font-medium">Drop chart here</p>
        </div>
      ) : (
        <div>
          <Empty className="w-full bg-card">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon />
              </EmptyMedia>
              <EmptyTitle className="text-primary">No image yet</EmptyTitle>
              <EmptyDescription>Upload or generate an image</EmptyDescription>
            </EmptyHeader>

            <EmptyContent className="flex-row gap-3 text-primary">
              <Button
                variant="outline"
                onClick={handleUploadClick}
                className="gap-2"
                disabled={isStatic || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="size-4" />
                    Upload
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setCurrentSlideId(slideId);
                  onOpenEditor?.("generate");
                }}
                disabled={isStatic}
                className="gap-2"
              >
                <Sparkles className="size-4" />
                AI Image
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setCurrentSlideId(slideId);
                  onOpenEditor?.("search");
                }}
                disabled={isStatic}
                className="gap-2"
              >
                <Search className="size-4" />
                Search for Image
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
