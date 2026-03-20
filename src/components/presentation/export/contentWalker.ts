/**
 * PlateJS Content Walker
 * Traverses PlateJS slide content to extract structured elements
 */
import { type PlateNode } from "@/components/notebook/presentation/utils/parser";
import { toPng } from "html-to-image";
import { KEYS } from "platejs";
import { extractTextStyles } from "./cssVariableResolver";
import {
  type BackgroundRectExportElement,
  type DecorExportElement,
  type ElementPosition,
  type ExportElement,
  type ImageExportElement,
  type ShapeExportElement,
  type TableCell,
  type TableExportElement,
  type TableRow,
} from "./types";
import { getOptimalPixelRatio } from "./utils";

/**
 *
 * Scan a slide's content and extract all exportable elements
 */
export async function walkSlideContent(
  content: PlateNode[],
  slideElement: Element,
): Promise<ExportElement[]> {
  const elements: ExportElement[] = [];

  // 1. First, scan for background rectangle elements (elements with data-bg-export)
  // These are backgrounds of components like box-item, cycle-item, etc.
  const backgroundRects = await scanBackgroundRects(slideElement);
  elements.push(...backgroundRects);

  // Scan for shape elements (native PPT shapes for arrows, etc.)
  const shapeElements = await scanShapeElements(slideElement);
  elements.push(...shapeElements);

  // 2. Scan for ALL decorative elements at the slide level
  // This catches decor elements that are siblings of PlateElements (like bullet markers)
  const decorElements = await scanDecorElements(slideElement);
  elements.push(...decorElements);

  // 2. Then process content nodes (text, tables, images, etc.)
  for (const node of content) {
    const processed = await processNode(node, slideElement);
    if (processed) {
      if (Array.isArray(processed)) {
        elements.push(...processed);
      } else {
        elements.push(processed);
      }
    }
  }
  return elements;
}

/**
 * Scan for all decorative elements (data-decor, standalone SVGs) in the slide
 * Uses parallel processing for better performance
 */
async function scanDecorElements(
  slideElement: Element,
): Promise<ExportElement[]> {
  // Find all elements with data-decor="true" and standalone SVGs
  const allDecorElements = Array.from(
    slideElement.querySelectorAll(
      '[data-decor="true"]:not([data-shape]), svg:not([data-ppt-ignore="true"]):not([data-shape])',
    ),
  );

  // Filter to only top-level decor elements (not nested inside other decor elements)
  // Also filter out SVGs that are inside chart/antv elements (already captured as screenshots)
  const distinctDecorElements = allDecorElements.filter((el) => {
    // Skip if nested inside another decor element
    if (
      allDecorElements.some((parent) => parent !== el && parent.contains(el))
    ) {
      return false;
    }

    // For SVG elements, check if they're inside an element with data-ppt-ignore
    // These are already captured as screenshots (e.g., charts, infographics)
    if (el.tagName.toLowerCase() === "svg") {
      const ignoredContainer = el.closest('[data-ppt-ignore="true"]');
      if (ignoredContainer) {
        return false; // Skip SVGs inside data-ppt-ignore containers
      }
    }

    return true;
  });

  // Process all decor elements in parallel for better performance
  const results = await Promise.all(
    distinctDecorElements.map(async (decorEl) => {
      // preserve aspect ratio for decor elements (width-based) to prevent distortion in PPT
      const position = getElementPositionFromDOM(
        decorEl,
        slideElement,
        true,
        "width",
      );
      const decorType = decorEl.getAttribute("data-decor") || "svg-content";
      return createDecorImage(decorEl, position, decorType);
    }),
  );

  return results.filter((el): el is DecorExportElement => el !== null);
}

/**
 * Scan for background rectangle elements (elements with data-bg-export attribute)
 * These are backgrounds of components like box-item, cycle-item, pros/cons items, etc.
 * We clone the element, remove children, and capture just the empty background.
 */
async function scanBackgroundRects(
  slideElement: Element,
): Promise<ExportElement[]> {
  const elements: ExportElement[] = [];

  // Find all elements with data-bg-export="true"
  const bgExportElements = Array.from(
    slideElement.querySelectorAll('[data-bg-export="true"]'),
  );

  for (const bgEl of bgExportElements) {
    const backgroundRect = createBackgroundRect(
      bgEl as HTMLElement,
      slideElement,
    );
    if (backgroundRect) {
      elements.push(backgroundRect);
    }
  }

  return elements;
}

