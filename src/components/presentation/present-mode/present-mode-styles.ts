import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";

/**
 * Common style constants for present mode components.
 * These can be used across SlideWrapper and other components
 * to maintain consistent styling.
 */

/**
 * Classes applied to the slide wrapper when in present mode (presentation/fluid format).
 * Creates a fixed fullscreen overlay with centered content, scrollable.
 */
export const PRESENT_MODE_OVERLAY_CLASSES =
  "fixed inset-0 pb-0 grid place-items-center overflow-y-auto overflow-x-hidden max-h-dvh w-dvw";

/**
 * Classes applied to the slide wrapper when in present mode (social format).
 * Creates a fixed fullscreen overlay with horizontally centered content, scrollable.
 */
export const PRESENT_MODE_OVERLAY_CLASSES_SOCIAL =
  "fixed inset-0 pb-0 flex flex-col items-center overflow-y-auto overflow-x-hidden max-h-dvh w-dvw";

/**
 * Classes for the slide content container in present mode (presentation format).
 * Ensures content scales from top center.
 */
export const PRESENT_MODE_SLIDE_CLASSES = "origin-top";

/**
 * Classes for the slide content container in present mode (social format).
 * Ensures content scales from center and is centered within the container.
 */
export const PRESENT_MODE_SLIDE_CLASSES_SOCIAL = "origin-top my-auto";

/**
 * Get the appropriate overlay classes based on format category.
 * @param formatCategory - The slide format category
 * @returns CSS classes for the overlay container
 */
export function getPresentModeOverlayClasses(
  formatCategory: PlateSlide["formatCategory"] = "presentation",
): string {
  if (formatCategory === "social") {
    return PRESENT_MODE_OVERLAY_CLASSES_SOCIAL;
  }
  return PRESENT_MODE_OVERLAY_CLASSES;
}

/**
 * Get the appropriate slide content classes based on format category.
 * @param formatCategory - The slide format category
 * @returns CSS classes for the slide content container
 */
export function getPresentModeSlideClasses(
  formatCategory: PlateSlide["formatCategory"] = "presentation",
): string {
  if (formatCategory === "social") {
    return PRESENT_MODE_SLIDE_CLASSES_SOCIAL;
  }
  return PRESENT_MODE_SLIDE_CLASSES;
}
