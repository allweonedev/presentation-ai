"use client";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { type RootImage } from "../../../utils/parser";

interface ImageSlideStaticProps {
  image: RootImage;
  slideId: string;
}

export default function ImageSlideStatic({
  image,
  slideId,
}: ImageSlideStaticProps) {
  const computedImageUrl = image.url;
  const rootImageGeneration = usePresentationState(
    (s) => s.rootImageGeneration,
  );
  const computedGen = rootImageGeneration[slideId];
  const isGenerating =
    computedGen?.status === "queued" || computedGen?.status === "generating";

  return (
    <div
      className={cn(
        "flex aspect-video w-full items-center justify-center",
        "relative overflow-hidden",
      )}
      data-slide-id={slideId}
    >
      {isGenerating ? (
        <div className="absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center bg-muted/30 p-4">
          <Spinner className="mb-2 h-8 w-8" />
          <p className="text-sm text-muted-foreground">Generating image...</p>
        </div>
      ) : computedImageUrl ? (
        // biome-ignore lint/performance/noImgElement: Valid use case for img element
        <img
          src={computedImageUrl}
          alt={image.query}
          className="h-full w-full"
          style={{
            objectFit: image.cropSettings?.objectFit ?? "cover",
            objectPosition: image.cropSettings?.objectPosition
              ? `${image.cropSettings.objectPosition.x}% ${image.cropSettings.objectPosition.y}%`
              : "center",
          }}
        />
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          <span>No image</span>
        </div>
      )}
    </div>
  );
}
