/**
 * DOM-based PPTX Converter
 * Converts scanned slide DOM data to PPTX using pptxgenjs
 */

import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import PptxGenJS from "pptxgenjs/dist/pptxgen.bundle.js";
import {
  type BackgroundRectExportElement,
  type DecorExportElement,
  type ElementPosition,
  type ExportElement,
  type ImageExportElement,
  type PresentationStyles,
  type RootImageData,
  type ScanResult,
  type ShapeExportElement,
  type TableExportElement,
  type TextExportElement,
} from "./types";

/**
 * Convert scanned slides to PPTX
 */
export async function convertToPptx(
  scanResults: ScanResult[],
  slides: PlateSlide[],
): Promise<ArrayBuffer> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";

  // Process each slide
  for (let i = 0; i < scanResults.length; i++) {
    const scanResult = scanResults[i];
    const slideData = slides[i];

    if (!scanResult || !slideData) continue;

    await addSlide(pptx, scanResult, slideData);
  }

  // Generate the file
  const data = await pptx.write({ outputType: "arraybuffer" });
  return data as ArrayBuffer;
}

/**
 * Add a single slide to the presentation
 */
async function addSlide(
  pptx: PptxGenJS,
  scanResult: ScanResult,
  slideData: PlateSlide,
): Promise<void> {
  const slide = pptx.addSlide();

  // SPECIAL HANDLING: Image Slide
  // If this is an image slide, we just want the image to fill the slide completely
  // and ignore all other content
  if (slideData.isImageSlide && slideData.rootImage?.url) {
    const slideWidthInches = 10;
    const slideHeightInches = 5.625;

    // Use 'data' for base64 images, 'path' for URLs
    const imageProps: PptxGenJS.ImageProps = {
      x: 0,
      y: 0,
      w: slideWidthInches,
      h: slideHeightInches,
      sizing: {
        type: "crop",
        w: slideWidthInches,
        h: slideHeightInches,
      },
    };

    if (
      slideData.rootImage.url.startsWith("data:") ||
      slideData.rootImage.url.length > 2000 // Simple heuristic for base64 data
    ) {
      imageProps.data = slideData.rootImage.url;
    } else {
      imageProps.path = slideData.rootImage.url;
    }

    try {
      slide.addImage(imageProps);
    } catch (error) {
      console.warn("Failed to add image slide image:", error);
    }

    // Stop processing this slide
    return;
  }

  const {
    width: slideWidthPx,
    height: slideHeightPx,
    styles,
    elements,
    rootImage: scannedRootImage,
    backgroundImageUrl,
  } = scanResult;

  // Calculate conversion factors
  const slideWidthInches = 10; // Standard 16:9 width
  const slideHeightInches = 5.625; // Standard 16:9 height

  const scaleX = slideWidthInches / slideWidthPx;
  const scaleY = slideHeightInches / slideHeightPx;

  // Set slide background color ONLY if it's a non-white, non-black color
  // (black "000000" is the default fallback which we don't want)
  // (white "FFFFFF" is the standard slide background)
  const bgColor = styles.backgroundColor;
  const skipColors = ["000000", "FFFFFF", ""];
  if (bgColor && !skipColors.includes(bgColor.toUpperCase())) {
    slide.background = { color: bgColor };
  }

  // Handle background image (layout type "background")
  if (backgroundImageUrl) {
    try {
      slide.background = { path: backgroundImageUrl };
    } catch (error) {
      console.warn("Failed to set background image:", error);
    }
  }

  if (scannedRootImage?.url) {
    // Use DOM-scanned position for accurate placement
    const position = scalePosition(scannedRootImage.position, scaleX, scaleY);
    await addRootImage(slide, scannedRootImage, position);
  }

  // Add all scanned elements (includes in-editor images from contentWalker)
  for (const element of elements) {
    await addElement(slide, element, scaleX, scaleY, styles);
  }
}

/**
 * Add root image to slide
 * Since root images are now captured as PNG with CSS cropping already applied,
 * we just need to insert them at the correct position.
 */
async function addRootImage(
  slide: PptxGenJS.Slide,
  rootImage: RootImageData,
  position: { x: number; y: number; w: number; h: number },
): Promise<void> {
  const imageOptions: PptxGenJS.ImageProps = {
    x: position.x,
    y: position.y,
    w: position.w,
    h: position.h,
  };

  // Use 'data' for base64 images, 'path' for URLs
  if (rootImage.isBase64 || rootImage.url.startsWith("data:")) {
    imageOptions.data = rootImage.url;
  } else {
    imageOptions.path = rootImage.url;
  }

  try {
    slide.addImage(imageOptions);
  } catch (error) {
    console.warn("Failed to add root image:", error);
  }
}

