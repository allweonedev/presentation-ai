"use client";

import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";

export default function TableElement(props: PlateElementProps) {
  return (
    <PlateElement {...props}>
      <div
        className={cn("overflow-x-auto")}
        style={{
          borderColor: "hsl(var(--border))",
        }}
      >
        <div
          className={cn(
            "min-w-[600px] rounded-lg border bg-card p-2 shadow-2xs",
          )}
          style={{
            backgroundColor: "var(--presentation-card-background)",
            color: "var(--presentation-heading)",
            borderColor: "hsl(var(--border))",
          }}
        >
          <div className={cn("grid auto-rows-auto gap-2")}>
            {props.children}
          </div>
        </div>
      </div>
    </PlateElement>
  );
}
