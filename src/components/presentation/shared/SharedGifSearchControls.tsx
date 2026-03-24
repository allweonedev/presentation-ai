"use client";

import {
  getTrendingGiphyGifs,
  searchGiphyGifs,
} from "@/app/_actions/apps/image-studio/giphy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, TrendingUp } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

interface SharedGifSearchControlsProps {
  onGifSelect: (url: string) => void | Promise<void>;
  className?: string;
}

export function SharedGifSearchControls({
  onGifSelect,
  className,
}: SharedGifSearchControlsProps) {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const [loadingGifUrl, setLoadingGifUrl] = useState<string | null>(null);

  // Fetch trending GIFs on mount
  const trendingQuery = useQuery({
    queryKey: ["giphy-trending"],
    queryFn: async () => {
      const res = await getTrendingGiphyGifs();
      return res.success && res.gifs ? res.gifs : [];
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Search GIFs
  const searchQueryResult = useQuery({
    queryKey: ["giphy-search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const res = await searchGiphyGifs(searchQuery);
      return res.success && res.gifs ? res.gifs : [];
    },
    enabled: !!searchQuery,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Load trending on mount
  useEffect(() => {
    if (!searchQuery) {
      void trendingQuery.refetch();
    }
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleShowTrending = () => {
    setQuery("");
    setSearchQuery("");
  };

  const isLoading = searchQuery
    ? searchQueryResult.isFetching
    : trendingQuery.isFetching;
  const gifs = searchQuery
    ? (searchQueryResult.data ?? [])
    : (trendingQuery.data ?? []);

  return (
    <div className={cn("flex h-full flex-col gap-4", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search GIFs on Giphy..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
        {searchQuery && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleShowTrending}
            title="Show Trending"
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Header showing current mode */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {searchQuery ? (
          <span>
            Results for &quot;<span className="font-medium">{searchQuery}</span>
            &quot;
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Trending GIFs
          </span>
        )}
      </div>

      <ScrollArea className="flex-1 rounded-md border bg-muted/30 p-2">
        <div className="min-h-full">
          {isLoading && (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-md" />
              ))}
            </div>
          )}

          {!isLoading && gifs.length > 0 && (
            <div className="grid h-max grid-cols-3 gap-2">
              {gifs.map((gif) => (
                <div key={gif.id} className="group relative">
                  <button
                    type="button"
                    onClick={async () => {
                      if (loadingGifUrl) return; // Prevent multiple clicks
                      setLoadingGifUrl(gif.url);
                      setSelectedUrl(gif.url);
                      try {
                        await onGifSelect(gif.url);
                      } finally {
                        setLoadingGifUrl(null);
                      }
                    }}
                    disabled={loadingGifUrl !== null}
                    className={cn(
                      "aspect-square w-full overflow-hidden rounded-md border transition-all hover:scale-[1.02] focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-hidden",
                      selectedUrl === gif.url
                        ? "border-primary ring-2 ring-primary ring-offset-1"
                        : "border-transparent hover:border-primary/50",
                      loadingGifUrl !== null &&
                        loadingGifUrl !== gif.url &&
                        "cursor-not-allowed opacity-50",
                    )}
                  >
                    {/* biome-ignore lint/performance/noImgElement: necessary for url inputs */}
                    <img
                      src={gif.thumb || gif.url}
                      alt={gif.title || "GIF"}
                      className={cn(
                        "h-full w-full object-cover transition-opacity group-hover:opacity-90",
                        loadingGifUrl === gif.url && "opacity-50",
                      )}
                      loading="lazy"
                    />
                    {/* Loading spinner overlay */}
                    {loadingGifUrl === gif.url && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/30">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                    {selectedUrl === gif.url && loadingGifUrl !== gif.url && (
                      <div className="absolute inset-0 rounded-md ring-2 ring-primary ring-inset" />
                    )}
                  </button>
                  {/* Attribution Overlay */}
                  <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-black/60 p-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="pointer-events-auto">
                      Powered by{" "}
                      <a
                        href="https://giphy.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-gray-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        GIPHY
                      </a>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && gifs.length === 0 && (
            <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
              <p className="text-sm">No GIFs found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
