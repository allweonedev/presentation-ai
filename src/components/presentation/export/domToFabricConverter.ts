import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import { uploadFiles } from "@/hooks/globals/useUploadthing";
import { type JsonValue } from "@prisma/client/runtime/client";
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
import { getOptimalPixelRatio } from "./utils";

/**
 * Base Fabric.js Object Interface
 */
interface BaseFabricObject {
  type: string;
  version: string;
  originX: "left" | "center" | "right";
  originY: "top" | "center" | "bottom";
  left: number;
  top: number;
  width?: number;
  height?: number;
  fill?: string | object | null;
  stroke?: string | null;
  strokeWidth?: number;
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  opacity?: number;
  skewX?: number;
  skewY?: number;
  rx?: number;
  ry?: number;
  selectable?: boolean;
  evented?: boolean;
  lockMovementX?: boolean;
  lockMovementY?: boolean;
  lockRotation?: boolean;
  lockScalingX?: boolean;
  lockScalingY?: boolean;
  clipPath?: FabricObject;
  absolutePositioned?: boolean;
}

interface FabricTextObject extends BaseFabricObject {
  type: "textbox";
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string | number;
  fontStyle: string;
  underline: boolean;
  textAlign: string;
  splitByGrapheme?: boolean;
}

interface FabricImageObject extends BaseFabricObject {
  type: "image";
  src: string;
  crossOrigin: "anonymous";
}

interface FabricRectObject extends BaseFabricObject {
  type: "rect";
}

interface FabricGroupObject extends BaseFabricObject {
  type: "group";
  objects: FabricObject[];
  subTargetCheck?: boolean;
}

interface FabricTriangleObject extends BaseFabricObject {
  type: "triangle";
}

type FabricObject =
  | FabricTextObject
  | FabricImageObject
  | FabricRectObject
  | FabricTriangleObject
  | FabricGroupObject;

/**
 * Design Content Structure expected by the Design Editor
 */
interface DesignContent {
  pages: Array<{
    id: string;
    title: string;
    pageBackground: string;
    canvasData: {
      version: string;
      objects: FabricObject[];
      background?: string;
    };
  }>;
  currentPageIndex: number;
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  lastModified: string;
}

// Target Canvas Dimensions (Standard 16:9 for web design)
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

/**
 * Helper to convert data URL to File
 */
function dataURLtoFile(dataurl: string, fileName: string): File | null {
  try {
    const arr = dataurl.split(",");
    const header = arr[0];
    const data = arr[1];
    if (!header || data === undefined) return null;

    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  } catch (e) {
    console.error("Failed to convert base64 to file:", e);
    return null;
  }
}

/**
 * Upload a single base64 image and return the URL
 * Uploads happen inline where they're encountered for better error handling
 */