/**
 * Create a background rectangle element by extracting computed styles.
 * No cloning or image capture needed - just get the styles for PPT shape rendering.
 */
function createBackgroundRect(
  element: HTMLElement,
  slideElement: Element,
): BackgroundRectExportElement | null {
  try {
    // Get position from DOM
    const position = getElementPositionFromDOM(element, slideElement);

    // Get computed styles
    const computedStyle = window.getComputedStyle(element);

    // Get background color (resolved from CSS variables)
    const bgColor = computedStyle.backgroundColor;

    // Get background (for gradients like "linear-gradient(...)")
    const background = computedStyle.background;

    // Extract corner radius as number (in pixels)
    const borderRadiusStr = computedStyle.borderRadius;
    const cornerRadius = parseFloat(borderRadiusStr) || 0;

    // Extract border info
    const borderWidth = parseFloat(computedStyle.borderWidth) || 0;
    const borderColor = computedStyle.borderColor;

    // Skip if no visible background
    if (
      (!bgColor ||
        bgColor === "rgba(0, 0, 0, 0)" ||
        bgColor === "transparent") &&
      (!background || background === "none")
    ) {
      return null;
    }

    return {
      type: "backgroundRect",
      position,
      fillColor: colorToHex(bgColor),
      cornerRadius,
      borderColor: borderWidth > 0 ? colorToHex(borderColor) : undefined,
      borderWidth: borderWidth > 0 ? borderWidth : undefined,
      // Store the full background string for gradient support
      background: background !== "none" ? background : undefined,
    };
  } catch (error) {
    console.error("Failed to create background rect:", error);
    return null;
  }
}

/**
 * Convert color to hex (simple helper)
 */
function colorToHex(color: string): string {
  if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") {
    return "FFFFFF";
  }

  // Already hex
  if (color.startsWith("#")) {
    return color.slice(1).toUpperCase();
  }

  // Use canvas to convert any color format
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "FFFFFF";

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `${toHex(data[0]!)}${toHex(data[1]!)}${toHex(data[2]!)}`.toUpperCase();
}

/**
 * Process a single PlateJS node
 */
async function processNode(
  node: PlateNode,
  slideElement: Element,
): Promise<ExportElement | ExportElement[] | null> {
  const type = node.type || "p";

  // 1. Process Table
  if (type === "table") {
    return processTable(node, slideElement);
  }

  // 2. Process Image
  // Checks for standard PlateJS image types
  if (type === KEYS.img || type === "image") {
    return processImage(node, slideElement);
  }

  // 3. Process MediaEmbed with image provider
  // MediaEmbed elements with provider === 'image' should be exported as images
  if (type === KEYS.mediaEmbed && node.provider === "image") {
    return processMediaEmbedImage(node, slideElement);
  }

  // 4. Process Chart/AntV elements
  // Elements with type starting with 'chart' or 'antv' should be converted to images
  if (type.startsWith("chart") || type.startsWith("antv")) {
    return processChartElement(node, slideElement);
  }

  // 5. Process generic Element (Text, Container, etc.)
  // This handles everything else: paragraphs, headings, blockquotes, lists, etc.
  return processElement(node, slideElement);
}

// ============================================================================
// 1. PROCESS TABLE
// ============================================================================

function processTable(
  node: PlateNode,
  slideElement: Element,
): TableExportElement | null {
  const children = node.children || [];
  const rows: TableRow[] = [];

  // Find the DOM element for the table to measure columns
  const tableDOM = findDOMElement(node, slideElement) as HTMLTableElement;
  // Get table width for ratio calculation
  const tableWidth = tableDOM ? tableDOM.getBoundingClientRect().width : 0;

  for (let r = 0; r < children.length; r++) {
    const rowNode = children[r];
    if (!rowNode || rowNode.type !== KEYS.tr) continue;

    const cells: TableCell[] = [];
    const rowChildren = (rowNode.children as PlateNode[]) || [];

    // Get DOM row if possible
    // const rowDOM = tableDOM
    //   ? (tableDOM.querySelectorAll("tr")[r] as HTMLTableRowElement)
    //   : null;

    for (let c = 0; c < rowChildren.length; c++) {
      const cellNode = rowChildren[c];
      if (!cellNode) continue;

      const isHeader = cellNode.type === KEYS.th;
      // Extract text from cell children

      const text = extractTextFromNodes(cellNode.children as PlateNode[]);

      const cell: TableCell = {
        text: text.trim(),
        isHeader,
        colSpan: (cellNode.colSpan as number) || 1,
        rowSpan: (cellNode.rowSpan as number) || 1,
        backgroundColor: isHeader ? "#f3f4f6" : undefined,
      };

      // Precise Measurement Strategy:
      // Find the specific DOM element for this cell using data-block-id
      const cellDOM = findDOMElement(cellNode, slideElement);

      if (cellDOM && tableWidth > 0) {
        const tableRect = tableDOM.getBoundingClientRect();
        const cellRect = cellDOM.getBoundingClientRect();

        // Calculate relative position and size in pixels (source dimensions)
        // We will scale these in the converter
        cell.box = {
          x: cellRect.left - tableRect.left,
          y: cellRect.top - tableRect.top,
          width: cellRect.width,
          height: cellRect.height,
        };
      }

      cells.push(cell);
    }

    if (cells.length > 0) {
      rows.push({ cells });
    }
  }

  if (rows.length === 0) return null;

  // IMPORTANT: Get position using data-block-id
  const position = findElementPosition(node, slideElement);

  return {
    type: "table",
    rows,
    position,
    headerRowCount: 1,
  };
}