/**
 * Add a scanned element to the slide
 */
async function addElement(
  slide: PptxGenJS.Slide,
  element: ExportElement,
  scaleX: number,
  scaleY: number,
  styles: PresentationStyles,
): Promise<void> {
  const position = scalePosition(element.position, scaleX, scaleY);

  switch (element.type) {
    case "text":
      addTextElement(slide, element, position, styles);
      break;
    case "table":
      addTable(slide, element, position, styles);
      break;
    case "image":
      addImageElement(slide, element, position);
      break;
    case "decor":
      addDecorElement(slide, element, position);
      break;
    case "shape":
      addShapeElement(slide, element, position);
      break;
    case "backgroundRect":
      addBackgroundRectElement(slide, element, position);
      break;
  }
}

/**
 * Convert position from percentage (0-100) to inches
 * ContentWalker returns positions as percentages relative to slide dimensions
 * If aspectRatio is present, preserve proportions while fitting inside
 * the original measured box so export never grows beyond DOM bounds.
 */
function scalePosition(
  position: ElementPosition,
  _scaleX: number,
  _scaleY: number,
): { x: number; y: number; w: number; h: number } {
  // Standard 16:9 slide dimensions in inches
  const slideWidthInches = 10;
  const slideHeightInches = 5.625;

  const x = (position.x / 100) * slideWidthInches;
  const y = (position.y / 100) * slideHeightInches;
  let w = (position.width / 100) * slideWidthInches;
  let h = (position.height / 100) * slideHeightInches;

  const originalW = w;
  const originalH = h;

  // Preserve aspect ratio while constraining to original measured bounds.
  // This prevents wide charts from expanding outside the slide.
  if (position.aspectRatio !== undefined && position.aspectRatio > 0) {
    if (position.aspectRatioBase === "height") {
      // Start from height, then clamp into the original box.
      w = h * position.aspectRatio;
      if (w > originalW) {
        w = originalW;
        h = w / position.aspectRatio;
      }
    } else {
      // Start from width, then clamp into the original box.
      h = w / position.aspectRatio;
      if (h > originalH) {
        h = originalH;
        w = h * position.aspectRatio;
      }
    }
  }

  return { x, y, w, h };
}

/**
 * Standard font sizes for different text element types (in points)
 * These match typical PowerPoint presentation standards
 */
const STANDARD_FONT_SIZES: Record<string, number> = {
  h1: 32,
  h2: 20,
  h3: 18,
  h4: 12,
  h5: 12,
  h6: 12,
  p: 12,
  blockquote: 12,
  code_block: 12,
  li: 12,
  ul: 12,
  ol: 12,
};

/**
 * Get standard font size based on node type
 */
function getStandardFontSize(nodeType?: string): number {
  if (!nodeType) return STANDARD_FONT_SIZES.p!;
  return STANDARD_FONT_SIZES[nodeType] ?? STANDARD_FONT_SIZES.p!;
}

/**
 * Add text element
 */
function addTextElement(
  slide: PptxGenJS.Slide,
  element: TextExportElement,
  position: { x: number; y: number; w: number; h: number },
  styles: PresentationStyles,
): void {
  const { textContent, textStyles, nodeType } = element;

  if (!textContent.trim()) return;

  // Use standard font size based on node type instead of DOM-extracted size
  const fontSizePt = getStandardFontSize(nodeType);

  // Check if this is a heading type
  const isHeading = nodeType && /^h[1-6]$/.test(nodeType);

  const textOptions: PptxGenJS.TextPropsOptions = {
    x: position.x,
    y: position.y,
    w: position.w,
    h: position.h,
    fontSize: fontSizePt,
    fontFace: isHeading
      ? styles.headingFont || textStyles.fontFamily
      : textStyles.fontFamily || styles.bodyFont,
    color: isHeading
      ? styles.headingColor || textStyles.color
      : textStyles.color || styles.textColor,
    align: textStyles.textAlign || "left",
    valign: "top",
    wrap: true,
    // Auto-shrink text to fit within the bounding box if it overflows
    // This ensures text that fits in HTML also fits in the exported PPT
    fit: "shrink",
  };

  // Add bold for headings or if specified
  if (
    isHeading ||
    (textStyles.fontWeight &&
      (textStyles.fontWeight === "bold" ||
        Number(textStyles.fontWeight) >= 700))
  ) {
    textOptions.bold = true;
  }
  if (textStyles.fontStyle === "italic") {
    textOptions.italic = true;
  }
  if (textStyles.textDecoration?.includes("underline")) {
    textOptions.underline = { style: "sng" };
  }

  // Add background if present
  if (element.backgroundColor) {
    textOptions.fill = { color: element.backgroundColor.replace("#", "") };
  }

  slide.addText(textContent, textOptions);
}

