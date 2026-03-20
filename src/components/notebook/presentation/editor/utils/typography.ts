export type PresentationFontSize = "S" | "M" | "L" | undefined;

// Returns CSS variables for heading/paragraph sizes based on slide font size.
// Current values reflect the previous M defaults and act as fallback when size is undefined.
export function getTypographyCSSVariables(size: PresentationFontSize) {
  // M defaults match previous static values
  const baseM = {
    h1: 3,
    h2: 1.875,
    h3: 1.5,
    h4: 1.25,
    h5: 1.125,
    h6: 1,
    p: 1,
  } as const;

  // Scale factors derived from container base font px: S=12, M=16, L=18
  // Relative to M: S = 12/16 = 0.75, L = 18/16 = 1.125
  const factor = size === "S" ? 0.75 : size === "L" ? 1.125 : 1;

  const scaled = {
    h1: `${round(baseM.h1 * factor)}em`,
    h2: `${round(baseM.h2 * factor)}em`,
    h3: `${round(baseM.h3 * factor)}em`,
    h4: `${round(baseM.h4 * factor)}em`,
    h5: `${round(baseM.h5 * factor)}em`,
    h6: `${round(baseM.h6 * factor)}em`,
    p: `${round(baseM.p * factor)}em`,
  } as const;

  return {
    "--presentation-h1-size": scaled.h1,
    "--presentation-h2-size": scaled.h2,
    "--presentation-h3-size": scaled.h3,
    "--presentation-h4-size": scaled.h4,
    "--presentation-h5-size": scaled.h5,
    "--presentation-h6-size": scaled.h6,
    "--presentation-p-size": scaled.p,
  } as Record<string, string>;
}

function round(value: number): string {
  // Keep up to 3 decimals to avoid noisy values like 2.109375
  return Number(Math.round((value + Number.EPSILON) * 1000) / 1000).toString();
}
