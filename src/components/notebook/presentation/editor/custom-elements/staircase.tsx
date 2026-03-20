"use client";

import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TStairGroupElement } from "../plugins/staircase-plugin";

export default function Staircase(
  props: PlateElementProps<TStairGroupElement>,
) {
  const { alignment = "center" } = props.element;

  return (
    <PlateElement {...props}>
      {/* Container for alignment control */}
      <div
        className={cn(
          "my-8 flex w-full",
          // Apply alignment to the container, not the staircase structure
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
      >
        {/* Staircase structure - always full width, vertical flow */}
        <div className="w-full">{props.children}</div>
      </div>
    </PlateElement>
  );
}
