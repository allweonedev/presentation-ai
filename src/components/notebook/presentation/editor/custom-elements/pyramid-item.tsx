// custom-elements/pyramid-item.tsx
"use client";
import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { useEffect, useRef, useState } from "react";
import {
  type TPyramidGroupElement,
  type TPyramidItemElement,
} from "../plugins/pyramid-plugin";

// PyramidItem component for individual items in the pyramid
export const PyramidItem = (props: PlateElementProps<TPyramidItemElement>) => {
  // Get the parent pyramid element to access totalChildren
  const parentPath = PathApi.parent(props.path);
  const parentElement = NodeApi.get(
    props.editor,
    parentPath,
  ) as TPyramidGroupElement;

  // Get total items from parent element, fallback to calculating from parent's children
  const totalItems = parentElement?.children?.length || 1;
  const index = props.path.at(-1)!;
  const isFunnel = parentElement?.isFunnel;

  const alignment = parentElement?.alignment;
  // Refs and state for dynamic height
  const containerRef = useRef<HTMLDivElement>(null);
  const [shapeHeight, setShapeHeight] = useState(80);

  // ResizeObserver to dynamically adjust height based on container height (controlled by grid)
  useEffect(() => {
    if (!containerRef.current) return;

    const updateHeight = () => {
      const containerHeight = containerRef.current?.offsetHeight ?? 80;
      setShapeHeight(Math.max(containerHeight, 80));
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const maxWidthPercentage = 80; // Maximum width the bottom layer should take up
  const increment = maxWidthPercentage / (2 * totalItems);

  // Calculate clip path using the provided algorithm
  const calculateClipPath = () => {
    if (isFunnel) {
      // Inverted pyramid (funnel) logic
      if (index === 0) {
        // First layer is widest (inverted triangle top)
        const currentXOffset = increment * (totalItems - index);
        const currentLeft = 50 - currentXOffset;
        const currentRight = 50 + currentXOffset;

        const nextXOffset = increment * (totalItems - index - 1);
        const nextLeft = 50 - nextXOffset;
        const nextRight = 50 + nextXOffset;

        return `polygon(${currentLeft}% 0%, ${currentRight}% 0%, ${nextRight}% 100%, ${nextLeft}% 100%)`;
      } else if (index === totalItems - 1) {
        // Last layer is a triangle pointing down
        const prevXOffset = increment * (totalItems - index);
        const prevLeft = 50 - prevXOffset;
        const prevRight = 50 + prevXOffset;

        return `polygon(${prevLeft}% 0%, ${prevRight}% 0%, 50% 100%)`;
      } else {
        // Middle layers
        const currentXOffset = increment * (totalItems - index);
        const currentLeft = 50 - currentXOffset;
        const currentRight = 50 + currentXOffset;

        const nextXOffset = increment * (totalItems - index - 1);
        const nextLeft = 50 - nextXOffset;
        const nextRight = 50 + nextXOffset;

        return `polygon(${currentLeft}% 0%, ${currentRight}% 0%, ${nextRight}% 100%, ${nextLeft}% 100%)`;
      }
    } else {
      // Regular pyramid logic
      if (index === 0) {
        // First layer is a triangle
        return `polygon(50% 0%, ${50 - increment}% 100%, ${50 + increment}% 100%)`;
      } else {
        // For other layers
        const prevXOffset = increment * index;
        const currentXOffset = increment * (index + 1);
        const prevBottomLeft = 50 - prevXOffset;
        const prevBottomRight = 50 + prevXOffset;
        const currentBottomLeft = 50 - currentXOffset;
        const currentBottomRight = 50 + currentXOffset;

        return `polygon(${prevBottomLeft}% 0%, ${prevBottomRight}% 0%, ${currentBottomRight}% 100%, ${currentBottomLeft}% 100%)`;
      }
    }
  };

  const calculateLeftOffset = () => {
    if (isFunnel) {
      return 40 - (totalItems - (index + 1)) * increment;
    }
    return 40 - (index + 1) * increment;
  };

  const clipPath = calculateClipPath();

  return (
    <div className={cn("group/pyramid-item relative h-full w-full")}>
      {/* The pyramid item layout */}
      <div
        className={cn(
          "grid h-full auto-cols-fr grid-flow-col items-center",
          alignment === "right" && "col-start-2",
        )}
      >
        {/* Shape with number */}
        <div className="relative flex-1">
          <div
            className="grid place-items-center text-2xl font-bold"
            style={{
              height: `${shapeHeight}px`,
              clipPath: clipPath,
              backgroundColor:
                (parentElement?.color as string) ||
                "var(--presentation-smart-layout)",
              color: "var(--presentation-background)",
            }}
          >
            {index + 1}
          </div>
        </div>

        <div
          className={cn(
            "relative flex h-full flex-1 items-center border-b border-gray-700",
            alignment === "right" && "col-start-1 justify-end",
          )}
          style={{
            right:
              alignment === "right"
                ? `calc(-${calculateLeftOffset()}% - 34px)`
                : `calc(${calculateLeftOffset()}% + 34px)`,
            paddingLeft: isFunnel
              ? alignment === "right"
                ? `0`
                : `2.5rem`
              : `0`,
            paddingRight: isFunnel
              ? alignment === "right"
                ? `2.5rem`
                : `0`
              : `0`,
          }}
        >
          <PlateElement
            ref={containerRef}
            className="grid h-full w-max items-center"
            {...props}
          >
            {props.children}
          </PlateElement>
        </div>
      </div>
    </div>
  );
};
