import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { type Font } from "../types";
import { usePaginatedFonts } from "../utils/usePaginatedFonts";
import { FontItem } from "./FontItem";

const FontPreviews = dynamic(() => import("./FontPreviews"), {
  loading: () => <Skeleton className="h-8 w-full" />,
  ssr: false,
});

export function FontCombobox({
  fonts,
  currentFont,
  onFontSelect,
  noMatches,
  searchValue,
  onSearchChange,
  open,
  onOpenChange,
  className,
}: {
  fonts: Font[];
  currentFont: Font;
  onFontSelect: (font: Font) => void;
  noMatches: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
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

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-8 w-full justify-between p-0 py-2 font-normal",
            className,
          )}
          data-plate-focus="true"
        >
          <div className="flex min-w-0 flex-1 items-center">
            <FontPreviews>
              <FontItem
                key={currentFont.sane}
                font={currentFont}
                fontIndex={fonts.findIndex(
                  (font) => font.sane === currentFont.sane,
                )}
                isCurrent={false}
              />
            </FontPreviews>
          </div>
          <ChevronDown className="mx-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onMouseDown={(e) => e.stopPropagation()}
        className="ignore-click-outside/toolbar max-h-none w-full overflow-visible p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search fonts..."
            value={searchValue}
            onValueChange={onSearchChange}
          />
          <CommandList className="max-h-none overflow-visible">
            <CommandEmpty>{noMatches}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                <FontPreviews>
                  {visibleFonts.map((font, index) => (
                    <CommandItem
                      data-plate-focus="true"
                      key={font.sane}
                      value={font.name}
                      onSelect={() => {
                        onFontSelect(font);
                        onOpenChange(false);
                      }}
                    >
                      <FontItem
                        key={font.sane}
                        font={font}
                        fontIndex={index}
                        isCurrent={currentFont.name === font.name}
                      />
                    </CommandItem>
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
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
