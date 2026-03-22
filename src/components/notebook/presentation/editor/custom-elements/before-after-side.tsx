"use client";

import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TBeforeAfterGroupElement } from "../plugins/before-after-plugin";
import { getAlignmentClasses } from "../utils";

export const BeforeAfterSide = (props: PlateElementProps) => {
  const parentPath = PathApi.parent(props.path);
  const parentElement = NodeApi.get(props.editor, parentPath);

  const { alignment = "center" } = parentElement as TBeforeAfterGroupElement;
  const index = props.path.at(-1) ?? 0;

  // First child (index 0) goes to column 1, second child (index 1) goes to column 3
  const gridColumn = index === 0 ? 1 : 3;

  return (
    <div
      className={cn("flex w-full flex-col items-center gap-5")}
      style={{ gridColumn }}
    >
      <div
        className={cn(
          "grid w-full rounded-xl border bg-card p-6 shadow-md",
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
