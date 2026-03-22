"use client";

import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { useEffect, useRef, useState } from "react";
import {
  type TStairGroupElement,
  type TStairItemElement,
} from "../plugins/staircase-plugin";

// StairItem component aligned with PyramidItem behavior
export const StairItem = (props: PlateElementProps<TStairItemElement>) => {
  // Derive parent stair element and totalChildren like pyramid
  const parentPath = PathApi.parent(props.path);
  const parentElement = NodeApi.get(
    props.editor,
    parentPath,
  ) as TStairGroupElement;

  const totalItems = parentElement?.children?.length || 1;
  const index = props.path.at(-1) ?? 0;

  // Refs and state for dynamic height
  const containerRef = useRef<HTMLDivElement>(null);
  const [blockHeight, setBlockHeight] = useState(70);

  // ResizeObserver to dynamically adjust height based on container height
  useEffect(() => {
    if (!containerRef.current) return;

    const updateHeight = () => {
      const containerHeight = containerRef.current?.offsetHeight ?? 70;
      setBlockHeight(Math.max(containerHeight, 70));
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Calculate a width ramp similar to previous design, but driven by totalItems
  const baseWidth = 70;
  const maxWidth = 220;
  const increment = (maxWidth - baseWidth) / (totalItems - 1 || 1);
  const widthPx = baseWidth + index * increment;

  const alignment = parentElement?.alignment;
  return (
    <div className={cn("group/stair-item relative mb-2 w-full")}>
      <div
        className={cn(
          "flex items-center gap-4 border-b border-gray-700",
          alignment === "right" && "flex-row-reverse",
        )}
      >
        {/* Width-growing block with number */}
        <div
          style={{
            width: `${widthPx}px`,
            height: `${blockHeight}px`,
            backgroundColor:
              (parentElement?.color as string) ||
              "var(--presentation-smart-layout, var(--presentation-primary))",
            color: "var(--presentation-background)",
          }}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-md text-2xl font-bold",
          )}
        >
          {index + 1}
        </div>

        <PlateElement ref={containerRef} {...props}>
          {props.children}
        </PlateElement>
      </div>
    </div>
  );
};