/**
 * Add SVG element as image
 */

/**
 * Add chart element as image
 */

/**
 * Add decorative element
 */
function addDecorElement(
  slide: PptxGenJS.Slide,
  element: DecorExportElement,
  position: { x: number; y: number; w: number; h: number },
): void {
  if (!element.base64Data) return;

  try {
    slide.addImage({
      data: element.base64Data,
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h,
      sizing: {
        type: "contain",
        w: position.w,
        h: position.h,
      },
    });
  } catch (error) {
    console.warn("Failed to add decor element:", error);
  }
}

/**
 * Add shape element
 */

/**
 * Add native shape element (arrow, pill, parallelogram)
 */
function addShapeElement(
  slide: PptxGenJS.Slide,
  element: ShapeExportElement,
  position: { x: number; y: number; w: number; h: number },
): void {
  try {
    // Use string literals cast to the correct type to ensure runtime compatibility
    // while satisfying the type checker.
    let shapeType: PptxGenJS.SHAPE_NAME = "rect";
    let rotate = 0;
    let rectRadius = 0;

    const isHorizontal = element.orientation === "horizontal";

    switch (element.shapeType) {
      case "arrow":
        // Use rightArrow for horizontal, downArrow (or rotated) for vertical
        if (isHorizontal) {
          shapeType = "rightArrow";
        } else {
          shapeType = "downArrow";
        }
        break;
      case "pill":
        shapeType = "roundRect";
        // Fully rounded for pill effect (pptxgenjs maps 1.0 to fully rounded)
        rectRadius = 1.0;
        break;
      case "parallelogram":
        shapeType = "parallelogram";
        // Vertical parallelogram needs rotation to match look
        if (!isHorizontal) {
          rotate = 90;
        }
        break;
    }

    slide.addShape(shapeType, {
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h,
      fill: { color: element.fillColor.replace("#", "") },
      rotate: rotate,
      rectRadius: rectRadius > 0 ? rectRadius : undefined,
      line: { type: "none" }, // Minimal/no border for these shapes
    });
  } catch (error) {
    console.warn("Failed to add shape element:", error);
  }
}

/**
 * Add background rectangle element (renders as PPT shape with fill color)
 */
function addBackgroundRectElement(
  slide: PptxGenJS.Slide,
  element: BackgroundRectExportElement,
  position: { x: number; y: number; w: number; h: number },
): void {
  try {
    // Calculate rectRadius (pptxgenjs uses 0-1 scale, where 1 = fully rounded)
    // cornerRadius from DOM is in pixels, position.h is in inches
    // Convert: pixels / (inches * 96 dpi) gives us ratio, then cap at 0.5
    const heightInPx = position.h * 96;
    const rectRadius = element.cornerRadius
      ? Math.min(element.cornerRadius / heightInPx, 0.5)
      : 0;

    // Parse gradient if present
    const gradientFill = parseGradientToFill(element.background);

    // Use "roundRect" when there's a corner radius, "rect" otherwise
    // IMPORTANT: rectRadius property ONLY works with "roundRect" shape type!
    const shapeType = rectRadius > 0 ? "roundRect" : "rect";

    slide.addShape(shapeType, {
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h,
      fill: gradientFill || { color: element.fillColor.replace("#", "") },
      rectRadius: rectRadius > 0 ? rectRadius : undefined,
      line: element.borderWidth
        ? {
            color: element.borderColor?.replace("#", "") || "000000",
            width: element.borderWidth,
          }
        : { type: "none" }, // Completely remove border - { width: 0 } still renders a faint line
    });
  } catch (error) {
    console.warn("Failed to add background rect element:", error);
  }
}

/**
 * Parse CSS gradient string to pptxgenjs fill object
 * Since pptxgenjs shapes don't support gradient fills, we extract the first
 * color from the gradient and use it as a solid fill.
 *
 * Handles full computed CSS background property like:
 * "rgba(0, 0, 0, 0) linear-gradient(135deg, rgb(231, 76, 60) 0%, rgb(192, 57, 43) 100%) repeat scroll 0% 0% / auto padding-box border-box"
 */
