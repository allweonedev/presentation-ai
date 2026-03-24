"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Download, Image as ImageIcon, Minus, Plus, Scan } from "lucide-react";
import { type TElement } from "platejs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type RootImage as RootImageType } from "../../../utils/parser";
import { type ImageCropSettings } from "../../../utils/types";
import { type ImageDimensions } from "./useImageDimensions";

// Local definition since this component is deprecated/unused but kept for reference
type EditorMode = "generate" | "crop" | "embed" | "search" | "your-images";

interface ImagePreviewProps {
  element: TElement & RootImageType;
  currentMode: EditorMode;
  localCropSettings: ImageCropSettings;
  imageDimensions: ImageDimensions;
  onCropSettingsChange: (settings: ImageCropSettings) => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
  hideControls?: boolean;
}

export function ImagePreview({
  element,
  currentMode,
  localCropSettings,
  imageDimensions,
  onCropSettingsChange,
  hideControls = false,
}: ImagePreviewProps) {
  const zoom = useMemo(() => {
    const currentZoom = localCropSettings.zoom ?? 1;
    return Math.max(1, Math.min(2, currentZoom));
  }, [localCropSettings]);

  const setZoom = useCallback(
    (zoom: number) => {
      const clampedZoom = Math.max(1, Math.min(2, zoom));
      onCropSettingsChange({
        ...localCropSettings,
        zoom: clampedZoom,
      });
    },
    [localCropSettings, onCropSettingsChange],
  );

  // Custom crop state for panning
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastObjectPosition, setLastObjectPosition] = useState({
    x: localCropSettings.objectPosition.x,
    y: localCropSettings.objectPosition.y,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent default behavior
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLastObjectPosition({
        x: localCropSettings.objectPosition.x,
        y: localCropSettings.objectPosition.y,
      });
    },
    [localCropSettings.objectPosition],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      e.preventDefault(); // Prevent text selection

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Get container dimensions
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      // Convert pixel movement to percentage with increased sensitivity (3x faster)
      const deltaXPercent = (deltaX / containerWidth) * 100 * 3;
      const deltaYPercent = (deltaY / containerHeight) * 100 * 3;

      // Calculate new object position
      const newX = Math.max(
        0,
        Math.min(100, lastObjectPosition.x + deltaXPercent),
      );
      const newY = Math.max(
        0,
        Math.min(100, lastObjectPosition.y + deltaYPercent),
      );

      onCropSettingsChange({
        ...localCropSettings,
        objectPosition: { x: newX, y: newY },
      });
    },
    [
      isDragging,
      dragStart,
      lastObjectPosition,
      localCropSettings,
      onCropSettingsChange,
    ],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // Only zoom on wheel if we are in crop mode
      if (currentMode !== "crop") return;

      e.preventDefault();

      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newZoom = Math.max(1, Math.min(2, zoom + delta));

      setZoom(newZoom);
    },
    [zoom, setZoom, currentMode],
  );

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const preventSelection = (e: Event) => e.preventDefault();

      // Add global event listeners
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("selectstart", preventSelection);
      document.addEventListener("dragstart", preventSelection);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("selectstart", preventSelection);
        document.removeEventListener("dragstart", preventSelection);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleDownload = useCallback(async () => {
    if (!element.url) return;
    try {
      const response = await fetch(element.url);
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
    }
  }, [element.url]);

  if (!element.url) {
    return (
      <div className="flex h-full min-h-[300px] w-full animate-in flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-muted/30 p-8 text-center duration-500 fade-in">
        <div className="rounded-full bg-muted p-4">
          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">No image selected</h3>
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">
            Generate a new image or search for one to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex h-full w-full flex-col items-center justify-center">
      {/* Image Preview Area */}
      <div
        className={cn(
          "relative overflow-hidden rounded-md shadow-xs transition-all duration-300",
          currentMode === "crop" && "ring-2 ring-primary ring-offset-2",
        )}
        style={{
          width: imageDimensions.width * imageDimensions.scale,
          height: imageDimensions.height * imageDimensions.scale,
        }}
      >
        <div
          ref={containerRef}
          className={cn(
            "h-full w-full bg-muted",
            currentMode === "crop"
              ? "cursor-grab active:cursor-grabbing"
              : "cursor-default",
          )}
          onMouseDown={currentMode === "crop" ? handleMouseDown : undefined}
          onWheel={handleWheel}
          onDragStart={(e) => e.preventDefault()}
        >
          {/** biome-ignore lint/performance/noImgElement: This is a valid use case */}
          <img
            src={element.url}
            alt={element.query ?? "Presentation image"}
            loading="lazy"
            decoding="async"
            className="h-full w-full transition-transform duration-75"
            style={{
              objectFit: localCropSettings.objectFit,
              objectPosition: `${localCropSettings.objectPosition.x}% ${localCropSettings.objectPosition.y}%`,
              transform: `scale(${localCropSettings.zoom ?? 1})`,
              transformOrigin: `${localCropSettings.objectPosition.x}% ${localCropSettings.objectPosition.y}%`,
              pointerEvents: "none",
            }}
            draggable={false}
          />

          {/* Crop Grid Overlay */}
          {currentMode === "crop" && (
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 border border-white/30" />
              <div className="absolute top-0 bottom-0 left-1/3 border-l border-white/20" />
              <div className="absolute top-0 right-1/3 bottom-0 border-l border-white/20" />
              <div className="absolute top-1/3 right-0 left-0 border-t border-white/20" />
              <div className="absolute right-0 bottom-1/3 left-0 border-t border-white/20" />
            </div>
          )}
        </div>
      </div>

      {/* Floating Controls Toolbar */}
      {!hideControls && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-2 items-center gap-2 rounded-full border bg-background/80 p-1.5 px-3 opacity-0 shadow-lg backdrop-blur-xs transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleDownload}
            title="Download Image"
          >
            <Download className="h-4 w-4" />
          </Button>

          {currentMode === "crop" && (
            <>
              <div className="mx-1 h-4 w-px bg-border" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                disabled={zoom <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <div className="w-24 px-2">
                <Slider
                  value={[zoom]}
                  onValueChange={([value]) => setZoom(value ?? 1)}
                  min={1}
                  max={2}
                  step={0.01}
                  className="cursor-pointer"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                disabled={zoom >= 2}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <div className="mx-1 h-4 w-px bg-border" />
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full",
                  localCropSettings.objectFit === "contain" &&
                    "bg-muted text-primary",
                )}
                onClick={() => {
                  const newFit =
                    localCropSettings.objectFit === "cover"
                      ? "contain"
                      : "cover";
                  onCropSettingsChange({
                    ...localCropSettings,
                    objectFit: newFit,
                  });
                }}
                title="Toggle Fit/Cover"
              >
                <Scan className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
