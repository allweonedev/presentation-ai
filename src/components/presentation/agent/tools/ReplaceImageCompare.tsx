"use client";

import {
  type PlateSlide,
  type RootImage,
} from "@/components/notebook/presentation/utils/parser";
import { getSlidesToUpdate } from "@/hooks/presentation/agentTools";
import { usePresentationState } from "@/states/presentation-state";
import { ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PresentationReplaceImageResult } from "./ReplaceImage";

type Scope = "all" | undefined;

function cloneRootImage(rootImage: RootImage | undefined): RootImage | undefined {
  if (!rootImage) {
    return undefined;
  }

  return {
    ...rootImage,
    cropSettings: rootImage.cropSettings
      ? {
          ...rootImage.cropSettings,
          objectPosition: rootImage.cropSettings.objectPosition
            ? { ...rootImage.cropSettings.objectPosition }
            : rootImage.cropSettings.objectPosition,
        }
      : undefined,
    size: rootImage.size ? { ...rootImage.size } : undefined,
    chartOptions: rootImage.chartOptions
      ? { ...rootImage.chartOptions }
      : undefined,
  };
}

function cloneSlideWithRootImage(
  slide: PlateSlide,
  rootImage: RootImage | undefined,
): PlateSlide {
  return {
    ...slide,
    rootImage: cloneRootImage(rootImage),
  };
}

function buildDirectUrlReplacementSlide(
  slide: PlateSlide,
  imageUrl: string,
): PlateSlide {
  return cloneSlideWithRootImage(slide, {
    ...(cloneRootImage(slide.rootImage) ?? { query: "" }),
    url: imageUrl,
    embedType: undefined,
  });
}

function syncRootImageGeneration(slidesToApply: PlateSlide[]) {
  usePresentationState.setState((state) => {
    const nextGeneration = { ...state.rootImageGeneration };

    for (const slide of slidesToApply) {
      if (!slide.rootImage?.url) {
        delete nextGeneration[slide.id];
        continue;
      }

      nextGeneration[slide.id] = {
        query: slide.rootImage.query,
        status: "success",
        url: slide.rootImage.url,
      };
    }

    return {
      rootImageGeneration: nextGeneration,
    };
  });
}

