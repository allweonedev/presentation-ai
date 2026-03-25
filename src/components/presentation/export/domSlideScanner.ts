/**
 * DOM Slide Scanner
 * Scans rendered slide DOM to extract element positions, SVGs, and styles
 */

import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import { usePresentationState } from "@/states/presentation-state";
import { toPng } from "html-to-image";
import { walkSlideContent } from "./contentWalker";
import { extractPresentationStyles } from "./cssVariableResolver";
import {
  type ElementPosition,
  type RootImageData,
  type ScanResult,
} from "./types";
import { getOptimalPixelRatio } from "./utils";

/**
 * Scan a slide's DOM and extract all exportable elements
 * @param slide - The slide to scan
 * @returns ScanResult with all elements and their positions
 */
export async function scanSlide(slide: PlateSlide): Promise<ScanResult | null> {
  const slideId = slide.id;
  // Find the slide container
  const slideElement = document.querySelector(`#presentation-root-${slideId}`);
  if (!slideElement) {
    console.warn(`Slide container not found for slide: ${slideId}`);
    return null;
  }

  // Get slide dimensions
  const slideRect = slideElement.getBoundingClientRect();

  const styles = extractPresentationStyles(slideElement);
  let backgroundImageUrl: string | undefined;
  // Only use background image if the layout supports it
  if (slide.layoutType === "background") {
    backgroundImageUrl = styles.backgroundImageUrl;
  }

  // Scan for root image
  const rootImage = await scanRootImageFromSlide(slideElement, slideId);

  // Scan for exportable elements using PlateJS content walker
  // This uses the slide content JSON to identify elements, but DOM for positions
  const elements = await walkSlideContent(slide.content, slideElement);

  return {
    slideId,
    width: slideRect.width,
    height: slideRect.height,
    elements,
    styles,
    rootImage,
    backgroundImageUrl,
  };
}

/**
 * Get position relative to slide container (as percentage 0-100)
 */
function getRelativePosition(
  element: Element,
  slideRect: DOMRect,
): ElementPosition {
  const rect = element.getBoundingClientRect();
  return {
    x: ((rect.left - slideRect.left) / slideRect.width) * 100,
    y: ((rect.top - slideRect.top) / slideRect.height) * 100,
    width: (rect.width / slideRect.width) * 100,
    height: (rect.height / slideRect.height) * 100,
  };
}

/**
 * Scan root image from the slide element
 */
async function scanRootImageFromSlide(
  slideElement: Element,
  slideId: string,
): Promise<RootImageData | undefined> {
  const { slides } = usePresentationState.getState();
  const slide = slides.find((s) => s.id === slideId);

  if (!slide || !slide.rootImage) return undefined;

  const slideRect = slideElement.getBoundingClientRect();

  // Look for root image container with data-root-image attribute
  // In root-image.tsx, this is on the Resizable component which has the correct dimensions
  // In root-image-static.tsx, this is on a nested div, but the parent has the sizing
  const rootImageContainer = slideElement.querySelector(
    `[data-root-image="${slideId}"]`,
  );

  if (!rootImageContainer) return undefined;

  // Determine the correct container to measure for position
  // The data-root-image element could be:
  // 1. The Resizable component itself (in root-image.tsx) - has class "shrink-0"
  // 2. A nested div inside a sized parent (in root-image-static.tsx)
  let imageContainer: Element = rootImageContainer;

  // If the element itself has shrink-0, it's the Resizable and we use it directly
  // Otherwise, check if the parent has the sizing (for static version)
  if (!rootImageContainer.classList.contains("shrink-0")) {
    const parent = rootImageContainer.parentElement;
    if (parent?.classList.contains("shrink-0")) {
      imageContainer = parent;
    }
  }

  const position = getRelativePosition(imageContainer, slideRect);

  // Try to find the original image URL
  const imgElement = imageContainer.querySelector("img");
  const originalUrl = imgElement?.src || undefined;

  // Always capture root image container as PNG
  // This preserves exact CSS rendering (object-fit, object-position, cropping)
  // instead of trying to replicate it with pptxgenjs sizing properties
  try {
    const base64Data = await toPng(rootImageContainer as HTMLElement, {
      backgroundColor: "transparent",
      quality: 1,
      pixelRatio: getOptimalPixelRatio(),
      skipFonts: true,
    });
    return {
      url: base64Data,
      position,
      isBase64: true, // Flag to indicate this is already a captured image
      originalUrl,
    };
  } catch (error) {
    console.warn("Failed to capture root image element", error);
    return undefined;
  }
}

/**
 * Find the root image element in a slide and get its position (public export)
 */
export async function scanRootImage(
  slideId: string,
): Promise<RootImageData | null> {
  const slideContainer = document.querySelector(`.slide-container-${slideId}`);
  if (!slideContainer) return null;

  const slideElement = slideContainer.firstElementChild;
  if (!slideElement) return null;

  return (await scanRootImageFromSlide(slideElement, slideId)) ?? null;
}

/**
 * Scan all slides in the presentation
 * Uses parallel processing for better performance
 */
export async function scanAllSlides(
  slides: PlateSlide[],
  onProgress?: (completed: number, total: number) => void,
): Promise<ScanResult[]> {
  const total = slides.length;
  let completed = 0;

  const results = await Promise.all(
    slides.map(async (slide) => {
      const result = await scanSlide(slide);
      completed++;
      onProgress?.(completed, total);
      return result;
    }),
  );

  return results.filter((r): r is ScanResult => r !== null);
}
