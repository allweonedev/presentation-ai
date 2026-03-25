import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { type Font } from "../types";
import { usePaginatedFonts } from "../utils/usePaginatedFonts";
import { FontListItem } from "./FontListItem";

const FontPreviews = dynamic(() => import("./FontPreviews"), {
  loading: () => <Skeleton className="h-8 w-full" />,
  ssr: false,
});

export function FontList({
  fonts,
  currentFont,
  onFontSelect,
  searchValue,
  onSearchChange,
  isLoadingFonts,
}: {
  fonts: Font[];
  currentFont: Font;
  onFontSelect: (font: Font) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  isLoadingFonts: boolean;
}) {
  const { visibleFonts, hasMore, isLoadingMore, loadMore } = usePaginatedFonts(
    fonts,
    searchValue,
  );

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [inView, hasMore, isLoadingMore, loadMore]);

  if (isLoadingFonts) {
    return (
      <div className="w-full space-y-2">
        <div className="relative">
          <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Loading fonts..." disabled className="pl-8" />
        </div>
        <div className="flex h-96 w-full items-center justify-center rounded-md border">
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Loading fonts...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search fonts..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <ScrollArea className="h-96 w-full rounded-md border">
        <div className="space-y-1 p-2">
          <FontPreviews>
            {visibleFonts.map((font, index) => (
              <FontListItem
                key={font.sane}
                font={font}
                fontIndex={index}
                isCurrent={currentFont.name === font.name}
                onSelect={() => onFontSelect(font)}
              />
            ))}
            {hasMore && (
              <div ref={loadMoreRef} className="p-2">
                {isLoadingMore ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    <span className="text-xs text-muted-foreground">
                      Loading more fonts...
                    </span>
                  </div>
                ) : (
                  <div className="py-2 text-center text-xs text-muted-foreground">
                    Scroll for more fonts...
                  </div>
                )}
              </div>
            )}
          </FontPreviews>
          {visibleFonts.length === 0 && !hasMore && (
            <div className="py-4 text-center text-muted-foreground">
              No fonts found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
