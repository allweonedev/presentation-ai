"use client";

import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";

export const TableRow = (props: PlateElementProps) => {
  return (
    <div className={cn("grid auto-cols-fr grid-flow-col items-stretch gap-2")}>
      <PlateElement {...props}>{props.children}</PlateElement>
    </div>
  );
};
