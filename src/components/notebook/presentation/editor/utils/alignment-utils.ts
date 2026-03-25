import type React from "react";
import { type PlateSlide } from "../../utils/parser";

/**
 * Get alignment style for the editor when in present mode.
 * Returns an inline style object for alignSelf property.
 */
export function getAlignmentStyle(
  isPresenting: boolean,
  alignment: PlateSlide["alignment"],
  layoutType: PlateSlide["layoutType"],
): React.CSSProperties {
  if (layoutType === "vertical") return {};
  if (isPresenting) {
    if (alignment === "start") return { alignSelf: "flex-start" };
    if (alignment === "end") return { alignSelf: "flex-end" };
    return { alignSelf: "center" };
  }
  return {};
}

/**
 * Get alignment class for the editor based on slide alignment.
 * Returns the justify-content class for vertical alignment.
 */
export function getAlignmentClass(
  alignment: PlateSlide["alignment"] | undefined,
): string {
  if (!alignment) return "justify-center";
  switch (alignment) {
    case "start":
      return "justify-start";
    case "center":
      return "justify-center";
    case "end":
      return "justify-end";
    default:
      return "justify-center";
  }
}
