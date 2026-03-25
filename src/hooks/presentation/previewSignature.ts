"use client";

// A small helper used to build a stable signature of a slide for memoization.
// Lives in hooks/presentation per request to centralize extra functions.
export function previewSignature(slide: unknown): string {
  try {
    const s = slide as {
      id?: string;
      content?: unknown;
      alignment?: unknown;
      layoutType?: unknown;
      width?: unknown;
      rootImage?: unknown;
      bgColor?: unknown;
      formatCategory?: unknown;
      aspectRatio?: unknown;
    };
    return JSON.stringify({
      id: s?.id,
      content: s?.content,
      alignment: s?.alignment,
      layoutType: s?.layoutType,
      width: s?.width,
      rootImage: s?.rootImage,
      bgColor: s?.bgColor,
      formatCategory: s?.formatCategory,
      aspectRatio: s?.aspectRatio,
    });
  } catch {
    return "";
  }
}
