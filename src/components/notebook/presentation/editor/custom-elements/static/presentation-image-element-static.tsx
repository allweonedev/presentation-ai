import type * as React from "react";

import { type TImageElement } from "platejs";
import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import { type ImageCropSettings } from "../../../utils/types";

// Alignment class mapping (matching the Resizable component behavior)
const alignmentClasses = {
  center: "mx-auto",
  left: "mr-auto",
  right: "ml-auto",
} as const;

// Static renderer for presentation image that preserves crop styles
export function PresentationImageElementStatic(
  props: SlateElementProps<
    TImageElement & {
      query?: string;
      cropSettings?: ImageCropSettings;
      align?: "center" | "left" | "right";
    }
  >,
) {
  const { url, query, cropSettings, width, align = "center" } = props.element;

  const imageStyles: React.CSSProperties = {
    objectFit: cropSettings?.objectFit ?? "cover",
    objectPosition: cropSettings
      ? `${cropSettings.objectPosition.x}% ${cropSettings.objectPosition.y}%`
      : "50% 50%",
    transform: `scale(${cropSettings?.zoom ?? 1})`,
    transformOrigin: cropSettings
      ? `${cropSettings.objectPosition.x}% ${cropSettings.objectPosition.y}%`
      : "50% 50%",
    borderRadius: "var(--presentation-border-radius, 0.5rem)",
    boxShadow: "var(--presentation-card-shadow, 0 1px 3px rgba(0,0,0,0.12))",
  };

  // Container styles for width and alignment
  const containerStyles: React.CSSProperties = {
    width:
      typeof width === "string" || typeof width === "number" ? width : "100%",
  };

  // Show placeholder when no URL exists
  if (!url) {
    return (
      <SlateElement {...props} className={cn(props.className, "block")}>
        <div
          className={cn(
            "flex aspect-video items-center justify-center rounded-md bg-muted/30",
            alignmentClasses[align],
          )}
          style={{
            ...containerStyles,
            borderRadius: "var(--presentation-border-radius, 0.5rem)",
          }}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <span className="text-sm">No image</span>
          </div>
        </div>
        {props.children}
      </SlateElement>
    );
  }

  return (
    <SlateElement {...props} className={cn(props.className)}>
      <div className={cn(alignmentClasses[align])} style={containerStyles}>
        {/** biome-ignore lint/performance/noImgElement: This is a valid use case */}
        <img
          src={url}
          alt={query ?? ""}
          className="block h-auto w-full max-w-full"
          style={imageStyles}
        />
      </div>
      {props.children}
    </SlateElement>
  );
}