async function uploadBase64Image(
  base64Data: string,
  filename: string,
): Promise<string> {
  const file = dataURLtoFile(base64Data, filename);
  if (!file) {
    throw new Error(`Failed to convert base64 to file: ${filename}`);
  }

  console.log(
    `Uploading ${filename} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
  );

  const result = await uploadFiles("editorUploader", { files: [file] });

  if (!result?.[0]?.ufsUrl) {
    throw new Error(`Upload failed for ${filename}: No URL returned`);
  }

  console.log(`Uploaded ${filename} -> ${result[0].ufsUrl}`);
  return result[0].ufsUrl;
}

/**
 * Convert scanned slides to Fabric.js Design Content
 */
export async function convertToFabricValues(
  scanResults: ScanResult[],
  slides: PlateSlide[],
): Promise<JsonValue> {
  // Process all slides in parallel using Promise.allSettled for resilience
  const pageResults = await Promise.allSettled(
    scanResults.map(async (scanResult, i) => {
      const slide = slides[i];
      return await createPageFromSlide(scanResult, slide, i);
    }),
  );

  // Filter out failed results and extract successful pages
  const pages = pageResults
    .filter(
      (
        result,
      ): result is PromiseFulfilledResult<
        Awaited<ReturnType<typeof createPageFromSlide>>
      > => result.status === "fulfilled",
    )
    .map((result) => result.value);

  // Log any failures
  pageResults.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(`Failed to process slide ${i + 1}:`, result.reason);
    }
  });

  const designContent: DesignContent = {
    pages,
    currentPageIndex: 0,
    zoom: 0.6,
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
    lastModified: new Date().toISOString(),
  };

  return JSON.parse(JSON.stringify(designContent)) as JsonValue;
}

async function createPageFromSlide(
  scanResult: ScanResult,
  _slide: PlateSlide | undefined,
  index: number,
) {
  // SPECIAL HANDLING: Image Slide
  if (_slide?.isImageSlide && _slide.rootImage?.url) {
    const rootImage = _slide.rootImage;
    // Safely assert url is string because of the check above
    const originalUrl = rootImage.url as string;

    // 1. Get Image URL (upload if base64)
    let imageUrl = originalUrl;
    const isCapturedImage =
      originalUrl.startsWith("data:") || originalUrl.length > 2000;

    if (isCapturedImage) {
      try {
        imageUrl = await uploadBase64Image(
          originalUrl,
          `slide-image-${index}.png`,
        );
      } catch (error) {
        console.error("Failed to upload image slide image:", error);
      }
    }

    // 2. Create Image Object covering the canvas
    const objects: FabricObject[] = [];

    // We need to load dimensions to calculate cover scale
    let width = CANVAS_WIDTH;
    let height = CANVAS_HEIGHT;
    try {
      const dims = await loadImageDimensions(imageUrl);
      width = dims.width;
      height = dims.height;
    } catch (e) {
      console.warn("Could not load image dimensions", e);
    }

    // Calculate "Crop" (Cover) Scale
    // Scale needed to cover width
    const scaleX = CANVAS_WIDTH / width;
    // Scale needed to cover height
    const scaleY = CANVAS_HEIGHT / height;
    // Use the larger scale to ensure coverage (object-fit: cover)
    const scale = Math.max(scaleX, scaleY);

    // Center the image within the target box
    const renderedWidth = width * scale;
    const renderedHeight = height * scale;

    const left = 0 - (renderedWidth - CANVAS_WIDTH) / 2;
    const top = 0 - (renderedHeight - CANVAS_HEIGHT) / 2;

    const imageObj: FabricImageObject = {
      type: "image",
      version: "5.3.0",
      originX: "left",
      originY: "top",
      left: left,
      top: top,
      scaleX: scale,
      scaleY: scale,
      src: imageUrl,
      crossOrigin: "anonymous",
      // Clip to canvas bounds
      clipPath: {
        type: "rect",
        version: "5.3.0",
        originX: "left",
        originY: "top",
        left: 0,
        top: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        absolutePositioned: true,
      },
    };

    objects.push(imageObj);

    return {
      id: Math.random().toString(36).substr(2, 9),
      title: `Slide ${index + 1}`,
      pageBackground: "#ffffff",
      canvasData: {
        version: "5.3.0",
        objects,
        background: "#ffffff",
      },
    };
  }

  const { elements, styles, rootImage } = scanResult;

  const objects: FabricObject[] = [];

  // 1. Root Image (upload happens inline)
  if (rootImage?.url) {
    const rootImgObj = await createRootImageObject(rootImage, index);
    if (rootImgObj) objects.push(rootImgObj);
  }

  // 2. Elements (processed in parallel with allSettled)
  const elementResults = await Promise.allSettled(
    elements.map((element) => createElementObject(element, styles)),
  );

  for (const result of elementResults) {
    if (result.status === "fulfilled" && result.value) {
      if (Array.isArray(result.value)) {
        objects.push(...result.value);
      } else {
        objects.push(result.value);
      }
    } else if (result.status === "rejected") {
      console.warn("Failed to create element:", result.reason);
    }
  }

  // Determine background color - use presentation styles
  const bgColor = styles.backgroundColor
    ? `#${styles.backgroundColor.replace("#", "")}`
    : "#ffffff";

  return {
    id: Math.random().toString(36).substr(2, 9),
    title: `Slide ${index + 1}`,
    pageBackground: bgColor,
    canvasData: {
      version: "5.3.0",
      objects,
      background: bgColor,
    },
  };
}

/**
 * Convert percentage position (0-100) to canvas coordinates
 * Matches PPT converter's scalePosition logic
 */
function scalePosition(pos: ElementPosition): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  // Position values from contentWalker are percentages (0-100)
  // Convert to canvas coordinates
  const left = (pos.x / 100) * CANVAS_WIDTH;
  const top = (pos.y / 100) * CANVAS_HEIGHT;
  let width = (pos.width / 100) * CANVAS_WIDTH;
  let height = (pos.height / 100) * CANVAS_HEIGHT;

  const originalWidth = width;
  const originalHeight = height;

  // Preserve aspect ratio while fitting inside original measured bounds.
  // This avoids chart width blow-up for full-width chart blocks.
  if (pos.aspectRatio !== undefined && pos.aspectRatio > 0) {
    if (pos.aspectRatioBase === "height") {
      // Start from height, then clamp into the original box.
      width = height * pos.aspectRatio;
      if (width > originalWidth) {
        width = originalWidth;
        height = width / pos.aspectRatio;
      }
    } else {
      // Start from width, then clamp into the original box.
      height = width / pos.aspectRatio;
      if (height > originalHeight) {
        height = originalHeight;
        width = height * pos.aspectRatio;
      }
    }
  }

  return { left, top, width, height };
}

