"use client";

import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TColumnGroupElement } from "../plugins/column-plugin";
import { columnSizeVariant } from "../utils";

export default function ColumnGroup(
  props: PlateElementProps<TColumnGroupElement>,
) {
  const {
    columnSize,
    columnType = "transparent",
    alignment = "center",
  } = props.element;

  const getColumnTypeClass = () => {
    switch (columnType) {
      case "outline":
        return "border-2 border-(--presentation-primary) bg-transparent";
      case "solid":
        return "bg-(--presentation-primary) bg-opacity-10 border border-(--presentation-primary)";
      case "transparent":
        return "bg-transparent border-none";
      default:
        return "bg-transparent border-2 border-(--presentation-primary)";
    }
  };

  return (
    <PlateElement {...props} className="mb-4">
      <div
        className={cn(
          "max-w-full rounded-md p-4",
          columnSizeVariant({ columnSize }),
          getColumnTypeClass(),
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
