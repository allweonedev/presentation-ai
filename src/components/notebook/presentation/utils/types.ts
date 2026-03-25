import { type TElement, type TText } from "platejs";

export interface GeneratingText extends TText {
  text: string;
  generating?: boolean;
}

// Shared image crop settings used across presentation components
export interface ImageCropSettings {
  objectFit: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition: { x: number; y: number };
  // Zoom level for pan/zoom cropping. Defaults to 1 when omitted.
  zoom?: number;
}

// Plate element types
export type ParagraphElement = TElement & { type: "p" };
export type HeadingElement = TElement & {
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};
export type ImageElement = TElement & {
  type: "img";
  url: string;
  query: string;
};

export type TChartElement = TElement & {
  type: "chart";
  chartType: "horizontal-bar" | "vertical-bar" | "pie" | "line";
  data: Array<{ label: string; value: number }>;
};