/**
 * Create root image object with inline upload
 * Root images are captured with html-to-image using pixelRatio, so they need scaling.
 */
async function createRootImageObject(
  rootImage: RootImageData,
  slideIndex: number,
): Promise<FabricImageObject | null> {
  const pos = scalePosition(rootImage.position);

  // 1. Try to use original URL if available (preferred for quality and scaling)
  if (rootImage.originalUrl) {
    try {
      // Load dimensions to calculate cover scale
      const dims = await loadImageDimensions(rootImage.originalUrl);

      // Determine correct URL - if it's a blob/data URL, we might need to upload it?
      // For now, assuming originalUrl is a remote URL or we use it as is.
      // If it is a base64 unique from the capture, we might want to upload it,
      // but usually originalUrl is a persistent URL.

      /* Calculate "Cover" Scale */
      // Scale needed to cover width
      const scaleX = pos.width / dims.width;
      // Scale needed to cover height
      const scaleY = pos.height / dims.height;
      // Use the larger scale to ensure coverage (object-fit: cover)
      const scale = Math.max(scaleX, scaleY);

      /* Calculate Centered Position */
      const renderedWidth = dims.width * scale;
      const renderedHeight = dims.height * scale;

      // Center the image within the target box
      const left = pos.left - (renderedWidth - pos.width) / 2;
      const top = pos.top - (renderedHeight - pos.height) / 2;

      return {
        type: "image",
        version: "5.3.0",
        originX: "left",
        originY: "top",
        left: left,
        top: top,
        scaleX: scale,
        scaleY: scale,
        src: rootImage.originalUrl,
        crossOrigin: "anonymous",
        // Clip path creates the window through which we see the image
        // It matches the target dimensions exactly
        clipPath: {
          type: "rect",
          version: "5.3.0",
          originX: "left",
          originY: "top",
          left: pos.left,
          top: pos.top,
          width: pos.width,
          height: pos.height,
          absolutePositioned: true,
        },
      };
    } catch (e) {
      console.warn(
        "Failed to load original root image, falling back to capture",
        e,
      );
    }
  }

  // 2. Fallback to existing logic (captured image)
  let imageUrl = rootImage.url;
  const isCapturedImage =
    rootImage.isBase64 || rootImage.url.startsWith("data:");

  // Upload base64 images inline
  if (isCapturedImage) {
    try {
      imageUrl = await uploadBase64Image(
        rootImage.url,
        `root-image-${slideIndex}.png`,
      );
    } catch (error) {
      console.error("Failed to upload root image:", error);
      // Fall back to original URL (may fail in Fabric if too large)
      imageUrl = rootImage.url;
    }
  }

  // Captured images are at pixelRatio x natural size, need to scale down
  const pixelRatio = isCapturedImage ? getOptimalPixelRatio() : 1;
  const scaleFactor = 1 / pixelRatio;

  return {
    type: "image",
    version: "5.3.0",
    originX: "left",
    originY: "top",
    left: pos.left,
    top: pos.top,
    // Don't set width/height - let Fabric use natural dimensions
    // Apply scale to fit within target bounds
    scaleX: scaleFactor,
    scaleY: scaleFactor,
    src: imageUrl,
    crossOrigin: "anonymous",
  };
}

async function createElementObject(
  element: ExportElement,
  styles: PresentationStyles,
): Promise<FabricObject | FabricObject[] | null> {
  const pos = scalePosition(element.position);

  switch (element.type) {
    case "text":
      return createTextObject(element, pos, styles);
    case "image":
      return await createImageObject(element, pos);
    case "shape":
      return createShapeObject(element, pos);
    case "backgroundRect":
      return createRectObject(element, pos);
    case "table":
      return createTableObject(element, pos, styles);
    case "decor":
      return await createDecorObject(element, pos);
    default:
      return null;
  }
}

