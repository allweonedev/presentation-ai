"use client";

import { getUserImages } from "@/app/_actions/apps/image-studio/fetch";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import { usePresentationState } from "@/states/presentation-state";
import { useInfiniteQuery } from "@tanstack/react-query";
import { type TElement } from "platejs";
import { useEditorRef } from "platejs/react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { type RootImage as RootImageType } from "../../../utils/parser";

interface YourImagesControlsProps {
  element: TElement & RootImageType;
  slideId?: string;
  isRootImage: boolean;
  onPick?: () => void;
}

export function YourImagesControls({
  element,
  slideId,
  isRootImage,
  onPick,
}: YourImagesControlsProps) {
  const editor = useEditorRef(slideId);
  const { saveImmediately } = useDebouncedSave();

  const { ref, inView } = useInView();

  const {
    data: userImagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingUserImages,
  } = useInfiniteQuery({
    queryKey: ["user-generated-images"],
    queryFn: async ({ pageParam = 1 }) => {
      const images = await getUserImages({ page: pageParam, limit: 20 });
      return images;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const handleImageSelect = (url: string, prompt: string) => {
    const { setSlides, clearRootImageGeneration } =
      usePresentationState.getState();
    if (isRootImage) {
      if (slideId) clearRootImageGeneration(slideId);
      setSlides((slides) =>
        slides.map((slide) =>
          slide.id === slideId
            ? {
                ...slide,
                rootImage: {
                  ...slide.rootImage!,
                  url: url,
                  query: prompt,
                  embedType: undefined,
                  imageSource: "generate",
                  chartType: undefined,
                  chartData: undefined,
                },
              }
            : slide,
        ),
      );
      void saveImmediately();
    } else {
      editor.tf.setNodes(
        { url: url, query: prompt, embedType: undefined },
        { at: editor.api.findPath(element) },
      );
      void saveImmediately();
    }
    onPick?.();
  };

  return (
    <div className="flex h-full flex-col space-y-4">
      <ScrollArea className="-mx-2 flex-1 px-2">
        <div className="grid grid-cols-3 gap-2 pb-4">
          {userImagesData?.pages.map((page) =>
            page.map((img) => (
              <div
                key={img.id}
                onClick={() => handleImageSelect(img.url, img.prompt)}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/30"
              >
                {/** biome-ignore lint/performance/noImgElement: Cannot use image links with next Image component  */}
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-full text-xs"
                    onClick={() => handleImageSelect(img.url, img.prompt)}
                  >
                    Use Image
                  </Button>
                </div>
              </div>
            )),
          )}

          {/* Loading skeletons */}
          {(isLoadingUserImages || isFetchingNextPage) &&
            Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}

          {/* Infinite scroll trigger */}
          <div ref={ref} className="col-span-3 h-4" />

          {!isLoadingUserImages && userImagesData?.pages[0]?.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p>No generated images found.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
