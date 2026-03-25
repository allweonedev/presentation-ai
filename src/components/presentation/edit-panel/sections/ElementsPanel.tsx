"use client";

import PresentationEditorStaticView from "@/components/notebook/presentation/editor/presentation-editor-static";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DRAG_ITEM_BLOCK } from "@platejs/dnd";
import { GripVertical } from "lucide-react";
import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
// import { toast } from "sonner";
import { type PaletteItem, paletteItems, slideWith } from "./elements";

/**
 * Delayed editor wrapper to avoid blocking the UI
 */
function DelayedEditorWrapper({
  item,
  isVisible,
}: {
  item: PaletteItem;
  isVisible: boolean;
}) {
  if (!isVisible) {
    return (
      <div className="aspect-video w-full">
        <Skeleton className="h-full w-full rounded-sm" />
      </div>
    );
  }

  return (
    <ScaledPreview>
      <PresentationEditorStaticView
        initialContent={slideWith([item.node])}
        id={`preview-${item.key}`}
      />
    </ScaledPreview>
  );
}

export function ElementsPanel({ isLoaded }: { isLoaded: boolean }) {
  return (
    <div
      draggable={false}
      className="scrollbar-thin flex h-full flex-col gap-4 overflow-y-auto px-4 pb-5 scrollbar-thumb-primary scrollbar-track-transparent"
    >
      {!isLoaded ? (
        // Show simple loading state immediately
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: paletteItems.length }).map((_, i) => (
            <div key={i} className="rounded-md border p-2 px-4">
              <div className="mb-2 h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="aspect-video rounded-sm border bg-card">
                <Skeleton className="h-full w-full rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {paletteItems.map((item) => (
            <PaletteCard key={item.key} item={item} isVisible={true} />
          ))}
        </div>
      )}
    </div>
  );
}

function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeoutId = null;
      func(...args);
    };
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(later, wait);
  };
}

function ScaledPreview({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.2);
  const [contentHeight, setContentHeight] = useState(0);
  const BASE_WIDTH = 1024;

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const update = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const newScale = rect.width > 0 ? rect.width / BASE_WIDTH : 0.2;
      setScale(newScale);
      if (contentRef.current) {
        setContentHeight(
          contentRef.current.scrollHeight ||
            contentRef.current.offsetHeight ||
            0,
        );
      }
    };

    // Debounce the update function to avoid excessive re-renders
    const debouncedUpdate = debounce(update, 100);

    // Initial update
    update();

    const ro = new ResizeObserver(debouncedUpdate);
    ro.observe(containerRef.current);

    if (contentRef.current) {
      const contentRo = new ResizeObserver(debouncedUpdate);
      contentRo.observe(contentRef.current);
      return () => {
        contentRo.disconnect();
        ro.disconnect();
      };
    }

    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none w-full"
      style={{
        height: contentHeight > 0 ? `${contentHeight * scale}px` : undefined,
      }}
    >
      <div
        ref={contentRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: BASE_WIDTH,
          height: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function PaletteCard({
  item,
  isVisible,
}: {
  item: PaletteItem;
  isVisible: boolean;
}) {
  // const editor = useEditorRef<MyEditor>();
  // const selectedIds = usePluginOption(BlockSelectionPlugin, "selectedIds");
  // const currentSlideId = usePresentationState((s) => s.currentSlideId);
  // const slides = usePresentationState((s) => s.slides);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_ITEM_BLOCK,
    item: { id: `external-${item.key}`, element: item.node },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div
      ref={(el) => {
        if (el) drag(el);
      }}
      className={cn(
        "group cursor-grab rounded-md border p-2 px-4 transition hover:shadow-xs active:cursor-grabbing",
        isDragging && "opacity-50",
      )}
    >
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium">
        <GripVertical
          className={cn(
            "h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground",
          )}
        />
        <span>{item.label}</span>
      </div>
      <div className="rounded-sm border bg-card">
        <DelayedEditorWrapper item={item} isVisible={isVisible} />
      </div>
    </div>
  );
}