/**
 * Standard font sizes for different text element types (in points)
 * These match typical presentation standards
 */
const STANDARD_FONT_SIZES: Record<string, number> = {
  h1: 44,
  h2: 28,
  h3: 24,
  h4: 18,
  h5: 16,
  h6: 14,
  p: 16,
  blockquote: 16,
  code_block: 14,
  li: 16,
  ul: 16,
  ol: 16,
};

/**
 * Get standard font size based on node type
 */
function getStandardFontSize(nodeType?: string): number {
  if (!nodeType) return STANDARD_FONT_SIZES.p!;
  return STANDARD_FONT_SIZES[nodeType] ?? STANDARD_FONT_SIZES.p!;
}

function createTextObject(
  element: TextExportElement,
  pos: { left: number; top: number; width: number; height: number },
  styles: PresentationStyles,
): FabricTextObject | null {
  const { textContent, textStyles, nodeType } = element;

  if (!textContent.trim()) return null;

  // Use standard font size based on node type instead of DOM-extracted size
  const fontSizePt = getStandardFontSize(nodeType);

  // Check if this is a heading type
  const isHeading = nodeType && /^h[1-6]$/.test(nodeType);

  // Determine color - use heading color for headings, text color otherwise
  // Match PPT converter's logic
  const fillColor = isHeading
    ? styles.headingColor || textStyles.color || "#000000"
    : textStyles.color || styles.textColor || "#000000";

  // Determine font - use heading font for headings, body font otherwise
  const fontFamily = isHeading
    ? styles.headingFont || textStyles.fontFamily || "Inter"
    : textStyles.fontFamily || styles.bodyFont || "Inter";

  // Determine if bold
  const isBold =
    isHeading ||
    (textStyles.fontWeight &&
      (textStyles.fontWeight === "bold" ||
        Number(textStyles.fontWeight) >= 700));

  return {
    type: "textbox",
    version: "5.3.0",
    originX: "left",
    originY: "top",
    left: pos.left,
    top: pos.top,
    width: pos.width,
    text: textContent,
    fontSize: fontSizePt,
    fontFamily: fontFamily,
    fontWeight: isBold ? "bold" : textStyles.fontWeight || "normal",
    fontStyle: textStyles.fontStyle || "normal",
    underline: textStyles.textDecoration?.includes("underline") || false,
    fill: fillColor.startsWith("#") ? fillColor : `#${fillColor}`,
    textAlign: textStyles.textAlign || "left",
    splitByGrapheme: true,
  };
}

/**
 * Create image object
 * Charts are captured with html-to-image (base64/data URLs) and need pixelRatio scaling
 * Regular images from URLs don't need scaling
 */
async function createImageObject(
  element: ImageExportElement,
  pos: { left: number; top: number; width: number; height: number },
): Promise<FabricImageObject> {
  // Check if this is a captured image (charts are captured as base64/data URLs)
  const isCapturedImage = element.url.startsWith("data:");

  if (isCapturedImage) {
    try {
      // Load dimensions to calculate exact scale needed to fit the target 'pos'
      // This fixes issues where the captured size doesn't match the expected layout size (overflow)
      const dims = await loadImageDimensions(element.url);

      const scaleX = pos.width / dims.width;
      const scaleY = pos.height / dims.height;

      return {
        type: "image",
        version: "5.3.0",
        originX: "left",
        originY: "top",
        left: pos.left,
        top: pos.top,
        scaleX: scaleX,
        scaleY: scaleY,
        src: element.url,
        crossOrigin: "anonymous",
      };
    } catch (error) {
      console.warn(
        "Failed to load image dimensions for scaling, falling back to pixelRatio estimation",
        error,
      );

      // Fallback: Captured images are at pixelRatio x natural size, need to scale down
      const pixelRatio = getOptimalPixelRatio();
      const scaleFactor = 1 / pixelRatio;

      return {
        type: "image",
        version: "5.3.0",
        originX: "left",
        originY: "top",
        left: pos.left,
        top: pos.top,
        scaleX: scaleFactor,
        scaleY: scaleFactor,
        src: element.url,
        crossOrigin: "anonymous",
      };
    }
  }

  // For regular URL images, use width/height directly
  return {
    type: "image",
    version: "5.3.0",
    originX: "left",
    originY: "top",
    left: pos.left,
    top: pos.top,
    width: pos.width,
    height: pos.height,
    src: element.url,
    crossOrigin: "anonymous",
  };
}

