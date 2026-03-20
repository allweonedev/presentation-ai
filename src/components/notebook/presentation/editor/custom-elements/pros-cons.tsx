"use client";

import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";

export default function ProsConsGroup(props: PlateElementProps) {
  const { alignment = "center" } = props.element;

  return (
    <PlateElement {...props}>
      <div
        className={cn(
          "mb-4 grid items-stretch gap-6 md:grid-cols-2",
          // Only apply horizontal alignment, don't break the grid layout
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
      >
        {props.children}
      </div>
    </PlateElement>
  );
}