// ============================================================================
// 2. PROCESS IMAGE
// ============================================================================

async function processImage(
  node: PlateNode,
  slideElement: Element,
): Promise<ImageExportElement | null> {
  const url = node.url as string;
  if (!url) return null;

  // IMPORTANT: Get position using data-block-id
  const position = findElementPosition(node, slideElement);

  return {
    type: "image",
    url: url,
    alt: (node.caption as string) || (node.alt as string) || "",
    position,
    sizing: "contain", // Default to contain for clarity
  };
}

// ============================================================================
// 3. PROCESS MEDIA EMBED IMAGE
// ============================================================================

/**
 * Process MediaEmbed elements with provider === 'image'
 * These are image embeds created via the MediaEmbed component
 */
async function processMediaEmbedImage(
  node: PlateNode,
  slideElement: Element,
): Promise<ImageExportElement | null> {
  // MediaEmbed stores the URL directly in the url property
  const url = node.url as string;
  if (!url) return null;

  // IMPORTANT: Get position using data-block-id
  const position = findElementPosition(node, slideElement);

  return {
    type: "image",
    url: url,
    alt: "Embedded image",
    position,
    sizing: "contain",
  };
}

// ============================================================================
// 4. PROCESS CHART/ANTV ELEMENTS
// ============================================================================

/**
 * Process Chart/AntV elements by converting them to images
 * Elements with type starting with 'chart' or 'antv' are rendered using html-to-image
 */
async function processChartElement(
  node: PlateNode,
  slideElement: Element,
): Promise<ImageExportElement | null> {
  // Find the DOM element for this chart
  const domElement = findDOMElement(node, slideElement);
  if (!domElement) {
    console.warn(`Chart element not found in DOM: ${node.id}`);
    return null;
  }

  // Get the position with dimensions intact, preserving aspect ratio by height for charts
  const position = getElementPositionFromDOM(
    domElement,
    slideElement,
    true,
    "height",
  );

  try {
    // Convert the chart element to a PNG data URL
    const dataUrl = await toPng(domElement as HTMLElement, {
      backgroundColor: "transparent",
      // Skip font embedding to avoid CORS errors with Google Fonts
      skipFonts: true,
      quality: 1,
      // Bust cache for reliable rendering
      cacheBust: true,
      // Adaptive quality based on device capability
      pixelRatio: getOptimalPixelRatio(),
    });

    return {
      type: "image",
      url: dataUrl,
      alt: `Chart: ${node.type}`,
      position,
      sizing: "contain",
    };
  } catch (error) {
    console.error(`Failed to convert chart element to image:`, error);
    // Return null on failure - the chart won't be included
    return null;
  }
}