function createShapeObject(
  element: ShapeExportElement,
  pos: { left: number; top: number; width: number; height: number },
): FabricRectObject | FabricTriangleObject {
  // Ensure fillColor has # prefix
  const fillColor = element.fillColor.startsWith("#")
    ? element.fillColor
    : `#${element.fillColor}`;

  if (element.shapeType === "pill") {
    return {
      type: "rect",
      version: "5.3.0",
      originX: "left",
      originY: "top",
      left: pos.left,
      top: pos.top,
      width: pos.width,
      height: pos.height,
      fill: fillColor,
      rx: pos.height / 2,
      ry: pos.height / 2,
    };
  }

  if (element.shapeType === "arrow") {
    return {
      type: "triangle",
      version: "5.3.0",
      originX: "left",
      originY: "top",
      left: pos.left,
      top: pos.top,
      width: pos.width,
      height: pos.height,
      fill: fillColor,
    };
  }

  if (element.shapeType === "parallelogram") {
    return {
      type: "rect",
      version: "5.3.0",
      originX: "left",
      originY: "top",
      left: pos.left,
      top: pos.top,
      width: pos.width,
      height: pos.height,
      fill: fillColor,
      skewX: 20,
    };
  }

  return {
    type: "rect",
    version: "5.3.0",
    originX: "left",
    originY: "top",
    left: pos.left,
    top: pos.top,
    width: pos.width,
    height: pos.height,
    fill: fillColor,
  };
}

function createRectObject(
  element: BackgroundRectExportElement,
  pos: { left: number; top: number; width: number; height: number },
): FabricRectObject {
  // Ensure fillColor has # prefix
  const fillColor = element.fillColor.startsWith("#")
    ? element.fillColor
    : `#${element.fillColor}`;

  // Calculate rx/ry from cornerRadius
  // cornerRadius is in pixels, convert proportionally to canvas coordinates
  const rx = element.cornerRadius || 0;
  const ry = element.cornerRadius || 0;

  return {
    type: "rect",
    version: "5.3.0",
    originX: "left",
    originY: "top",
    left: pos.left,
    top: pos.top,
    width: pos.width,
    height: pos.height,
    fill: fillColor,
    rx: rx,
    ry: ry,
    stroke: element.borderColor
      ? element.borderColor.startsWith("#")
        ? element.borderColor
        : `#${element.borderColor}`
      : null,
    strokeWidth: element.borderWidth || 0,
  };
}

/**
 * Create decor object with inline upload
 * Decor elements are captured with html-to-image using pixelRatio, so the natural
 * image size is larger than the canvas target size. We need to scale them down.
 */
async function createDecorObject(
  element: DecorExportElement,
  pos: { left: number; top: number; width: number; height: number },
): Promise<FabricImageObject | null> {
  if (!element.base64Data) return null;

  let imageSrc = element.base64Data;

  // Upload base64 images inline
  if (element.base64Data.startsWith("data:")) {
    try {
      const filename = `decor-${Math.random().toString(36).slice(2)}.png`;
      imageSrc = await uploadBase64Image(element.base64Data, filename);
    } catch (error) {
      console.error("Failed to upload decor element:", error);
      // Fall back to base64 (may fail if too large)
    }
  }

  // Decor images are captured with a pixelRatio multiplier (2x or 3x)
  // This means the natural image size is pixelRatio times larger than the target size
  // We need to scale down by 1/pixelRatio to fit the target bounds
  const pixelRatio = getOptimalPixelRatio();
  const scaleFactor = 1 / pixelRatio;

  return {
    type: "image",
    version: "5.3.0",
    originX: "left",
    originY: "top",
    left: pos.left,
    top: pos.top,
    // Don't set width/height - let Fabric use the natural image dimensions
    // Then apply scale to fit within target bounds
    scaleX: scaleFactor,
    scaleY: scaleFactor,
    src: imageSrc,
    crossOrigin: "anonymous",
  };
}

/**
 * Create editable table object using Group with subTargetCheck
 */
