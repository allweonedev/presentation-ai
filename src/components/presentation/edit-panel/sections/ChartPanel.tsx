"use client";

import { ChartRenderer } from "@/components/notebook/presentation/editor/custom-elements/charts/ChartRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DRAG_ITEM_BLOCK } from "@platejs/dnd";
import { GripVertical } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { chartItems, type PaletteItem } from "./elements";

// Base dimensions for chart rendering (rendered at this size, then scaled down)
const BASE_WIDTH = 400;
const BASE_HEIGHT = 300;

export function ChartPanel({ isLoaded }: { isLoaded: boolean }) {
  return (
    <div className="scrollbar-thin flex h-full flex-col gap-4 overflow-y-auto px-4 scrollbar-thumb-primary scrollbar-track-transparent">
      {!isLoaded ? (
        // Show simple loading state immediately
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: chartItems.length }).map((_, i) => (
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
          {chartItems.map((item) => (
            <ChartCard key={item.key} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChartCard({ item }: { item: PaletteItem }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.5);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_ITEM_BLOCK,
    item: { id: `external-${item.key}`, element: item.node },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  // Calculate scale based on container width
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const newScale = rect.width > 0 ? rect.width / BASE_WIDTH : 0.5;
      setScale(newScale);
    };

    updateScale();

    const ro = new ResizeObserver(updateScale);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Extract chart type and data from the node
  const chartType = item.node.type as string;
  const chartData = (item.node as Record<string, unknown>).data;

  return (
    <div
      ref={(el) => {
        if (el) drag(el);
      }}
      className={cn(
        "group cursor-grab rounded-md border p-2 px-4 transition hover:border hover:border-primary hover:shadow-xs active:cursor-grabbing",
        isDragging && "opacity-50",
      )}
    >
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium">
        <GripVertical className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
        <span>{item.label}</span>
      </div>
      <div
        ref={containerRef}
        className="pointer-events-none relative w-full overflow-hidden rounded-sm"
        style={{ height: BASE_HEIGHT * scale }}
      >
        {/* Transparent overlay to block chart interactions */}
        <div className="absolute inset-0 z-50" />
        <div
          style={{
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <ChartRenderer
            chartType={chartType}
            chartData={chartData}
            className="pointer-events-none h-full w-full border-0 p-1 shadow-none"
          />
        </div>
      </div>
    </div>
  );
}
