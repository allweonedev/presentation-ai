"use client";

import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";

export const TableCell = (props: PlateElementProps) => {
  return (
    <div
      className={cn("rounded border bg-card p-3 text-sm")}
      style={{
        backgroundColor: "var(--presentation-card-background)",
        color: "var(--presentation-text)",
        borderColor: "hsl(var(--border))",
      }}
    >
      <PlateElement {...props}>{props.children}</PlateElement>
    </div>
  );
};