function ImagePreviewCard({
  slideNumber,
  slide,
}: {
  slideNumber: number | null;
  slide: PlateSlide;
}) {
  const imageUrl = slide.rootImage?.url;
  const imageLabel = slide.rootImage?.query?.trim();

  return (
    <div className="group relative overflow-hidden rounded-md border border-muted bg-card">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-2 bg-linear-to-b from-background/95 via-background/80 to-transparent px-3 py-2 text-xs text-muted-foreground">
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-muted px-1.5 font-medium">
          {slideNumber ?? "-"}
        </span>
        <span className="truncate font-medium text-foreground/80">
          {imageLabel || (imageUrl ? "Image updated" : "No image")}
        </span>
      </div>

      <div className="aspect-video bg-muted/30">
        {imageUrl ? (
          // biome-ignore lint/performance/noImgElement: Dynamic image preview in compare UI
          <img
            src={imageUrl}
            alt={imageLabel || `Slide ${slideNumber ?? ""} image`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-muted/20 text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-md ring-0 ring-primary/60 transition-all group-hover:ring-1" />
    </div>
  );
}

export function PresentationReplaceImageCompare({
  originalSlides,
  scope,
  slideIds,
  imageUrl,
  imagePrompt,
  message,
}: {
  originalSlides: PlateSlide[];
  scope?: Scope;
  slideIds?: string[];
  imageUrl?: string;
  imagePrompt?: string;
  message?: string;
}) {
  const currentSlides = usePresentationState((state) => state.slides);
  const rootImageGeneration = usePresentationState(
    (state) => state.rootImageGeneration,
  );

  const targetSlideIds = useMemo(
    () => getSlidesToUpdate(scope, slideIds),
    [scope, slideIds],
  );
  const targetSlideIdSet = useMemo(
    () => new Set(targetSlideIds ?? []),
    [targetSlideIds],
  );

  const slideNumberById = useMemo(() => {
    return new Map(
      originalSlides.map((slide, index) => [slide.id, index + 1] as const),
    );
  }, [originalSlides]);

  const originalTargetSlides = useMemo(() => {
    return originalSlides
      .filter((slide) => targetSlideIdSet.has(slide.id))
      .map((slide) => cloneSlideWithRootImage(slide, slide.rootImage));
  }, [originalSlides, targetSlideIdSet]);

  const immediateModifiedSlides = useMemo(() => {
    if (!imageUrl || originalTargetSlides.length === 0) {
      return [];
    }

    return originalTargetSlides.map((slide) =>
      buildDirectUrlReplacementSlide(slide, imageUrl),
    );
  }, [imageUrl, originalTargetSlides]);

  const promptResolvedSlides = useMemo(() => {
    if (!imagePrompt || originalTargetSlides.length === 0) {
      return [];
    }

    const resolvedSlides: PlateSlide[] = [];

    for (const originalSlide of originalTargetSlides) {
      const currentSlide = currentSlides.find((slide) => slide.id === originalSlide.id);

      if (!currentSlide) {
        return [];
      }

      const generationState = rootImageGeneration[originalSlide.id];
      const resolvedUrl =
        currentSlide.rootImage?.url ??
        (generationState?.query === imagePrompt ? generationState.url : undefined);
      const resolvedQuery =
        currentSlide.rootImage?.query ||
        (generationState?.query === imagePrompt ? generationState.query : undefined);

      if (!resolvedUrl || resolvedQuery !== imagePrompt) {
        return [];
      }

      resolvedSlides.push(
        cloneSlideWithRootImage(originalSlide, {
          ...(cloneRootImage(currentSlide.rootImage) ??
            cloneRootImage(originalSlide.rootImage) ?? { query: imagePrompt }),
          query: imagePrompt,
          url: resolvedUrl,
          embedType: undefined,
        }),
      );
    }

    return resolvedSlides;
  }, [currentSlides, imagePrompt, originalTargetSlides, rootImageGeneration]);

  const [modifiedSlides, setModifiedSlides] = useState<PlateSlide[]>(
    immediateModifiedSlides,
  );

  useEffect(() => {
    if (immediateModifiedSlides.length > 0) {
      setModifiedSlides(immediateModifiedSlides);
    }
  }, [immediateModifiedSlides]);

  useEffect(() => {
    if (
      modifiedSlides.length === originalTargetSlides.length &&
      modifiedSlides.length > 0
    ) {
      return;
    }

    if (promptResolvedSlides.length === originalTargetSlides.length) {
      setModifiedSlides(promptResolvedSlides);
    }
  }, [modifiedSlides.length, originalTargetSlides.length, promptResolvedSlides]);

  const applySlides = (slidesToApply: PlateSlide[]) => {
    const slidesById = new Map(slidesToApply.map((slide) => [slide.id, slide]));
    const { slides, setSlides } = usePresentationState.getState();

    setSlides(
      slides.map((slide) => {
        const replacement = slidesById.get(slide.id);
        return replacement ?? slide;
      }),
    );
    syncRootImageGeneration(slidesToApply);
  };

  if (originalTargetSlides.length === 0) {
    return <PresentationReplaceImageResult message={message} />;
  }

  const previewReady =
    modifiedSlides.length === originalTargetSlides.length &&
    modifiedSlides.length > 0;

  if (!previewReady) {
    return (
      <div className="w-full rounded-lg border bg-card p-3">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Preparing updated image preview...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-104">
      <div className="grid gap-3 md:grid-cols-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => applySlides(originalTargetSlides)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              applySlides(originalTargetSlides);
            }
          }}
          className="group cursor-pointer text-left outline-hidden"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold">Original</h3>
            <span className="text-xs text-muted-foreground">
              {originalTargetSlides.length} slide
              {originalTargetSlides.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="space-y-2 rounded-md group-hover:outline-solid group-hover:outline-primary">
            {originalTargetSlides.map((slide) => (
              <ImagePreviewCard
                key={`original-${slide.id}`}
                slide={slide}
                slideNumber={slideNumberById.get(slide.id) ?? null}
              />
            ))}
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => applySlides(modifiedSlides)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              applySlides(modifiedSlides);
            }
          }}
          className="group cursor-pointer text-left outline-hidden"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold">Modified</h3>
            <span className="text-xs text-muted-foreground">
              {modifiedSlides.length} slide
              {modifiedSlides.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="space-y-2 rounded-md group-hover:outline-solid group-hover:outline-primary">
            {modifiedSlides.map((slide) => (
              <ImagePreviewCard
                key={`modified-${slide.id}`}
                slide={slide}
                slideNumber={slideNumberById.get(slide.id) ?? null}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
