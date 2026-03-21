import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import {
  BASE_WIDTHS,
  FORMAT_CATEGORY_WIDTHS,
  SOCIAL_ASPECT_WIDTHS,
  TALL_FORMAT,
  getPresetAspectRatio,
} from "@/config/slideFormats";

/**
 * Export baseWidths for backward compatibility.
 * This is a flattened export of the config values.
 */
export const baseWidths = {
  S: BASE_WIDTHS.S,
  M: BASE_WIDTHS.M,
  L: BASE_WIDTHS.L,
  social: SOCIAL_ASPECT_WIDTHS.default,
  document: FORMAT_CATEGORY_WIDTHS.document,
  webpage: FORMAT_CATEGORY_WIDTHS.webpage,
  presentation: FORMAT_CATEGORY_WIDTHS.presentation,
  default: FORMAT_CATEGORY_WIDTHS.default,
};

/**
 * Resolve aspect ratio configuration to pixel values.
 */
export function resolveAspectRatio(
  width: number,
  aspectRatio: PlateSlide["aspectRatio"],
):
  | {
      widthToHeight: number;
      heightToWidth: number;
      heightPx: number;
    }
  | undefined {
  if (!aspectRatio) return undefined;

  if (aspectRatio.type === "ratio" && aspectRatio.value) {
    const [w = 0, h = 0] = aspectRatio.value.split(":").map(Number);
    if (w > 0 && h > 0) {
      return {
        widthToHeight: w / h,
        heightToWidth: h / w,
        heightPx: width * (h / w),
      };
    }
  }

  if (aspectRatio.type === "preset" && aspectRatio.value) {
    const heightToWidth = getPresetAspectRatio(aspectRatio.value);
    return {
      widthToHeight: 1 / heightToWidth,
      heightToWidth,
      heightPx: width * heightToWidth,
    };
  }

  if (aspectRatio.type === "tall") {
    const heightPx = TALL_FORMAT.minHeightPx;
    return {
      widthToHeight: width / heightPx,
      heightToWidth: heightPx / width,
      heightPx,
    };
  }

  return undefined;
}

/**
 * Interface for slide scaling configuration.
 */
export interface SlideScalingConfig {
  scale: number;
  slideWidth: number;
  fontSize: number;
  scaledHeight?: number;
  contentHeight: number;
  contentRef: React.RefObject<HTMLDivElement | null>;
  minHeight?: number;
  presentFitScale: number;
  isScaleLocked?: boolean;
}
