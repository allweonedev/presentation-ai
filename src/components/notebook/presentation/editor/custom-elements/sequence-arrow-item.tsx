"use client";

import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TSequenceArrowGroupElement } from "../plugins/sequence-arrow-plugin";
import { getAlignmentClasses } from "../utils";

export const SequenceArrowItem = (props: PlateElementProps) => {
  const parentPath = PathApi.parent(props.path);
  const parentElement = NodeApi.get(
    props.editor,
    parentPath,
  ) as TSequenceArrowGroupElement;
  const index = props.path.at(-1) ?? 0;
  const total = parentElement?.children?.length ?? 0;
  const isLast = index === total - 1;

  const { orientation = "vertical" } = parentElement;
  const triangleColor =
    (parentElement.color as string) ||
    "var(--presentation-card-background, var(--presentation-primary))";

  return (
    <div
      className={cn(
        "relative h-full w-full flex-1",
        orientation === "horizontal" && "flex items-stretch",
      )}
      style={{ pointerEvents: "none" }}
    >
      <div
        className={cn(
          "grid w-full rounded-xl p-6 shadow-lg",
          orientation === "horizontal" && "flex-1",
        )}
        data-bg-export="true"
        style={{
          backgroundColor: triangleColor,
          color: "var(--presentation-background)",
        }}
      >
        <PlateElement
          {...props}
          className={cn(getAlignmentClasses(parentElement.alignment))}
        >
          {props.children}
        </PlateElement>
      </div>

      {!isLast && orientation === "vertical" && (
        <div
          className={cn("mx-auto h-0 w-0")}
          style={{
            borderLeft: "13px solid transparent",
            borderRight: "13px solid transparent",
            borderTop: `19px solid ${triangleColor}`,
            filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.08))",
          }}
        />
      )}

      {!isLast && orientation === "horizontal" && (
        <div
          className={cn("my-auto h-0 w-0")}
          style={{
            borderTop: "13px solid transparent",
            borderBottom: "13px solid transparent",
            borderLeft: `19px solid ${triangleColor}`,
            filter: "drop-shadow(6px 0 8px rgba(0,0,0,0.08))",
          }}
        />
      )}
    </div>
  );
};
