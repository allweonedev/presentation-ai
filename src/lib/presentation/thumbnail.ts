import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getValidUrl(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function getRootImageThumbnailUrl(slide: PlateSlide): string | null {
  if (slide.rootImage?.embedType && slide.rootImage.embedType !== "image") {
    return null;
  }

  return getValidUrl(slide.rootImage?.url);
}

function findFirstInlineImageUrl(nodes: unknown[]): string | null {
  for (const node of nodes) {
    if (!isRecord(node)) {
      continue;
    }

    if (node.type === "img") {
      const imageUrl = getValidUrl(node.url);

      if (imageUrl) {
        return imageUrl;
      }
    }

    const children = node.children;

    if (Array.isArray(children)) {
      const childImageUrl = findFirstInlineImageUrl(children);

      if (childImageUrl) {
        return childImageUrl;
      }
    }
  }

  return null;
}

export function getPresentationThumbnailUrl(
  slides: readonly PlateSlide[],
): string | null {
  for (const slide of slides) {
    const rootImageUrl = getRootImageThumbnailUrl(slide);

    if (rootImageUrl) {
      return rootImageUrl;
    }
  }

  for (const slide of slides) {
    const inlineImageUrl = findFirstInlineImageUrl(slide.content);

    if (inlineImageUrl) {
      return inlineImageUrl;
    }
  }

  return null;
}

export function getPresentationSlidesFromContent(content: unknown): PlateSlide[] {
  if (!isRecord(content)) {
    return [];
  }

  const slides = content.slides;

  if (!Array.isArray(slides)) {
    return [];
  }

  return slides.filter(
    (slide): slide is PlateSlide =>
      isRecord(slide) &&
      typeof slide.id === "string" &&
      Array.isArray(slide.content),
  );
}
