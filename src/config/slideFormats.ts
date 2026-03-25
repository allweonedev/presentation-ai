/**
 * Centralized configuration for slide formats, widths, and aspect ratios.
 * This file consolidates all slide sizing logic for easy maintenance and extension.
 */

// Aspect ratio constants
export const ASPECT_RATIOS = {
  A4: Math.SQRT2, // ~1.414
  LETTER: 11 / 8.5, // ~1.294
} as const;

// Base widths for different slide width sizes
export const BASE_WIDTHS = {
  S: 896, // max-w-4xl
  M: 1024, // max-w-5xl
  L: 1152, // max-w-6xl
} as const;

// Format category base widths (when not using S/M/L sizing)
export const FORMAT_CATEGORY_WIDTHS = {
  document: 1024,
  webpage: 1024,
  presentation: 1024,
  default: 1024,
} as const;

// Social format widths for different aspect ratios
export const SOCIAL_ASPECT_WIDTHS = {
  "1:1": 720, // Square
  "4:5": 720, // Portrait
  "9:16": 540, // Story (vertical)
  "16:9": 1024, // Wide (if needed)
  default: 640, // Fallback
} as const;

// Tall format configuration
export const TALL_FORMAT = {
  minHeightPx: 1200, // Static pixel value instead of 85vh
} as const;

/**
 * Get the base width for a slide based on format category, width size, and aspect ratio.
 *
 * @param formatCategory - The format category (presentation, social, document, webpage)
 * @param widthSize - The width size preset (S, M, L)
 * @param aspectRatio - Optional aspect ratio for social format differentiation
 * @returns The base width in pixels
 */
export function getSlideBaseWidth(
  formatCategory: "presentation" | "social" | "document" | "webpage",
  widthSize: "S" | "M" | "L" = "M",
  aspectRatio?: { type: string; value?: string },
): number {
  // Social format uses aspect-ratio-specific widths
  if (
    formatCategory === "social" &&
    aspectRatio?.type === "ratio" &&
    aspectRatio.value
  ) {
    const ratioValue = aspectRatio.value as keyof typeof SOCIAL_ASPECT_WIDTHS;
    return SOCIAL_ASPECT_WIDTHS[ratioValue] ?? SOCIAL_ASPECT_WIDTHS.default;
  }

  // Social format fallback (if no specific aspect ratio)
  if (formatCategory === "social") {
    return SOCIAL_ASPECT_WIDTHS.default;
  }

  // Other formats use S/M/L sizing or category defaults
  if (formatCategory === "presentation" || formatCategory === "webpage") {
    return BASE_WIDTHS[widthSize];
  }

  return (
    FORMAT_CATEGORY_WIDTHS[formatCategory] ?? FORMAT_CATEGORY_WIDTHS.default
  );
}

/**
 * Get the aspect ratio value for preset types (A4, Letter).
 */
export function getPresetAspectRatio(preset: "A4" | "Letter" | string): number {
  if (preset.toLowerCase() === "letter") {
    return ASPECT_RATIOS.LETTER;
  }
  return ASPECT_RATIOS.A4;
}

/**
 * Calculate the height in pixels based on width and aspect ratio.
 */
export function calculateHeightFromRatio(
  width: number,
  aspectRatio: { type: string; value?: string },
): { minHeightPx?: number; minHeightCSS?: string } {
  if (aspectRatio.type === "fluid") {
    return {}; // No height constraint
  }

  if (aspectRatio.type === "tall") {
    return {
      minHeightPx: TALL_FORMAT.minHeightPx,
      minHeightCSS: `${TALL_FORMAT.minHeightPx}px`,
    };
  }

  if (aspectRatio.type === "ratio" && aspectRatio.value) {
    const parts = aspectRatio.value.split(":");
    const w = Number(parts[0] || 0);
    const h = Number(parts[1] || 0);
    if (w > 0 && h > 0) {
      const heightPx = Math.round(width * (h / w));
      return {
        minHeightPx: heightPx,
        minHeightCSS: `${heightPx}px`,
      };
    }
  }

  if (aspectRatio.type === "preset" && aspectRatio.value) {
    const ratio = getPresetAspectRatio(aspectRatio.value);
    const heightPx = Math.round(width * ratio);
    return {
      minHeightPx: heightPx,
      minHeightCSS: `${heightPx}px`,
    };
  }

  return {};
}

// Export all config values for direct access if needed
export const SLIDE_FORMAT_CONFIG = {
  aspectRatios: ASPECT_RATIOS,
  baseWidths: BASE_WIDTHS,
  formatCategoryWidths: FORMAT_CATEGORY_WIDTHS,
  socialAspectWidths: SOCIAL_ASPECT_WIDTHS,
  tallFormat: TALL_FORMAT,
  getSlideBaseWidth,
  getPresetAspectRatio,
  calculateHeightFromRatio,
} as const;