async function processElement(
  node: PlateNode,
  slideElement: Element,
): Promise<ExportElement | ExportElement[] | null> {
  const elements: ExportElement[] = [];

  // 1. Find the DOM element for this node
  const domElement = findDOMElement(node, slideElement);
  if (!domElement) {
    // If no DOM element found for this node, still try to process children recursively
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children as PlateNode[]) {
        if (child.type) {
          const childResult = await processNode(child, slideElement);
          if (childResult) {
            if (Array.isArray(childResult)) {
              elements.push(...childResult);
            } else {
              elements.push(childResult);
            }
          }
        }
      }
    }
    return elements.length > 0 ? elements : null;
  }

  // 2. Process text content from this node's leaf nodes
  // NOTE: Decor elements (SVGs, data-decor) are now scanned at the slide level
  // in scanDecorElements() to ensure all are captured regardless of DOM structure
  const textContent = extractTextFromLeafNodes(node);

  // Only add text element if there is actual text at this level
  if (textContent.trim()) {
    const textStyles = extractTextStyles(domElement);
    const textPosition = getElementPositionFromDOM(domElement, slideElement);

    // Increase width by 5% for heading elements to prevent text overflow in PPT
    const type = node.type || "";
    const isHeading = /^h[1-6]$/.test(type);
    if (isHeading) {
      textPosition.width = textPosition.width * 1.1;
    }

    elements.push({
      type: "text",
      textContent: textContent,
      textStyles,
      position: textPosition,
      nodeType: type || "p",
    });
  }

  // 4. Recursively process child nodes that have their own type (block elements)
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children as PlateNode[]) {
      // Only process children that are block-level elements (have a type)
      // Skip leaf text nodes as they're already handled above
      if (child.type && !child.text) {
        const childResult = await processNode(child, slideElement);
        if (childResult) {
          if (Array.isArray(childResult)) {
            elements.push(...childResult);
          } else {
            elements.push(childResult);
          }
        }
      }
    }
  }

  return elements.length > 0 ? elements : null;
}

/**
 * Helper to capture element as image (for decor/svg)
 */
async function createDecorImage(
  element: Element,
  position: ElementPosition,
  decorType: string,
): Promise<DecorExportElement | null> {
  try {
    const htmlElement = element as HTMLElement;
    const computedStyle = window.getComputedStyle(htmlElement);
    const width = htmlElement.offsetWidth;
    const height = htmlElement.offsetHeight;
    const dataUrl = await toPng(htmlElement, {
      backgroundColor: "transparent",
      // Skip font embedding to avoid CORS errors with Google Fonts
      skipFonts: true,
      // Bust cache for reliable rendering
      cacheBust: true,
      // Force dimensions to match rendered size
      width: width,
      height: height,
      // Apply computed styles explicitly to ensure CSS variables are resolved
      style: {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        borderColor: computedStyle.borderColor,
        borderWidth: computedStyle.borderWidth,
        borderStyle: computedStyle.borderStyle,
        borderRadius: computedStyle.borderRadius,
        // Ensure flex layouts inside (like centered numbers) are preserved
        display: computedStyle.display,
        alignItems: computedStyle.alignItems,
        justifyContent: computedStyle.justifyContent,
      },
      // Adaptive quality based on device capability
      pixelRatio: getOptimalPixelRatio(),
      quality: 1,
    });

    return {
      type: "decor",
      decorType: decorType,
      base64Data: dataUrl,
      position,
      sizing: "contain",
    };
  } catch (e) {
    console.error("Failed to convert element to image", e);
    // Return null on failure - the element won't be included
    return null;
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Extract plain text from nested nodes (recursive)
 */
function extractTextFromNodes(nodes: PlateNode[]): string {
  let text = "";
  for (const node of nodes) {
    if (node.text) {
      text += node.text;
    }
    if (node.children) {
      text += extractTextFromNodes(node.children as PlateNode[]);
    }
  }
  return text;
}

/**
 * Extract text only from direct leaf children of a node (not recursive into block children)
 * This extracts text nodes at the current block level only
 */
function extractTextFromLeafNodes(node: PlateNode): string {
  let text = "";

  // If the node itself has text, return it
  if (node.text) {
    return node.text as string;
  }

  // Only process immediate children that are text leaves
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children as PlateNode[]) {
      // Only process if it's a text node (has .text property) or inline element
      // Skip block-level children (they have their own type and will be processed recursively)
      if (child.text) {
        text += child.text;
      } else if (!child.type || isInlineType(child.type as string)) {
        // Inline elements - extract text from them
        text += extractTextFromLeafNodes(child);
      }
      // Block-level children with their own type are skipped here
      // They will be processed recursively by processElement
    }
  }

  return text;
}

/**
 * Check if a PlateJS type is inline (not a block element)
 */
function isInlineType(type: string): boolean {
  const inlineTypes = ["a", "link", "mention", "inline-code", "code_line"];
  return inlineTypes.includes(type);
}

/**
 * Find DOM element for a PlateNode
 */
