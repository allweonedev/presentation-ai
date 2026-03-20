import {
  type BackgroundGradient,
  type GradientStop,
  type JsonGradient,
  type LinearPreset,
} from "./types";

export function buildStopsCss(stops: GradientStop[]) {
  return [...stops]
    .sort((a, b) => a.position - b.position)
    .map(
      (s) =>
        `${s.color} ${Math.round(Math.max(0, Math.min(100, s.position)))}%`,
    )
    .join(", ");
}

export function toLinearCss(g: Pick<BackgroundGradient, "angle" | "stops">) {
  const angle = Math.round(g.angle ?? 135);
  return `linear-gradient(${angle}deg, ${buildStopsCss(g.stops ?? [])})`;
}

export async function loadGradients(): Promise<JsonGradient[]> {
  try {
    const mod =
      await import("@/components/presentation/edit-panel/sections/gradient.json");
    const data = (mod?.default ?? []) as unknown;
    const list = Array.isArray(data) ? (data as JsonGradient[]) : [];
    return list.filter(
      (g) =>
        g &&
        Array.isArray(g.colors) &&
        g.colors.some((c) => typeof c === "string" && c.trim().length > 0),
    );
  } catch {
    return [];
  }
}

export function normalizeColors(colors: unknown): string[] {
  return colors as string[];
}

export function toLinearFromJson(
  colors: string[],
  angle: number,
): LinearPreset {
  const safe = normalizeColors(colors);
  const stops: GradientStop[] = safe.map((c, idx) => ({
    id: `j-${idx}`,
    color: c,
    position: Math.round((idx / (safe.length - 1)) * 100),
  }));
  const gradient = { angle, stops };
  return { css: toLinearCss(gradient), gradient };
}
