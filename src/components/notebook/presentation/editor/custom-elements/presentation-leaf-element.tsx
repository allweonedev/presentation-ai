"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { PlateLeaf, type PlateLeafProps } from "platejs/react";

type PresentationLeafVariant = "primary" | "secondary" | "text" | "heading";

const caretVariant = cva("bg-transparent caret-primary", {
  variants: {
    variant: {
      primary: "text-(--presentation-primary)",
      secondary: "text-(--presentation-secondary)",
      text: "[font-family:var(--presentation-body-font)] text-(--presentation-text) caret-primary",
      heading:
        "[font-family:var(--presentation-heading-font)] font-bold text-(--presentation-heading) caret-primary",
    },
  },
});

function getPresentationLeafVariant(variant: unknown): PresentationLeafVariant {
  switch (variant) {
    case "primary":
    case "secondary":
    case "heading":
      return variant;
    default:
      return "text";
  }
}

export function PresentationLeafElement({
  className,
  children,
  ref,
  leaf,
  ...props
}: PlateLeafProps) {
  const variant = getPresentationLeafVariant(
    (leaf as { variant?: unknown }).variant,
  );
  return (
    <PlateLeaf
      ref={ref}
      leaf={leaf}
      className={cn(caretVariant({ variant }), className)}
      {...props}
    >
      {children}
    </PlateLeaf>
  );
}

PresentationLeafElement.displayName = "PresentationLeafElement";
