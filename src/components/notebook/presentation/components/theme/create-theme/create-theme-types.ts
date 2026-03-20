"use client";

import {
  themes as builtinThemes,
  type ThemeColors,
  type ThemeProperties,
  type Themes,
} from "@/lib/presentation/themes";

import { type ColorKey, type ThemeFormValues } from "../types";

export type CreateThemeStep = "colors" | "fonts" | "design" | "save";

export type DesignStyle =
  | "standard"
  | "flat"
  | "outline"
  | "sharp"
  | "blocky"
  | "glass"
  | "rounded"
  | "soft-cloud"
  | "capsule";

export type PreviewTab = "test" | "current";

// ColorTheme extends the core theme form structure with flat types
export type ColorTheme = {
  id: Themes;
} & ThemeProperties;

const fallbackColors: ThemeColors = {
  primary: "#3B82F6",
  accent: "#60A5FA",
  background: "#FFFFFF",
  text: "#1F2937",
  heading: "#111827",
  smartLayout: "#3B82F6",
  cardBackground: "#FFFFFF",
};

const fallbackFonts: ThemeFormValues["fonts"] = {
  heading: "Inter, sans-serif",
  body: "Inter, sans-serif",
};

const fallbackShadows: ThemeFormValues["shadows"] = {
  card: "0 1px 3px rgba(0,0,0,0.05)",
  button: "0 1px 2px rgba(0,0,0,0.03)",
  slide: "",
};

const fallbackTransitions: ThemeFormValues["transitions"] = {
  default: "all 0.2s ease-in-out",
};
const fallbackBorderRaidus: ThemeFormValues["borderRadius"] = {
  card: "0rem",
  slide: "0rem",
  button: "0rem",
};

const fromTheme = (id: Themes, theme: ThemeProperties): ColorTheme => ({
  id,
  name: theme.name,
  description: theme.description,
  mode: theme.mode,
  colors: { ...theme.colors },
  fonts: { ...theme.fonts },
  borderRadius: theme.borderRadius,
  transitions: { ...theme.transitions },
  shadows: { ...theme.shadows },
  background: theme.background ? { ...theme.background } : undefined,
});

const derivedThemes = Object.entries(builtinThemes).map(([key, value]) =>
  fromTheme(key as Themes, value),
);

export const colorThemes: ColorTheme[] =
  derivedThemes.length > 0
    ? derivedThemes
    : [
        {
          id: "mystique",
          name: "Mystique",
          description: "Default theme",
          colors: fallbackColors,
          fonts: fallbackFonts,
          borderRadius: fallbackBorderRaidus,
          transitions: fallbackTransitions,
          shadows: fallbackShadows,
          mode: "light",
        },
      ];

export const COLOR_LABELS: Record<ColorKey, string> = {
  primary: "Primary Color",
  accent: "Accent Color",
  background: "Slide Color",
  text: "Text Color",
  heading: "Heading Color",
  smartLayout: "Smart layouts",
  cardBackground: "Card Background",
};
