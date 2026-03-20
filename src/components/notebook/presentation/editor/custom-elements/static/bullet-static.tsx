import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";
import { columnSizeVariant } from "../../utils";

export function BulletsElementStatic(props: SlateElementProps) {
  const { columnSize, alignment = "center" } = props.element as {
    columnSize?: "sm" | "md" | "lg" | "xl";
    bulletType?: "numbered" | "basic" | "arrow";
    alignment?: "left" | "center" | "right";
  };

  return (
    <SlateElement {...props} className={cn("my-6", props.className)}>
      <div
        className={cn(
          "max-w-full",
          columnSizeVariant({ columnSize }),
          "gap-6",
          // Only apply horizontal alignment, don't break the grid layout
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
      >
        {props.children}
      </div>
    </SlateElement>
  );
}


