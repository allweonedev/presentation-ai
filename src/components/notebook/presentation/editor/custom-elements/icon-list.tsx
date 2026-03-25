"use client";

// Import IconItem and constants
import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TIconListElement } from "../plugins/icon-list-plugin";
import { columnSizeVariant } from "../utils";

export function IconList({
  element,
  children,
  className,
  ref,
  ...props
}: PlateElementProps<TIconListElement>) {
  const { columnSize = "md" } = element;

  return (
    <PlateElement
      ref={ref}
      element={element}
      className={cn("my-6", className)}
      {...props}
    >
      <div
        className={cn(
          "max-w-full gap-6",
          columnSizeVariant({
            columnSize: columnSize as "sm" | "md" | "lg" | "xl",
          }),
        )}
      >
        {children}
      </div>
    </PlateElement>
  );
}
