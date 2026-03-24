"use client";

import { searchPixabayImages } from "@/app/_actions/apps/image-studio/pixabay";
import {
  searchUnsplashImages,
  triggerUnsplashDownload,
} from "@/app/_actions/apps/image-studio/unsplash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { useQuery } from "@tanstack/react-query";
import { Dices, Search } from "lucide-react";
import React, { useEffect } from "react";

interface SharedImageSearchControlsProps {
  onImageSelect: (url: string) => void;
  className?: string;
}

const RANDOM_TERMS = [
  "abstract",
  "nature",
  "technology",
  "architecture",
  "minimalist",
  "texture",
  "landscape",
  "business",
  "city",
  "space",
];

export function SharedImageSearchControls({
  onImageSelect,
  className,
}: SharedImageSearchControlsProps) {
  const currentPresentationTitle = usePresentationState(
    (s) => s.currentPresentationTitle,
  );

  const imageSearchState = usePresentationState((s) => s.imageSearchState);
  const setImageSearchState = usePresentationState(
    (s) => s.setImageSearchState,
  );

  const { mode, unsplashQuery, pixabayQuery } = imageSearchState;

  const [selectedUrl, setSelectedUrl] = React.useState<string>("");

  // Initialize default queries
  useEffect(() => {
    if (!unsplashQuery) {
      const randomTerm =
        RANDOM_TERMS[Math.floor(Math.random() * RANDOM_TERMS.length)];
      if (randomTerm) {
        setImageSearchState({ unsplashQuery: randomTerm });
      }
    }
    if (!pixabayQuery && currentPresentationTitle) {
      setImageSearchState({ pixabayQuery: currentPresentationTitle });
    }
  }, [
    currentPresentationTitle,
    pixabayQuery,
    unsplashQuery,
    setImageSearchState,
  ]);

  const unsplashQ = useQuery({
    queryKey: ["presentation-image", "unsplash", unsplashQuery],
    queryFn: async () => {
      if (!unsplashQuery.trim())
        return [] as Array<{
          url: string;
          thumb?: string;
          author?: string;
          username?: string;
          downloadLocation?: string;
          link?: string;
        }>;
      const res = await searchUnsplashImages(unsplashQuery, 30, 1);
      console.log(res.images);
      return res.success && res.images
        ? res.images.map((i) => ({
            url: i.url,
            thumb: i.thumb,
            author: i.author,
            username: i.username,
            downloadLocation: i.downloadLocation,
            link: i.link,
          }))
        : [];
    },
    enabled: !!unsplashQuery, // Enable automatically if query exists
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const pixabayQ = useQuery({
    queryKey: ["presentation-image", "pixabay", pixabayQuery],
    queryFn: async () => {
      if (!pixabayQuery.trim())
        return [] as Array<{
          url: string;
          thumb?: string;
          title?: string;
          author?: string;
          link?: string;
        }>;
      const res = await searchPixabayImages(pixabayQuery);
      return res.success && res.images
        ? res.images.map((i) => ({
            url: i.url,
            thumb: i.thumb,
            title: i.title,
            author: i.author,
            link: i.link,
          }))
        : [];
    },
    enabled: !!pixabayQuery && mode === "pixabay", // Enable automatically if query exists and mode is pixabay
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const handleSearch = () => {
    if (mode === "unsplash") void unsplashQ.refetch();
    else void pixabayQ.refetch();
  };

  const handleRandom = () => {
    const randomTerm =
      RANDOM_TERMS[Math.floor(Math.random() * RANDOM_TERMS.length)];
    if (randomTerm) {
      setImageSearchState({ unsplashQuery: randomTerm });
    }
    // React Query will auto-refetch because query key changes
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cn("flex h-full flex-col gap-4", className)}>
      <Tabs
        value={mode}
        onValueChange={(v) =>
          setImageSearchState({ mode: v as "unsplash" | "pixabay" })
        }
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
          <TabsTrigger value="pixabay">Pixabay</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              mode === "unsplash"
                ? "Search high-res photos..."
                : "Search Pixabay Images..."
            }
            value={mode === "unsplash" ? unsplashQuery : pixabayQuery}
            onChange={(e) =>
              mode === "unsplash"
                ? setImageSearchState({ unsplashQuery: e.target.value })
                : setImageSearchState({ pixabayQuery: e.target.value })
            }
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
        {mode === "unsplash" && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleRandom}
            title="Random Search"
          >
            <Dices className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 rounded-md border bg-muted/30 p-2">
        <div className="min-h-full">
          {(unsplashQ.isFetching || pixabayQ.isFetching) && (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-md" />
              ))}
            </div>
          )}

          {!unsplashQ.isFetching && !pixabayQ.isFetching && (
            <>
              {mode === "unsplash" &&
                Array.isArray(unsplashQ.data) &&
                unsplashQ.data.length > 0 && (
                  <div className="grid h-max grid-cols-3 gap-2">
                    {unsplashQ.data.map(
                      (
                        r: {
                          url: string;
                          thumb?: string;
                          author?: string;
                          username?: string;
                          downloadLocation?: string;
                          link?: string;
                        },
                        idx: number,
                      ) => (
                        <div key={idx} className="group relative">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUrl(r.url);
                              onImageSelect(r.url);
                              if (r.downloadLocation) {
                                void triggerUnsplashDownload(
                                  r.downloadLocation,
                                );
                              }
                            }}
                            className={cn(
                              "aspect-square w-full overflow-hidden rounded-md border transition-all hover:scale-[1.02] focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-hidden",
                              selectedUrl === r.url
                                ? "border-primary ring-2 ring-primary ring-offset-1"
                                : "border-transparent hover:border-primary/50",
                            )}
                          >
                            {/* biome-ignore lint/performance/noImgElement: necessary for url inputs */}
                            <img
                              src={r.thumb || r.url}
                              alt="unsplash"
                              className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                              loading="lazy"
                            />
                            {selectedUrl === r.url && (
                              <div className="absolute inset-0 rounded-md ring-2 ring-primary ring-inset" />
                            )}
                          </button>
                          {/* Attribution Overlay */}
                          <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-black/60 p-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="pointer-events-auto">
                              Photo by{" "}
                              <a
                                href={`https://unsplash.com/@${r.username}?utm_source=your_app_name&utm_medium=referral`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-gray-200"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {r.author}
                              </a>{" "}
                              on{" "}
                              <a
                                href={`${r.link || "https://unsplash.com"}?utm_source=your_app_name&utm_medium=referral`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-gray-200"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Unsplash
                              </a>
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

              {mode === "pixabay" &&
                Array.isArray(pixabayQ.data) &&
                pixabayQ.data.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {pixabayQ.data.map(
                      (
                        r: {
                          url: string;
                          thumb?: string;
                          title?: string;
                          author?: string;
                          link?: string;
                        },
                        idx: number,
                      ) => (
                        <div key={idx} className="group relative">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUrl(r.url);
                              onImageSelect(r.url);
                            }}
                            className={cn(
                              "aspect-square w-full overflow-hidden rounded-md border transition-all hover:scale-[1.02] focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-hidden",
                              selectedUrl === r.url
                                ? "border-primary ring-2 ring-primary ring-offset-1"
                                : "border-transparent hover:border-primary/50",
                            )}
                            title={r.title}
                          >
                            {/* biome-ignore lint/performance/noImgElement: necessary for url inputs */}
                            <img
                              src={r.thumb || r.url}
                              alt={r.title || "pixabay image"}
                              className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                              loading="lazy"
                            />
                            {selectedUrl === r.url && (
                              <div className="absolute inset-0 rounded-md ring-2 ring-primary ring-inset" />
                            )}
                          </button>
                          {/* Attribution Overlay */}
                          {r.author && (
                            <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-black/60 p-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="pointer-events-auto">
                                Photo by {r.author} on{" "}
                                <a
                                  href={r.link || "https://pixabay.com"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline hover:text-gray-200"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Pixabay
                                </a>
                              </span>
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}

              {/* Empty states */}
              {((mode === "unsplash" &&
                (!unsplashQ.data || unsplashQ.data.length === 0)) ||
                (mode === "pixabay" &&
                  (!pixabayQ.data || pixabayQ.data.length === 0))) &&
                !unsplashQ.isFetching &&
                !pixabayQ.isFetching && (
                  <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
                    <p className="text-sm">No images found</p>
                  </div>
                )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
