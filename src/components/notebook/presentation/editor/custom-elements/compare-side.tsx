"use client";

import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TCompareGroupElement } from "../plugins/compare-plugin";
import { getAlignmentClasses } from "../utils";

export const CompareSide = (props: PlateElementProps) => {
  const parentPath = PathApi.parent(props.path);
  const parentElement = NodeApi.get(props.editor, parentPath);

  const { alignment = "center" } = parentElement as TCompareGroupElement;
  const index = props.path.at(-1) ?? 0;

  // Calculate grid column position
  // For children: positions 1, 3, 5, 7, etc. (odd positions)
  // For VS elements: positions 2, 4, 6, 8, etc. (even positions)
  const gridColumn = index * 2 + 1;

  return (
    <div
      className={cn("flex h-full w-full flex-col items-center gap-5")}
      style={{ gridColumn }}
    >
      <div
        className={cn(
          "grid h-full w-full rounded-xl border bg-card p-6 shadow-md",
          "border-t-4",
        )}
        style={{
          backgroundColor: "var(--presentation-background)",
          color: "var(--presentation-text)",
          borderColor: "hsl(var(--border))",
          borderTopColor:
            (parentElement?.color as string) || "var(--presentation-primary)",
        }}
      >
        <PlateElement className={cn(getAlignmentClasses(alignment))} {...props}>
          {props.children}
        </PlateElement>
      </div>
    </div>
  );
};
