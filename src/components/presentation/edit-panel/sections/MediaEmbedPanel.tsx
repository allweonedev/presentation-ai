"use client";

import {
  createMediaEmbedNode,
  mediaEmbedItems,
  type MediaEmbedItem,
} from "@/components/plate/ui/media-embeds";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { DRAG_ITEM_BLOCK } from "@platejs/dnd";
import { GripVertical } from "lucide-react";
import { useDrag } from "react-dnd";
import { toast } from "sonner";

export function MediaEmbedPanel() {
  return (
    <div className="scrollbar-thin flex h-full flex-col gap-6 overflow-y-auto px-4 py-4 scrollbar-thumb-primary scrollbar-track-transparent">
      <div className="grid grid-cols-2 gap-4">
        {mediaEmbedItems.map((item) => (
          <MediaEmbedCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}

function MediaEmbedCard({ item }: { item: MediaEmbedItem }) {
  const currentSlideId = usePresentationState((s) => s.currentSlideId);
  const slides = usePresentationState((s) => s.slides);
  const setSlides = usePresentationState((s) => s.setSlides);
  const { saveImmediately } = useDebouncedSave();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_ITEM_BLOCK,
    item: {
      id: `external-media-${item.key}`,
      element: createMediaEmbedNode(item.embedType),
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const handleClick = () => {
    const currentSlide = slides.find((s) => s.id === currentSlideId);
    const rootImage = currentSlide?.rootImage;

    // Check if there's an existing root image (with url, embedType, or chartType)
    if (
      rootImage &&
      (rootImage.url || rootImage.embedType || rootImage.chartType)
    ) {
      // Transform root image to this embed type
      setSlides(
        slides.map((slide) =>
          slide.id === currentSlideId
            ? {
                ...slide,
                rootImage: {
                  ...slide.rootImage!,
                  embedType: item.embedType,
                  url: "", // Clear URL so user can enter a new one
                  chartType: undefined, // Clear chart type since we're switching to embed
                  chartData: undefined,
                  chartOptions: undefined,
                },
              }
            : slide,
        ),
      );
      void saveImmediately();
      toast.success(`Changed to ${item.label} embed`);
    } else {
      toast.error("Please select a root image first");
    }
  };

  return (
    <div
      ref={(el) => {
        if (el) drag(el);
      }}
      onClick={handleClick}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-xl border border-border/50 p-5 transition-all duration-300 hover:shadow-lg",
        "bg-card hover:bg-secondary/50",
        "hover:-translate-y-1 hover:scale-105 hover:border-border",
        isDragging && "scale-95 opacity-50",
      )}
    >
      <div className="absolute top-2 left-2">
        <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground transition-colors group-hover:text-foreground active:cursor-grabbing" />
      </div>
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-lg text-3xl shadow-xs transition-all duration-300 group-hover:scale-110",
          "bg-muted",
        )}
      >
        {item.icon}
      </div>
      <div className="text-center">
        <div className="text-sm font-bold text-foreground">{item.label}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {item.description}
        </div>
      </div>
    </div>
  );
}
