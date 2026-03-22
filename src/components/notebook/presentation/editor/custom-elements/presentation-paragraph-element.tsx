"use client";

import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";

export function PresentationParagraphElement({
  className,
  children,
  ref,
  ...props
}: PlateElementProps) {
  return (
    <PlateElement
      ref={ref}
      className={cn(
        "m-0 px-0 py-1 [font-size:var(--presentation-p-size)]",
        "leading-[1.6]",
        "text-(--presentation-text)",
        "[font-family:var(--presentation-body-font)]",
        "caret-primary",
        className,
      )}
      {...props}
    >
      {children}
    </PlateElement>
  );
}

PresentationParagraphElement.displayName = "PresentationParagraphElement";
