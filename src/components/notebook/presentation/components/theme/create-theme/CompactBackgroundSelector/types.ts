import { type ThemeBackground } from "@/lib/presentation/themes";

export type BackgroundType = "none" | "solid" | "gradient" | "image";
export type ImageMode = "upload-url" | "ai" | "search";

export interface CompactBackgroundSelectorProps {
  value?: ThemeBackground | null;
  onChange?: (value: ThemeBackground | undefined | null) => void;
}

export type GradientStop = { id: string; color: string; position: number };
export type BackgroundGradient = {
  type: "linear" | "radial";
  angle?: number;
  shape?: "circle" | "ellipse";
  at?: { x: number; y: number };
  stops: GradientStop[];
};

export type LinearPreset = {
  css: string;
  gradient: Pick<BackgroundGradient, "angle" | "stops">;
};

export type JsonGradient = { name: string; colors: string[] };
