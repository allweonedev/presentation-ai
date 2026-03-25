/**
 * Utility to resolve CSS variables to their computed values
 * Critical for extracting actual colors, fonts, and other styles from the presentation theme
 */

import { type PresentationStyles } from "./types";

/**
 * Resolve a single CSS variable value from an element
 * @param varName - CSS variable name (with or without --)
 * @param element - Element to get computed style from
 * @returns Resolved value as a hex color or string
 */
export function resolveCssVariable(varName: string, element: Element): string {
  const computed = getComputedStyle(element);
  const cleanName = varName.startsWith("--") ? varName : `--${varName}`;
  const value = computed.getPropertyValue(cleanName).trim();

  // If value is empty, return a fallback
  if (!value) {
    return "";
  }

  return value;
}

/**
 * Parse a CSS value that might contain var() and resolve it
 * @param value - CSS value (might be "var(--something)" or a direct value)
 * @param element - Element for computed style lookup
 * @returns Resolved value
 */
export function resolveValue(value: string, element: Element): string {
  if (!value) return "";

  // Check if it's a CSS variable
  const varMatch = value.match(/var\(--([^,)]+)(?:,\s*([^)]+))?\)/);
  if (varMatch) {
    const varName = `--${varMatch[1]}`;
    const fallback = varMatch[2]?.trim();
    const resolved = resolveCssVariable(varName, element);
    return resolved || fallback || "";
  }

  return value;
}

/**
 * Convert any color format to hex
 * @param color - Color in any CSS format (rgb, rgba, hsl, hex, named)
 * @returns Hex color string (without #)
 */
export function colorToHex(color: string): string {
  if (!color) return "000000";

  // Already hex
  if (color.startsWith("#")) {
    return color.slice(1).toUpperCase();
  }

  // Named colors or other formats - use canvas to convert
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "000000";

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `${toHex(data[0]!)}${toHex(data[1]!)}${toHex(data[2]!)}`.toUpperCase();
}

/**
 * Resolve a CSS color value (handles var() and converts to hex)
 */
export function resolveColor(value: string, element: Element): string {
  const resolved = resolveValue(value, element);
  return colorToHex(resolved);
}

/**
 * Extract all presentation styles from a slide element
 * This resolves all CSS variables used in the presentation theme
 */
export function extractPresentationStyles(
  slideElement: Element,
): PresentationStyles {
  const getVar = (name: string, fallback: string = "#000000"): string => {
    const value = resolveCssVariable(name, slideElement);
    return colorToHex(value || fallback);
  };

  const getFontVar = (name: string, fallback: string = "Inter"): string => {
    const value = resolveCssVariable(name, slideElement);
    // Font values might have quotes, remove them
    return (value || fallback).replace(/['"]/g, "").trim();
  };

  const getStringVar = (name: string, fallback: string = ""): string => {
    const value = resolveCssVariable(name, slideElement);
    return value || fallback;
  };

  const maskClipPath = getStringVar("--presentation-mask-clip-path");
  const maskImage = getStringVar("--presentation-mask-image");

  // Extract background image from the slide element
  const bgImage = getComputedStyle(slideElement).backgroundImage;
  let backgroundImageUrl: string | undefined;
  if (bgImage && bgImage !== "none") {
    const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (urlMatch?.[1]) {
      backgroundImageUrl = urlMatch[1];
    }
  }

  return {
    // Colors
    primaryColor: getVar("--presentation-primary", "#3B82F6"),
    secondaryColor: getVar("--presentation-secondary", "#1F2937"),
    accentColor: getVar("--presentation-accent", "#60A5FA"),
    backgroundColor: getVar("--presentation-background", "#FFFFFF"),
    textColor: getVar("--presentation-text", "#1F2937"),
    headingColor: getVar("--presentation-heading", "#111827"),
    cardBackground: getVar("--presentation-card-background", "#F3F4F6"),
    smartLayoutColor: getVar("--presentation-smart-layout", "#3B82F6"),

    // Fonts
    headingFont: getFontVar("--presentation-heading-font", "Inter"),
    bodyFont: getFontVar("--presentation-body-font", "Inter"),

    cardBorderRadius: getStringVar("--presentation-card-border-radius", "1rem"),
    slideBorderRadius: getStringVar(
      "--presentation-slide-border-radius",
      "0px",
    ),
    buttonBorderRadius: getStringVar(
      "--presentation-button-border-radius",
      "0.5rem",
    ),

    // Shadows
    cardShadow: getStringVar("--presentation-card-shadow", "none"),
    buttonShadow: getStringVar("--presentation-button-shadow", "none"),
    slideShadow: getStringVar("--presentation-slide-shadow", "none"),

    transition: getStringVar("--presentation-transition", "none"),
    mask:
      maskClipPath || maskImage
        ? {
            clipPath: maskClipPath || undefined,
            maskImage: maskImage || undefined,
            maskSize: getStringVar("--presentation-mask-size") || undefined,
            maskPosition:
              getStringVar("--presentation-mask-position") || undefined,
            maskRepeat: getStringVar("--presentation-mask-repeat") || undefined,
          }
        : undefined,
    backgroundImageUrl,
  };
}

/**
 * Extract text styles from a DOM element
 */
export function extractTextStyles(element: Element): {
  fontFamily: string;
  fontSize: number;
  fontWeight: string | number;
  color: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  textDecoration?: string;
  fontStyle?: string;
  lineHeight?: number;
} {
  const computed = getComputedStyle(element);

  return {
    fontFamily:
      computed.fontFamily.replace(/['"]/g, "").split(",")[0]?.trim() || "Inter",
    fontSize: parseFloat(computed.fontSize) || 16,
    fontWeight: computed.fontWeight,
    color: colorToHex(computed.color),
    backgroundColor:
      computed.backgroundColor !== "rgba(0, 0, 0, 0)"
        ? colorToHex(computed.backgroundColor)
        : undefined,
    textAlign: computed.textAlign as "left" | "center" | "right" | "justify",
    textDecoration:
      computed.textDecorationLine !== "none"
        ? computed.textDecorationLine
        : undefined,
    fontStyle: computed.fontStyle !== "normal" ? computed.fontStyle : undefined,
    lineHeight: parseFloat(computed.lineHeight) || undefined,
  };
}

/**
 * Extract border styles from a DOM element
 */
export function extractBorderStyles(
  element: Element,
):
  | { width: number; color: string; style: string; radius?: number }
  | undefined {
  const computed = getComputedStyle(element);
  const borderWidth = parseFloat(computed.borderWidth);

  if (borderWidth === 0 || computed.borderStyle === "none") {
    return undefined;
  }

  return {
    width: borderWidth,
    color: colorToHex(computed.borderColor),
    style: computed.borderStyle,
    radius: parseFloat(computed.borderRadius) || undefined,
  };
}