function parseGradientToFill(
  background?: string,
): PptxGenJS.ShapeFillProps | null {
  if (!background || !background.includes("linear-gradient")) {
    return null;
  }

  // Extract just the linear-gradient(...) portion from the full background string
  // Match: linear-gradient( ... balanced parentheses ... )
  const gradientExtractRegex =
    /linear-gradient\(([^()]*(?:\([^()]*\)[^()]*)*)\)/;
  const extractMatch = background.match(gradientExtractRegex);

  if (!extractMatch || !extractMatch[1]) {
    return null;
  }

  // Extract the first color from the gradient content
  // Matches hex colors and rgb/rgba formats
  const colorRegex =
    /#[0-9a-fA-F]{3,8}|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/;
  const colorMatch = extractMatch[1].match(colorRegex);

  if (!colorMatch || !colorMatch[0]) {
    return null;
  }

  // Use the first color as a solid fill (pptxgenjs shapes don't support gradients)
  const firstColor = colorToHexSimple(colorMatch[0]);

  return {
    type: "solid",
    color: firstColor,
  };
}

/**
 * Simple hex color converter helper
 * Converts CSS color formats to hex (without #)
 */
function colorToHexSimple(color: string): string {
  if (!color) return "FFFFFF";

  // Already hex
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    // Handle shorthand hex (#abc -> AABBCC)
    if (hex.length === 3) {
      return (
        hex[0]! +
        hex[0]! +
        hex[1]! +
        hex[1]! +
        hex[2]! +
        hex[2]!
      ).toUpperCase();
    }
    return hex.toUpperCase();
  }

  // Handle rgb/rgba
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]!, 10);
    const g = parseInt(rgbMatch[2]!, 10);
    const b = parseInt(rgbMatch[3]!, 10);
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  return "FFFFFF";
}

/**
 * Add bullet list element
 */

/**
 * Add table element
 */
function addTable(
  slide: PptxGenJS.Slide,
  element: TableExportElement,
  position: { x: number; y: number; w: number; h: number },
  styles: PresentationStyles,
): void {
  const rows = element.rows.map((row) =>
    row.cells.map((cell) => ({
      text: cell.text,
      options: {
        fill: cell.isHeader
          ? { color: styles.cardBackground.replace("#", "") }
          : cell.backgroundColor
            ? { color: cell.backgroundColor.replace("#", "") }
            : undefined,
        bold: cell.isHeader,
        color: cell.textStyles?.color || styles.textColor,
        fontFace: cell.textStyles?.fontFamily || styles.bodyFont,
        fontSize: cell.textStyles?.fontSize
          ? Math.round(cell.textStyles.fontSize * 0.75)
          : 12,
        colspan: cell.colSpan,
        rowspan: cell.rowSpan,
      },
    })),
  );

  slide.addTable(rows, {
    x: position.x,
    y: position.y,
    w: position.w,
    // Auto-calculate row height or let PPTX handle it
  });
}

/**
 * Add image element (in-editor)
 */
function addImageElement(
  slide: PptxGenJS.Slide,
  element: ImageExportElement,
  position: { x: number; y: number; w: number; h: number },
): void {
  try {
    const imageSizing = {
      type:
        (element.sizing === "fill" ? "crop" : element.sizing) || "contain",
      w: position.w,
      h: position.h,
    } as const;

    // html-to-image returns chart snapshots as data URLs; these must use `data`
    // in pptxgenjs, not `path`, otherwise media metadata/targets can be invalid.
    const isBase64Image =
      element.url.startsWith("data:image/") ||
      (element.url.startsWith("image/") && element.url.includes("base64,"));

    if (isBase64Image) {
      slide.addImage({
        data: element.url,
        x: position.x,
        y: position.y,
        w: position.w,
        h: position.h,
        sizing: imageSizing,
      });
      return;
    }

    slide.addImage({
      path: element.url,
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h,
      sizing: imageSizing,
    });
  } catch (error) {
    console.warn("Failed to add image element:", error);
  }
}

/**
 * Export function for client-side use
 * Returns the blob and fileName for manual download handling
 */
export async function exportPresentationToPptx(
  scanResults: ScanResult[],
  slides: PlateSlide[],
  fileName: string = "presentation",
): Promise<{ blob: Blob; fileName: string }> {
  const arrayBuffer = await convertToPptx(scanResults, slides);

  const blob = new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });

  return { blob, fileName: `${fileName}.pptx` };
}

/**
 * Helper to trigger download of a blob
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
