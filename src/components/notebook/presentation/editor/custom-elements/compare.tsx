"use client";

import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";

export default function CompareGroup(props: PlateElementProps) {
  const { alignment = "center" } = props.element;
  const childCount = props.element.children?.length || 0;

  // Calculate grid columns based on number of children
  // For 2 children: 3 columns (child, vs, child)
  // For 3 children: 5 columns (child, vs, child, vs, child)
  // For 4 children: 7 columns, etc.
  const totalColumns = childCount > 1 ? childCount * 2 - 1 : 1;

  // Create grid template columns
  const gridTemplateColumns = Array.from({ length: totalColumns }, (_, i) => {
    // VS columns are at odd indices (1, 3, 5, etc.)
    return i % 2 === 1 ? "auto" : "1fr";
  }).join(" ");

  return (
    <PlateElement {...props}>
      <div
        className={cn(
          "relative mb-4 grid gap-6",
          // Only apply horizontal alignment, don't break the grid layout
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
        style={{
          gridTemplateColumns: gridTemplateColumns,
        }}
      >
        {props.children}
        {/* Render VS elements for each comparison */}
        {Array.from({ length: childCount - 1 }, (_, i) => {
          const vsColumnIndex = i * 2 + 2; // VS columns are at positions 2, 4, 6, etc.
          return (
            <div
              key={`vs-${i}`}
              className={cn(
                "row-span-full flex items-center justify-center self-center",
              )}
              style={{ gridColumn: vsColumnIndex }}
              aria-hidden
            >
              <div
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-full text-sm font-bold shadow-2xs",
                )}
                style={{
                  backgroundColor:
                    (props.element.color as string) ||
                    "var(--presentation-primary)",
                  color: "var(--presentation-background)",
                  pointerEvents: "none",
                }}
              >
                VS
              </div>
            </div>
          );
        })}
      </div>
    </PlateElement>
  );
}
