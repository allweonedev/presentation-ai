"use client";

import {
  getUserImages,
  type Image as GeneratedImage,
} from "@/app/_actions/apps/image-studio/fetch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface UserImagesGalleryProps {
  onImageSelect: (url: string, prompt: string) => void;
  justGeneratedImages?: GeneratedImage[];
  onClearRecent?: () => void;
  className?: string;
}

export function UserImagesGallery({
  onImageSelect,
  justGeneratedImages = [],
  onClearRecent,
  className,
}: UserImagesGalleryProps) {
  const { ref, inView } = useInView();

  const {
    data: userImagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
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

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {justGeneratedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Just generated</Label>
            {onClearRecent && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={onClearRecent}
              >
                Show history
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {justGeneratedImages.map((img) => (
              <figure
                key={img.id}
                className="relative aspect-square overflow-hidden rounded-lg border-2 border-primary shadow-md"
              >
                {/** biome-ignore lint/performance/noImgElement: Necessary for user provided links */}
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="h-full w-full object-cover"
                />
                <figcaption className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full"
                    onClick={() => onImageSelect(img.url, img.prompt)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-sm font-medium">Your AI images</Label>
        <ScrollArea className="h-[420px] rounded-lg border bg-muted/30 p-3">
          <div className="grid grid-cols-2 gap-2 pb-4">
            {userImagesData?.pages.map((page) =>
              page.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => onImageSelect(img.url, img.prompt)}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-background text-left"
                >
                  {/** biome-ignore lint/performance/noImgElement: Necessary for user provided links */}
                  <img
                    src={img.url}
                    alt={img.prompt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 text-[11px] font-medium tracking-wide text-white uppercase opacity-0 transition-opacity group-hover:opacity-100">
                    <Check className="h-4 w-4" />
                    Use image
                  </span>
                </button>
              )),
            )}

            {(isLoading || isFetchingNextPage) &&
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square rounded-lg" />
              ))}

            <div ref={ref} className="col-span-2 h-4" />
          </div>

          {!isLoading &&
            !isFetchingNextPage &&
            (!userImagesData ||
              userImagesData.pages.every((page) => page.length === 0)) && (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                No generated images yet.
              </div>
            )}
        </ScrollArea>
      </div>
    </div>
  );
}
