"use client";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type ImageCropSettings } from "../../../utils/types";
import { type ImageDimensions } from "./useImageDimensions";

interface CropModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  initialCropSettings: ImageCropSettings;
  onSave: (settings: ImageCropSettings) => void;
  imageDimensions: ImageDimensions;
}

export function CropModal({
  open,
  onOpenChange,
  imageUrl,
  initialCropSettings,
  onSave,
  imageDimensions,
}: CropModalProps) {
  const [cropSettings, setCropSettings] =
    useState<ImageCropSettings>(initialCropSettings);
  const [naturalDimensions, setNaturalDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize state when opening
  useEffect(() => {
    if (open) {
      setCropSettings(initialCropSettings);
    }
  }, [open, initialCropSettings]);

  // Calculate display dimensions to fit in modal while maintaining exact aspect ratio from imageDimensions
  const displayDimensions = useMemo(() => {
    if (
      !imageDimensions ||
      imageDimensions.width === 0 ||
      imageDimensions.height === 0
    ) {
      return { width: 0, height: 0 };
    }

    // Maximum available space in the modal (approximate)
    const MAX_WIDTH = 900;
    const MAX_HEIGHT = 600;

    const width = imageDimensions.width;
    const height = imageDimensions.height;

    const fitScale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);

    return {
      width: width * fitScale,
      height: height * fitScale,
    };
  }, [imageDimensions]);

  // Load image dimensions
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  // Dragging Logic
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastObjectPosition, setLastObjectPosition] = useState({
    x: cropSettings.objectPosition.x,
    y: cropSettings.objectPosition.y,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLastObjectPosition({
        x: cropSettings.objectPosition.x,
        y: cropSettings.objectPosition.y,
      });
    },
    [cropSettings.objectPosition],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || displayDimensions.width === 0) return;

      e.preventDefault();

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Convert pixel movement to percentage
      // Using displayDimensions as the container size
      const deltaXPercent = (deltaX / displayDimensions.width) * 100 * 3;
      const deltaYPercent = (deltaY / displayDimensions.height) * 100 * 3;

      const newX = Math.max(
        0,
        Math.min(100, lastObjectPosition.x + deltaXPercent),
      );
      const newY = Math.max(
        0,
        Math.min(100, lastObjectPosition.y + deltaYPercent),
      );

      setCropSettings((prev) => ({
        ...prev,
        objectPosition: { x: newX, y: newY },
      }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, lastObjectPosition, displayDimensions]);

  // Calculate Background Image Style
  const getBackgroundStyle = () => {
    if (!naturalDimensions || displayDimensions.width === 0) return {};

    const { width: naturalW, height: naturalH } = naturalDimensions;
    const { width: boxW, height: boxH } = displayDimensions;

    // Calculate cover scale (what object-fit: cover does)
    const scaleX = boxW / naturalW;
    const scaleY = boxH / naturalH;
    const coverScale = Math.max(scaleX, scaleY);

    // Apply Zoom
    const zoom = cropSettings.zoom || 1;

    // Target dimensions of the image as rendered in the foreground
    const renderedW = naturalW * coverScale * zoom;
    const renderedH = naturalH * coverScale * zoom;

    // Calculate Offset based on objectPosition
    const pX = cropSettings.objectPosition.x / 100;
    const pY = cropSettings.objectPosition.y / 100;

    const offsetX = pX * (boxW - renderedW);
    const offsetY = pY * (boxH - renderedH);

    return {
      width: renderedW,
      height: renderedH,
      transform: `translate(${offsetX}px, ${offsetY}px)`,
    };
  };

  const bgStyle = getBackgroundStyle();

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className="flex h-[85dvh] w-full max-w-5xl flex-col gap-0 overflow-hidden border-zinc-800 bg-zinc-950 p-0 text-foreground">
        <CredenzaHeader className="z-10 border-b border-zinc-800 bg-zinc-950 px-6 py-4">
          <CredenzaTitle>Crop Image</CredenzaTitle>
        </CredenzaHeader>

        {/* Main Canvas */}
        <div className="relative flex w-full flex-1 items-center justify-center overflow-hidden bg-zinc-900 p-12">
          {/* The Crop Box Container */}
          <div
            className="relative shadow-2xl"
            style={{
              width: displayDimensions.width,
              height: displayDimensions.height,
            }}
          >
            {/* Background Layer (Full Image Preview) */}
            <div className="pointer-events-none absolute inset-0 overflow-visible">
              {naturalDimensions && (
                <div
                  className="absolute top-0 left-0 origin-top-left"
                  style={bgStyle}
                >
                  {/** biome-ignore lint/performance/noImgElement: Necessary for user provided links  */}
                  <img
                    src={imageUrl}
                    alt=""
                    className="h-full w-full object-fill opacity-40 grayscale-30"
                  />
                  {/* Overlay to dim it further */}
                  <div className="absolute inset-0 bg-black/70" />
                </div>
              )}
            </div>

            {/* Foreground Layer (The Crop Box) */}
            <div
              ref={containerRef}
              className={cn(
                "absolute inset-0 z-10 overflow-hidden border-2 border-primary bg-black/20 ring-1 ring-white/20",
                isDragging ? "cursor-grabbing" : "cursor-grab",
              )}
              onMouseDown={handleMouseDown}
            >
              {/* Grid Overlay */}
              <div className="pointer-events-none absolute inset-0 z-20 opacity-50">
                <div className="absolute top-0 bottom-0 left-1/3 border-l border-white/30" />
                <div className="absolute top-0 right-1/3 bottom-0 border-l border-white/30" />
                <div className="absolute top-1/3 right-0 left-0 border-t border-white/30" />
                <div className="absolute right-0 bottom-1/3 left-0 border-t border-white/30" />
              </div>

              {/* The Actual Cropped Image */}
              {/** biome-ignore lint/performance/noImgElement: Necessary for user provided links  */}
              <img
                src={imageUrl}
                onLoad={onImageLoad}
                alt="Crop preview"
                className="h-full w-full transition-transform duration-75 select-none"
                draggable={false}
                style={{
                  objectFit: cropSettings.objectFit,
                  objectPosition: `${cropSettings.objectPosition.x}% ${cropSettings.objectPosition.y}%`,
                  transform: `scale(${cropSettings.zoom ?? 1})`,
                  transformOrigin: `${cropSettings.objectPosition.x}% ${cropSettings.objectPosition.y}%`,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="z-10 flex flex-col gap-4 border-t border-zinc-800 bg-zinc-950 px-6 py-4">
          <div className="mx-auto flex w-full max-w-md items-center gap-4">
            <Minus
              className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-white"
              onClick={() =>
                setCropSettings((s) => ({
                  ...s,
                  zoom: Math.max(1, (s.zoom || 1) - 0.1),
                }))
              }
            />
            <Slider
              value={[cropSettings.zoom || 1]}
              min={1}
              max={3}
              step={0.01}
              onValueChange={(v) =>
                setCropSettings((s) => ({ ...s, zoom: v[0] }))
              }
              className="flex-1"
            />
            <Plus
              className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-white"
              onClick={() =>
                setCropSettings((s) => ({
                  ...s,
                  zoom: Math.min(3, (s.zoom || 1) + 0.1),
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Drag to pan • Scroll to zoom
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => onSave(cropSettings)}>Apply Crop</Button>
            </div>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