function findDOMElement(
  node: PlateNode,
  slideElement: Element,
): Element | null {
  if (!node.id) return null;
  return slideElement.querySelector(`[data-block-id="${node.id}"]`);
}

/**
 * Find element position and normalize it (0-100%)
 */
function findElementPosition(
  node: PlateNode,
  slideElement: Element,
): ElementPosition {
  const domElement = findDOMElement(node, slideElement);
  if (domElement) {
    return getElementPositionFromDOM(domElement, slideElement);
  }
  return getDefaultPosition();
}

/**
 * Get position of a DOM element relative to slide (Percentage)
 * @param preserveAspectRatio - If true, includes aspect ratio for PPT shape preservation
 * @param aspectRatioBase - Which dimension to preserve: 'width' recalculates height, 'height' recalculates width
 */
function getElementPositionFromDOM(
  element: Element,
  slideElement: Element,
  preserveAspectRatio = false,
  aspectRatioBase: "width" | "height" = "width",
): ElementPosition {
  const slideRect = slideElement.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return getRelativePercentRect({
    child: elementRect,
    parent: slideRect,
    preserveAspectRatio,
    aspectRatioBase,
  });
}

/**
 * Calculates normalized percentage positions
 * @param preserveAspectRatio - If true, includes the original pixel aspect ratio for shape preservation
 * @param aspectRatioBase - Which dimension to preserve: 'width' recalculates height, 'height' recalculates width
 */
function getRelativePercentRect({
  child,
  parent,
  preserveAspectRatio = false,
  aspectRatioBase = "width",
}: {
  child: DOMRect;
  parent: DOMRect;
  preserveAspectRatio?: boolean;
  aspectRatioBase?: "width" | "height";
}): ElementPosition {
  return {
    x: ((child.left - parent.left) / parent.width) * 100,
    y: ((child.top - parent.top) / parent.height) * 100,
    width: (child.width / parent.width) * 100,
    height: (child.height / parent.height) * 100,
    // Original pixel aspect ratio for elements that need it preserved in PPT
    aspectRatio:
      preserveAspectRatio && child.height > 0
        ? child.width / child.height
        : undefined,
    aspectRatioBase: preserveAspectRatio ? aspectRatioBase : undefined,
  };
}

function getDefaultPosition(): ElementPosition {
  return { x: 5, y: 5, width: 90, height: 90 };
}

/**
 * Scan for native shape elements (data-shape attribute)
 * These are elements like arrows that should be exported as native PPT shapes
 * instead of images to prevent quality/overflow issues
 */
async function scanShapeElements(
  slideElement: Element,
): Promise<ExportElement[]> {
  const elements: ExportElement[] = [];

  // Find all elements with data-shape
  const shapeElements = Array.from(
    slideElement.querySelectorAll("[data-shape]"),
  );

  for (const shapeEl of shapeElements) {
    const shapeElement = createShapeElement(
      shapeEl as HTMLElement,
      slideElement,
    );
    if (shapeElement) {
      elements.push(shapeElement);
    }
  }

  return elements;
}

function createShapeElement(
  element: HTMLElement,
  slideElement: Element,
): ShapeExportElement | null {
  try {
    const shapeType = element.getAttribute("data-shape") as
      | "arrow"
      | "pill"
      | "parallelogram";
    const orientation =
      (element.getAttribute("data-orientation") as "horizontal" | "vertical") ||
      "horizontal";

    let fillColor = element.getAttribute("data-fill-color") ?? "#ffffff";

    // Resolve CSS variables if present
    if (fillColor.includes("var(")) {
      const prevColor = element.style.color;
      element.style.color = fillColor;
      fillColor = window.getComputedStyle(element).color;
      element.style.color = prevColor;
    }

    const position = getElementPositionFromDOM(element, slideElement);

    const parentBlock = element.closest(".slate-blockWrapper");
    if (parentBlock) {
      const parentRect = parentBlock.getBoundingClientRect();
      const slideRect = slideElement.getBoundingClientRect();

      // Take 95% of the parent height to leave some breathing room
      const targetSize = parentRect.height * 0.95;

      if (orientation === "vertical") {
        position.height = (targetSize / slideRect.height) * 100;
      } else {
        position.width = (targetSize / slideRect.width) * 100;
      }
    }

    return {
      type: "shape",
      shapeType,
      orientation,
      fillColor: colorToHex(fillColor),
      position,
    };
  } catch (error) {
    console.error("Failed to create shape element:", error);
    return null;
  }
}
