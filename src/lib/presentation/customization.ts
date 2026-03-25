import {
  type ThemeBackground,
  type ThemeProperties,
} from "@/lib/presentation/themes";

export type PresentationCustomization = {
  themeData?: ThemeProperties | null;
  pageStyle?: string | null;
  presentationStyle?: string | null;
  textContent?: "minimal" | "concise" | "detailed" | "extensive";
  tone?:
    | "auto"
    | "general"
    | "persuasive"
    | "inspiring"
    | "instructive"
    | "engaging";
  audience?:
    | "auto"
    | "general"
    | "business"
    | "investor"
    | "teacher"
    | "student";
  scenario?:
    | "auto"
    | "general"
    | "analysis-report"
    | "teaching-training"
    | "promotional-materials"
    | "public-speeches";
  pageBackground?: {
    override?: string | null;
    type?: ThemeBackground["type"];
    gradient?: ThemeBackground["gradient"];
    imageUrl?: string | null;
  };
};

export type PresentationCustomizationState = {
  customThemeData: ThemeProperties | null;
  pageStyle: string;
  presentationStyle: string;
  textContent: "minimal" | "concise" | "detailed" | "extensive";
  tone:
    | "auto"
    | "general"
    | "persuasive"
    | "inspiring"
    | "instructive"
    | "engaging";
  audience:
    | "auto"
    | "general"
    | "business"
    | "investor"
    | "teacher"
    | "student";
  scenario:
    | "auto"
    | "general"
    | "analysis-report"
    | "teaching-training"
    | "promotional-materials"
    | "public-speeches";
  pageBackground: Record<string, unknown>;
};

export function getPresentationCustomization(
  value: unknown,
): PresentationCustomization | null {
  if (!value || typeof value !== "object") return null;
  return value as PresentationCustomization;
}

export function buildPresentationCustomization(
  state: PresentationCustomizationState,
): PresentationCustomization {
  const customization: PresentationCustomization = {
    themeData: state.customThemeData ?? undefined,
    pageStyle: state.pageStyle ?? undefined,
    presentationStyle: state.presentationStyle ?? undefined,
    textContent: state.textContent,
    tone: state.tone,
    audience: state.audience,
    scenario: state.scenario,
  };

  const pageBackground = extractPageBackgroundFromConfig(state.pageBackground);
  if (pageBackground) {
    customization.pageBackground = pageBackground;
  }

  return customization;
}

export function extractPageBackgroundFromConfig(
  config: Record<string, unknown>,
): PresentationCustomization["pageBackground"] | null {
  if (!config) return null;

  const override =
    typeof config.backgroundOverride === "string"
      ? (config.backgroundOverride as string)
      : null;
  const type =
    typeof config.backgroundType === "string"
      ? (config.backgroundType as ThemeBackground["type"])
      : undefined;
  const gradient = config.backgroundGradient as ThemeBackground["gradient"];
  const imageUrl =
    typeof config.backgroundImageUrl === "string"
      ? (config.backgroundImageUrl as string)
      : null;

  if (!override && !type && !gradient && !imageUrl) return null;

  return {
    override: override ?? undefined,
    type,
    gradient,
    imageUrl: imageUrl ?? undefined,
  };
}

export function applyPageBackgroundToConfig(
  pageBackground:
    | PresentationCustomization["pageBackground"]
    | null
    | undefined,
  config: Record<string, unknown>,
): Record<string, unknown> {
  if (!pageBackground) return config;

  const next = { ...(config ?? {}) };

  delete next.backgroundOverride;
  delete next.backgroundType;
  delete next.backgroundGradient;
  delete next.backgroundImageUrl;

  if (pageBackground.type) next.backgroundType = pageBackground.type;
  if (pageBackground.override)
    next.backgroundOverride = pageBackground.override;
  if (pageBackground.gradient)
    next.backgroundGradient = pageBackground.gradient;
  if (pageBackground.imageUrl)
    next.backgroundImageUrl = pageBackground.imageUrl;

  return next;
}