function createTableObject(
  element: TableExportElement,
  pos: { left: number; top: number; width: number; height: number },
  styles: PresentationStyles,
): FabricGroupObject | null {
  if (!element.rows || element.rows.length === 0) return null;

  const rows = element.rows;

  // Need to find the source dimensions (total width/height of the table in DOM) to calculate scale scaleRatio
  // We can infer it from the max x+width and max y+height of the cells if not explicitly passed,
  // or we can iterate to find the max boundaries.

  let sourceWidth = 0;
  let sourceHeight = 0;

  // First pass: determine source bounds
  for (const row of rows) {
    if (!row) continue;
    for (const cell of row.cells) {
      if (cell?.box) {
        sourceWidth = Math.max(sourceWidth, cell.box.x + cell.box.width);
        sourceHeight = Math.max(sourceHeight, cell.box.y + cell.box.height);
      }
    }
  }

  // Fallback defaults if box is missing (shouldn't happen with new contentWalker)
  if (sourceWidth === 0) sourceWidth = 1000;
  if (sourceHeight === 0) sourceHeight = 500;

  // Calculate scale factors to map source pixels (DOM) to target pixels (Canvas)
  // We want to fit the table into 'pos', so we scale source dimensions to match pos dimensions.
  const scaleX = pos.width / sourceWidth;
  const scaleY = pos.height / sourceHeight;

  const objects: FabricObject[] = [];
  const distinctRects: FabricRectObject[] = [];
  const textObjects: FabricTextObject[] = [];

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (!row) continue;

    for (let c = 0; c < row.cells.length; c++) {
      const cell = row.cells[c];
      if (!cell) continue;

      // Determine Geometry
      let cellX = 0,
        cellY = 0,
        cellW = 0,
        cellH = 0;

      if (cell.box) {
        cellX = cell.box.x * scaleX;
        cellY = cell.box.y * scaleY;
        cellW = cell.box.width * scaleX;
        cellH = cell.box.height * scaleY;
      } else {
        continue;
      }

      // Calculate position relative to group center
      const relLeft = cellX - pos.width / 2;
      const relTop = cellY - pos.height / 2;

      // 1. Create Cell Rect
      const isHeader = cell.isHeader || r < (element.headerRowCount || 0);

      // Determine colors
      let cellFill = cell.backgroundColor || "transparent";
      if (isHeader) {
        cellFill = styles.cardBackground || styles.secondaryColor || "#e0e0e0";
      } else if (!cell.backgroundColor) {
        cellFill = "transparent";
      }

      if (cellFill !== "transparent" && !cellFill.startsWith("#")) {
        cellFill = `#${cellFill.replace("#", "")}`;
      }

      const rect: FabricRectObject = {
        type: "rect",
        version: "5.3.0",
        originX: "left",
        originY: "top",
        left: relLeft,
        top: relTop,
        width: cellW,
        height: cellH,
        fill: cellFill,
        stroke: styles.textColor || "#000000",
        strokeWidth: 1,
        // Disable interaction with background cells
        selectable: false,
        evented: false, // Ensure clicks pass through to potential underlying objects or group
      };

      distinctRects.push(rect);

      // 2. Create Text
      const cellText = cell.text || "";
      if (cellText.trim()) {
        const fontSize = 14;

        let textColor = styles.textColor || "#000000";
        if (isHeader) {
          textColor = styles.headingColor || "#000000";
        }
        if (!textColor.startsWith("#"))
          textColor = `#${textColor.replace("#", "")}`;

        // Add padding to text
        const paddingX = 10;
        const textWidth = Math.max(0, cellW - paddingX * 2);

        const text: FabricTextObject = {
          type: "textbox",
          version: "5.3.0",
          originX: "left",
          originY: "center", // Vertically centered
          left: relLeft + paddingX, // Offset by padding
          top: relTop + cellH / 2, // Vertically centered relative to cell top
          width: textWidth,
          text: cellText,
          fontSize: fontSize,
          fontFamily: styles.bodyFont || "Inter",
          fontWeight: isHeader ? "bold" : "normal",
          fontStyle: "normal",
          underline: false,
          fill: textColor,
          textAlign: "left", // Force left alignment
          splitByGrapheme: true,
          // Ensure text is editable
          selectable: true,
          evented: true,

          // Lock movement so users don't accidentally drag text out of cells
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
        };
        textObjects.push(text);
      }
    }
  }

  // Combine rects and texts
  objects.push(...distinctRects, ...textObjects);

  // Note: Fabric Group width/height aren't automatically calculated from objects if passed explicitly.
  // We provide explicit width/height matching the 'pos' target.

  return {
    type: "group",
    version: "5.3.0",
    originX: "left",
    originY: "top",
    left: pos.left,
    top: pos.top,
    width: pos.width,
    height: pos.height,
    fill: "transparent",
    objects: objects,
    subTargetCheck: true,
    evented: true,
    selectable: true,
  };
}

/**
 * Helper to load image dimensions
 */
function loadImageDimensions(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
}
