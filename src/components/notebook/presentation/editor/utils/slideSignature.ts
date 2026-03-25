import { type PlateSlide } from "../../utils/parser";

export function slideSignature(slide?: PlateSlide): string {
  try {
    return JSON.stringify({
      id: slide?.id,
      content: slide?.content,
      alignment: slide?.alignment,
      layoutType: slide?.layoutType,
      width: slide?.width,
      rootImage: slide?.rootImage,
      bgColor: slide?.bgColor,
      fontSize: slide?.fontSize,
      fontFamily: slide?.fontFamily,
      formatCategory: slide?.formatCategory ?? "presentation",
      aspectRatio: slide?.aspectRatio,
    });
  } catch {
    return String(slide?.id ?? "");
  }
}
