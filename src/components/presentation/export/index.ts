/**
 * Presentation Export Module
 * DOM-based PPTX export that scans rendered slides
 */

export {
  colorToHex,
  extractBorderStyles,
  extractPresentationStyles,
  extractTextStyles,
  resolveColor,
  resolveCssVariable,
  resolveValue,
} from "./cssVariableResolver";
export { scanAllSlides, scanRootImage, scanSlide } from "./domSlideScanner";
export {
  convertToPptx,
  downloadBlob,
  exportPresentationToPptx,
} from "./domToPptxConverter";
export {
  DEFAULT_SLIDE_HEIGHT_INCHES,
  DEFAULT_SLIDE_WIDTH_INCHES,
  PIXELS_PER_INCH,
} from "./types";
export type {
  BorderStyles,
  DecorExportElement,
  ElementPosition,
  ExportElement,
  PlateImageElement,
  PresentationStyles,
  RootImageData,
  ScanResult,
  SlideExportData,
  TextExportElement,
  TextStyles,
} from "./types";
