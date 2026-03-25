"use client";

import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TBulletGroupElement } from "../plugins/bullet-plugin";
import { columnSizeVariant } from "../utils";

export function BulletsElement({
  element,
  children,
  className,
  ref,
  ...props
}: PlateElementProps<TBulletGroupElement>) {
  const { columnSize, alignment = "center" } = element;

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
          columnSizeVariant({ columnSize }),
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
      >
        {children}
      </div>
    </PlateElement>
  );
}
