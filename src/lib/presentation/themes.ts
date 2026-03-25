export type ThemeMode = "light" | "dark";

export type ThemeName =
  | "daktilo"
  | "noir"
  | "cornflower"
  | "indigo"
  | "orbit"
  | "cosmos"
  | "piano"
  | "ebony"
  | "mystique"
  | "phantom"
  | "allweoneLight"
  | "allweoneDark"
  | "crimson"
  | "ember"
  | "sunset"
  | "dusk"
  | "forest"
  | "canopy"
  | "aurora"
  | "borealis"
  | "sakura"
  | "midnight"
  | "ocean"
  | "abyss"
  | "sand"
  | "obsidian"
  | "mint"
  | "jade"
  | "rose"
  | "wine"
  | "arctic"
  | "glacier"
  | "honey"
  | "amber"
  | "coral"
  | "magma"
  | "lavender"
  | "velvet";

export interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  text: string;
  heading: string;
  smartLayout: string;
  cardBackground: string;
}

export type ThemeColorsKeys = keyof ThemeColors;

interface ThemeFonts {
  heading: string;
  body: string;
  headingWeight?: number;
  bodyWeight?: number;
  headingUrl?: string;
  bodyUrl?: string;
}

interface ThemeTransitions {
  default: string;
}

interface ThemeShadows {
  card: string;
  button: string;
  slide: string;
}

interface ThemeBorderRadius {
  card: string;
  slide: string;
  button: string;
}

interface ThemeMask {
  clipPath?: string;
  maskImage?: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;
}

export interface ThemeBackground {
  type?: "solid" | "linear" | "radial" | "image";
  override?: string;
  gradient?: {
    type: "linear" | "radial";
    angle?: number;
    shape?: "circle" | "ellipse";
    at?: { x: number; y: number };
    stops?: Array<{ id: string; color: string; position: number }>;
  };
  imageUrl?: string;
}

export interface ThemeProperties {
  name: string;
  description: string;
  mode: ThemeMode;
  colors: ThemeColors;
  fonts: ThemeFonts;
  borderRadius: ThemeBorderRadius;
  transitions: ThemeTransitions;
  shadows: ThemeShadows;
  mask?: ThemeMask;
  background?: ThemeBackground;
}

export type Themes = keyof typeof themes;

// ============ Helper Functions ============

export function isLightTheme(theme: ThemeProperties): boolean {
  return theme.mode === "light";
}

export function isDarkTheme(theme: ThemeProperties): boolean {
  return theme.mode === "dark";
}

export function getThemesByMode(mode: ThemeMode): ThemeProperties[] {
  return Object.values(themes).filter((t) => t.mode === mode);
}

// ============ Themes ============

/**
 * Button border-radius scale:
 * - For all values previously 0.5rem → now 0.17rem (scaled by ~1/3)
 * - For all values previously 0.75rem → now 0.25rem (scaled by ~1/3)
 * - For all values previously 0.625rem → now 0.21rem (scaled by ~1/3)
 * - For all values previously 1rem → now 0.33rem (scaled by ~1/3)
 * - For all values previously 0.375rem → now 0.13rem (scaled by ~1/3)
 * - For all values previously 0.25rem → now 0.08rem (scaled by ~1/3)
 * - For all values previously 1.25rem → now 0.42rem (scaled by ~1/3)
 * - 0, 9999px and 9999px remain unchanged.
 */

export const themes: { [key in ThemeName]: ThemeProperties } = {
  // ==================== DAKTILO / NOIR ====================
  daktilo: {
    name: "Daktilo",
    description: "Modern and clean",
    mode: "light",
    colors: {
      primary: "#3B82F6",
      accent: "#60A5FA",
      background: "#FFFFFF",
      text: "#1F2937",
      heading: "#3B82F6",
      smartLayout: "#3B82F6",
      cardBackground: "#F3F4F6",
    },
    fonts: { heading: "Inter", body: "Inter" },
    borderRadius: {
      card: "0.75rem",
      slide: "1rem",
      button: "0.17rem",
    },
    transitions: { default: "all 0.2s ease-in-out" },
    shadows: {
      card: "0 1px 2px rgba(0,0,0,0.04), 0 4px 8px rgba(59,130,246,0.08)",
      button:
        "0 1px 3px rgba(59,130,246,0.12), 0 2px 6px rgba(59,130,246,0.08)",
      slide: "0 4px 6px rgba(0,0,0,0.02), 0 12px 24px rgba(59,130,246,0.1)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #3B82F615 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #60A5FA15 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #1F293710 0%, transparent 50%),
        #FFFFFF
      `,
    },
  },

  noir: {
    name: "Noir",
    description: "Sleek film noir aesthetic",
    mode: "dark",
    colors: {
      primary: "#60A5FA",
      accent: "#93C5FD",
      background: "#111827",
      text: "#E5E7EB",
      heading: "#60A5FA",
      smartLayout: "#60A5FA",
      cardBackground: "#1F2937",
    },
    fonts: { heading: "Inter", body: "Inter" },
    borderRadius: {
      card: "0.75rem",
      slide: "1rem",
      button: "0.17rem",
    },
    transitions: { default: "all 0.2s ease-in-out" },
    shadows: {
      card: "0 2px 4px rgba(0,0,0,0.3), 0 8px 16px rgba(96,165,250,0.1)",
      button: "0 2px 8px rgba(96,165,250,0.25), 0 0 20px rgba(96,165,250,0.1)",
      slide: "0 8px 32px rgba(0,0,0,0.4), 0 0 48px rgba(96,165,250,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #60A5FA20 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #93C5FD20 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #E5E7EB15 0%, transparent 50%),
        #111827
      `,
    },
  },

  // ==================== CORNFLOWER / INDIGO ====================
  cornflower: {
    name: "Cornflower",
    description: "Professional and bold",
    mode: "light",
    colors: {
      primary: "#4F46E5",
      accent: "#818CF8",
      background: "#F8FAFC",
      text: "#334155",
      heading: "#4F46E5",
      smartLayout: "#4F46E5",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Poppins", body: "Source Sans Pro" },
    borderRadius: {
      card: "1rem",
      slide: "1.25rem",
      button: "0.25rem",
    },
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 4px 6px rgba(79,70,229,0.08), 0 10px 20px rgba(79,70,229,0.12)",
      button: "0 4px 14px rgba(79,70,229,0.3)",
      slide: "0 10px 40px rgba(79,70,229,0.15), 0 2px 8px rgba(0,0,0,0.05)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #4F46E515 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #818CF815 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #312E8110 0%, transparent 50%),
        #F8FAFC
      `,
    },
  },

  indigo: {
    name: "Indigo",
    description: "Deep and immersive",
    mode: "dark",
    colors: {
      primary: "#818CF8",
      accent: "#A5B4FC",
      background: "#1E1B4B",
      text: "#E2E8F0",
      heading: "#818CF8",
      smartLayout: "#818CF8",
      cardBackground: "#312E81",
    },
    fonts: { heading: "Poppins", body: "Source Sans Pro" },
    borderRadius: {
      card: "1rem",
      slide: "1.25rem",
      button: "0.25rem",
    },
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 4px 20px rgba(129,140,248,0.2), 0 0 40px rgba(129,140,248,0.1)",
      button:
        "0 4px 16px rgba(129,140,248,0.4), 0 0 24px rgba(129,140,248,0.2)",
      slide: "0 20px 50px rgba(0,0,0,0.5), 0 0 60px rgba(129,140,248,0.15)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #818CF820 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #A5B4FC20 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #C7D2FE15 0%, transparent 50%),
        #1E1B4B
      `,
    },
  },

  // ==================== ORBIT / COSMOS ====================
  orbit: {
    name: "Orbit",
    description: "Futuristic and dynamic",
    mode: "light",
    colors: {
      primary: "#312E81",
      accent: "#3B82F6",
      background: "#FFFFFF",
      text: "#1F2937",
      heading: "#312E81",
      smartLayout: "#312E81",
      cardBackground: "#F3F4F6",
    },
    fonts: { heading: "Space Grotesk", body: "IBM Plex Sans" },
    borderRadius: {
      card: "1.5rem",
      slide: "2rem",
      button: "9999px",
    },
    transitions: { default: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" },
    shadows: {
      card: "0 8px 32px rgba(49,46,129,0.12), 0 2px 8px rgba(59,130,246,0.08)",
      button: "0 4px 20px rgba(49,46,129,0.2), 0 0 40px rgba(59,130,246,0.1)",
      slide: "0 16px 48px rgba(49,46,129,0.16), 0 0 80px rgba(59,130,246,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #312E8115 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #3B82F615 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #4338CA10 0%, transparent 50%),
        #FFFFFF
      `,
    },
  },

  cosmos: {
    name: "Cosmos",
    description: "Deep space exploration",
    mode: "dark",
    colors: {
      primary: "#818CF8",
      accent: "#60A5FA",
      background: "#030712",
      text: "#E5E7EB",
      heading: "#818CF8",
      smartLayout: "#818CF8",
      cardBackground: "#111827",
    },
    fonts: { heading: "Space Grotesk", body: "IBM Plex Sans" },
    borderRadius: {
      card: "1.5rem",
      slide: "2rem",
      button: "9999px",
    },
    transitions: { default: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" },
    shadows: {
      card: "0 0 30px rgba(129,140,248,0.3), 0 8px 32px rgba(0,0,0,0.4)",
      button: "0 0 24px rgba(129,140,248,0.5), 0 0 48px rgba(96,165,250,0.3)",
      slide: "0 0 80px rgba(129,140,248,0.2), 0 24px 64px rgba(0,0,0,0.6)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #818CF820 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #60A5FA20 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #A5B4FC15 0%, transparent 50%),
        #030712
      `,
    },
  },

  // ==================== PIANO / EBONY ====================
  piano: {
    name: "Piano",
    description: "Classic and elegant",
    mode: "light",
    colors: {
      primary: "#1F2937",
      accent: "#4B5563",
      background: "#F3F4F6",
      text: "#374151",
      heading: "#1F2937",
      smartLayout: "#1F2937",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Playfair Display", body: "Lora" },
    borderRadius: {
      card: "0",
      slide: "0",
      button: "0",
    },
    transitions: { default: "all 0.2s ease" },
    shadows: {
      card: "4px 4px 0 0 #1F2937",
      button: "3px 3px 0 0 #1F2937",
      slide: "8px 8px 0 0 #1F2937",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #1F293715 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #4B556315 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #37415110 0%, transparent 50%),
        #F3F4F6
      `,
    },
  },

  ebony: {
    name: "Ebony",
    description: "Refined dark elegance",
    mode: "dark",
    colors: {
      primary: "#E5E7EB",
      accent: "#9CA3AF",
      background: "#111827",
      text: "#E5E7EB",
      heading: "#E5E7EB",
      smartLayout: "#E5E7EB",
      cardBackground: "#1F2937",
    },
    fonts: { heading: "Playfair Display", body: "Lora" },
    borderRadius: {
      card: "0",
      slide: "0",
      button: "0",
    },
    transitions: { default: "all 0.2s ease" },
    shadows: {
      card: "4px 4px 0 0 #E5E7EB",
      button: "3px 3px 0 0 #9CA3AF",
      slide: "8px 8px 0 0 rgba(229,231,235,0.3)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #E5E7EB20 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #9CA3AF20 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #D1D5DB15 0%, transparent 50%),
        #111827
      `,
    },
  },

  // ==================== MYSTIQUE / PHANTOM ====================
  mystique: {
    name: "Mystique",
    description: "Mysterious and sophisticated",
    mode: "light",
    colors: {
      primary: "#7C3AED",
      accent: "#8B5CF6",
      background: "#FFFFFF",
      text: "#1F2937",
      heading: "#7C3AED",
      smartLayout: "#7C3AED",
      cardBackground: "#F5F3FF",
    },
    fonts: { heading: "Montserrat", body: "Raleway" },
    borderRadius: {
      card: "0.5rem",
      slide: "0.75rem",
      button: "9999px",
    },
    transitions: { default: "all 0.3s ease-out" },
    shadows: {
      card: "0 2px 16px rgba(124,58,237,0.12), 0 8px 32px rgba(139,92,246,0.1)",
      button: "0 4px 24px rgba(124,58,237,0.25)",
      slide:
        "0 12px 48px rgba(124,58,237,0.15), 0 0 96px rgba(139,92,246,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #7C3AED15 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #8B5CF615 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #5B21B610 0%, transparent 50%),
        #FFFFFF
      `,
    },
  },

  phantom: {
    name: "Phantom",
    description: "Ethereal and haunting",
    mode: "dark",
    colors: {
      primary: "#A78BFA",
      accent: "#C4B5FD",
      background: "#18181B",
      text: "#D4D4D8",
      heading: "#A78BFA",
      smartLayout: "#A78BFA",
      cardBackground: "#27272A",
    },
    fonts: { heading: "Montserrat", body: "Raleway" },
    borderRadius: {
      card: "0.5rem",
      slide: "0.75rem",
      button: "9999px",
    },
    transitions: { default: "all 0.3s ease-out" },
    shadows: {
      card: "0 0 40px rgba(167,139,250,0.2), 0 8px 24px rgba(0,0,0,0.3)",
      button:
        "0 0 32px rgba(167,139,250,0.4), 0 4px 16px rgba(196,181,253,0.2)",
      slide: "0 0 80px rgba(167,139,250,0.25), 0 16px 48px rgba(0,0,0,0.4)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #A78BFA20 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #C4B5FD20 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #8B5CF615 0%, transparent 50%),
        #18181B
      `,
    },
  },

  // ==================== ALLWEONE ====================
  allweoneLight: {
    name: "Allweone",
    description: "Clean and high contrast",
    mode: "light",
    colors: {
      primary: "#06B6D4",
      accent: "#0EA5E9",
      background: "#FFFFFF",
      text: "#0F172A",
      heading: "#06B6D4",
      smartLayout: "#06B6D4",
      cardBackground: "#ECFEFF",
    },
    fonts: { heading: "JetBrains Mono", body: "Inter" },
    borderRadius: {
      card: "0.25rem",
      slide: "0.375rem",
      button: "0.08rem",
    },
    transitions: { default: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 0 0 1px rgba(6,182,212,0.1), 0 4px 16px rgba(6,182,212,0.12)",
      button: "0 0 20px rgba(6,182,212,0.3), 0 2px 8px rgba(14,165,233,0.2)",
      slide: "0 0 0 1px rgba(6,182,212,0.08), 0 8px 32px rgba(6,182,212,0.15)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #06B6D415 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #0EA5E915 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #0E749010 0%, transparent 50%),
        #FFFFFF
      `,
    },
  },

  allweoneDark: {
    name: "Allweone",
    description: "Cyberpunk glow",
    mode: "dark",
    colors: {
      primary: "#22D3EE",
      accent: "#38BDF8",
      background: "#0F172A",
      text: "#E2E8F0",
      heading: "#22D3EE",
      smartLayout: "#22D3EE",
      cardBackground: "#1E293B",
    },
    fonts: { heading: "JetBrains Mono", body: "Inter" },
    borderRadius: {
      card: "0.25rem",
      slide: "0.375rem",
      button: "0.08rem",
    },
    transitions: { default: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 0 24px rgba(34,211,238,0.3), 0 0 48px rgba(56,189,248,0.15)",
      button:
        "0 0 16px rgba(34,211,238,0.5), 0 0 32px rgba(34,211,238,0.3), inset 0 0 8px rgba(34,211,238,0.1)",
      slide: "0 0 60px rgba(34,211,238,0.25), 0 0 120px rgba(56,189,248,0.15)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #22D3EE20 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #38BDF820 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #67E8F915 0%, transparent 50%),
        #0F172A
      `,
    },
  },

  // ==================== CRIMSON / EMBER ====================
  crimson: {
    name: "Crimson",
    description: "Bold and passionate",
    mode: "light",
    colors: {
      primary: "#DC2626",
      accent: "#F87171",
      background: "#FFFFFF",
      text: "#1F2937",
      heading: "#DC2626",
      smartLayout: "#DC2626",
      cardBackground: "#FEF2F2",
    },
    fonts: { heading: "Merriweather", body: "Source Sans Pro" },
    borderRadius: {
      card: "0.375rem",
      slide: "0.5rem",
      button: "9999px",
    },
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 4px 12px rgba(220,38,38,0.15), 0 2px 4px rgba(220,38,38,0.1)",
      button: "0 6px 20px rgba(220,38,38,0.35)",
      slide: "0 12px 36px rgba(220,38,38,0.18), 0 4px 12px rgba(0,0,0,0.05)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #DC262615 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #F8717115 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #991B1B10 0%, transparent 50%),
        #FFFFFF
      `,
    },
  },

  ember: {
    name: "Ember",
    description: "Smoldering intensity",
    mode: "dark",
    colors: {
      primary: "#F87171",
      accent: "#EF4444",
      background: "#18181B",
      text: "#E5E7EB",
      heading: "#F87171",
      smartLayout: "#F87171",
      cardBackground: "#27272A",
    },
    fonts: { heading: "Merriweather", body: "Source Sans Pro" },
    borderRadius: {
      card: "0.375rem",
      slide: "0.5rem",
      button: "9999px",
    },
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 0 32px rgba(248,113,113,0.25), 0 8px 24px rgba(0,0,0,0.3)",
      button: "0 0 24px rgba(248,113,113,0.5), 0 4px 16px rgba(239,68,68,0.3)",
      slide: "0 0 64px rgba(248,113,113,0.2), 0 16px 48px rgba(0,0,0,0.4)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #F8717120 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #EF444420 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #FCA5A515 0%, transparent 50%),
        #18181B
      `,
    },
  },

  // ==================== SUNSET / DUSK ====================
  sunset: {
    name: "Sunset",
    description: "Warm and inviting",
    mode: "light",
    colors: {
      primary: "#EA580C",
      accent: "#FB923C",
      background: "#FFFBEB",
      text: "#292524",
      heading: "#EA580C",
      smartLayout: "#EA580C",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "DM Serif Display", body: "DM Sans" },
    borderRadius: {
      card: "1.25rem",
      slide: "1.5rem",
      button: "0.25rem",
    },
    transitions: { default: "all 0.25s ease-in-out" },
    shadows: {
      card: "0 4px 16px rgba(234,88,12,0.1), 0 8px 24px rgba(251,146,60,0.08)",
      button: "0 4px 20px rgba(234,88,12,0.3)",
      slide:
        "0 12px 40px rgba(234,88,12,0.12), 0 4px 16px rgba(251,146,60,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #EA580C15 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #FB923C15 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #C2410C10 0%, transparent 50%),
        #FFFBEB
      `,
    },
  },

  dusk: {
    name: "Dusk",
    description: "Twilight tranquility",
    mode: "dark",
    colors: {
      primary: "#FB923C",
      accent: "#F97316",
      background: "#1C1917",
      text: "#E7E5E4",
      heading: "#FB923C",
      smartLayout: "#FB923C",
      cardBackground: "#292524",
    },
    fonts: { heading: "DM Serif Display", body: "DM Sans" },
    borderRadius: {
      card: "1.25rem",
      slide: "1.5rem",
      button: "0.25rem",
    },
    transitions: { default: "all 0.25s ease-in-out" },
    shadows: {
      card: "0 0 40px rgba(251,146,60,0.15), 0 8px 24px rgba(0,0,0,0.25)",
      button: "0 0 28px rgba(251,146,60,0.4), 0 4px 16px rgba(249,115,22,0.25)",
      slide: "0 0 72px rgba(251,146,60,0.18), 0 16px 48px rgba(0,0,0,0.35)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #FB923C20 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #F9731620 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #FDBA7415 0%, transparent 50%),
        #1C1917
      `,
    },
  },

  // ==================== FOREST / CANOPY ====================
  forest: {
    name: "Forest",
    description: "Natural and serene",
    mode: "light",
    colors: {
      primary: "#059669",
      accent: "#34D399",
      background: "#F0FDF4",
      text: "#1F2937",
      heading: "#059669",
      smartLayout: "#059669",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Bitter", body: "Source Sans Pro" },
    borderRadius: {
      card: "0.875rem",
      slide: "1rem",
      button: "0.17rem",
    },
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 2px 8px rgba(5,150,105,0.08), 0 6px 20px rgba(52,211,153,0.1)",
      button: "0 4px 16px rgba(5,150,105,0.2), 0 2px 6px rgba(5,150,105,0.1)",
      slide: "0 8px 32px rgba(5,150,105,0.12), 0 2px 8px rgba(52,211,153,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #05966915 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #34D39915 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #04785710 0%, transparent 50%),
        #F0FDF4
      `,
    },
  },

  canopy: {
    name: "Canopy",
    description: "Deep forest sanctuary",
    mode: "dark",
    colors: {
      primary: "#34D399",
      accent: "#10B981",
      background: "#064E3B",
      text: "#E5E7EB",
      heading: "#34D399",
      smartLayout: "#34D399",
      cardBackground: "#065F46",
    },
    fonts: { heading: "Bitter", body: "Source Sans Pro" },
    borderRadius: {
      card: "0.875rem",
      slide: "1rem",
      button: "0.17rem",
    },
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 0 24px rgba(52,211,153,0.2), 0 8px 24px rgba(0,0,0,0.25)",
      button: "0 0 20px rgba(52,211,153,0.35), 0 4px 12px rgba(16,185,129,0.2)",
      slide: "0 0 48px rgba(52,211,153,0.18), 0 12px 36px rgba(0,0,0,0.3)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #34D39920 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #10B98120 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #6EE7B715 0%, transparent 50%),
        #064E3B
      `,
    },
  },

  // ==================== AURORA / BOREALIS ====================
  aurora: {
    name: "Aurora",
    description: "Northern lights at dawn",
    mode: "light",
    colors: {
      primary: "#06B6D4",
      accent: "#34D399",
      background: "#F0FDFA",
      text: "#134E4A",
      heading: "#0891B2",
      smartLayout: "#06B6D4",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Quicksand", body: "Nunito" },
    borderRadius: {
      card: "2rem",
      slide: "2.5rem",
      button: "9999px",
    },
    transitions: { default: "all 0.3s ease-out" },
    shadows: {
      card: "0 4px 20px rgba(6,182,212,0.12), 0 8px 32px rgba(52,211,153,0.08)",
      button: "0 4px 24px rgba(6,182,212,0.25), 0 0 40px rgba(139,92,246,0.1)",
      slide: "0 12px 48px rgba(6,182,212,0.14), 0 0 80px rgba(52,211,153,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 20% 20%, #06B6D420 0%, transparent 40%),
        radial-gradient(circle at 80% 30%, #8B5CF620 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #34D39915 0%, transparent 50%),
        #F0FDFA
      `,
    },
  },

  borealis: {
    name: "Borealis",
    description: "Northern lights at midnight",
    mode: "dark",
    colors: {
      primary: "#22D3EE",
      accent: "#4ADE80",
      background: "#0C1222",
      text: "#E2E8F0",
      heading: "#67E8F9",
      smartLayout: "#22D3EE",
      cardBackground: "#1E293B",
    },
    fonts: { heading: "Quicksand", body: "Nunito" },
    borderRadius: {
      card: "2rem",
      slide: "2.5rem",
      button: "9999px",
    },
    transitions: { default: "all 0.3s ease-out" },
    shadows: {
      card: "0 0 32px rgba(34,211,238,0.2), 0 0 48px rgba(74,222,128,0.15), 0 0 64px rgba(167,139,250,0.1)",
      button: "0 0 24px rgba(34,211,238,0.4), 0 0 48px rgba(74,222,128,0.25)",
      slide:
        "0 0 80px rgba(34,211,238,0.2), 0 0 120px rgba(74,222,128,0.12), 0 0 160px rgba(167,139,250,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 20% 20%, #22D3EE25 0%, transparent 40%),
        radial-gradient(circle at 80% 30%, #A78BFA25 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #4ADE8020 0%, transparent 50%),
        #0C1222
      `,
    },
  },

  // ==================== SAKURA / MIDNIGHT ====================
  sakura: {
    name: "Sakura",
    description: "Cherry blossom spring",
    mode: "light",
    colors: {
      primary: "#EC4899",
      accent: "#F472B6",
      background: "#FDF2F8",
      text: "#831843",
      heading: "#BE185D",
      smartLayout: "#EC4899",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Cormorant Garamond", body: "Lato" },
    borderRadius: {
      card: "1rem",
      slide: "1.25rem",
      button: "0.21rem",
    },
    transitions: { default: "all 0.25s ease" },
    shadows: {
      card: "0 4px 16px rgba(236,72,153,0.1), 0 8px 32px rgba(244,114,182,0.08)",
      button: "0 4px 20px rgba(236,72,153,0.25)",
      slide:
        "0 8px 40px rgba(236,72,153,0.12), 0 2px 12px rgba(244,114,182,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #EC489920 0%, transparent 35%),
        radial-gradient(circle at 90% 20%, #F472B620 0%, transparent 40%),
        radial-gradient(circle at 50% 90%, #DB277715 0%, transparent 50%),
        #FDF2F8
      `,
    },
  },

  midnight: {
    name: "Midnight",
    description: "Moonlit cherry blossoms",
    mode: "dark",
    colors: {
      primary: "#F472B6",
      accent: "#FDA4AF",
      background: "#1A0A14",
      text: "#FECDD3",
      heading: "#F9A8D4",
      smartLayout: "#F472B6",
      cardBackground: "#2D1F2B",
    },
    fonts: { heading: "Cormorant Garamond", body: "Lato" },
    borderRadius: {
      card: "1rem",
      slide: "1.25rem",
      button: "0.21rem",
    },
    transitions: { default: "all 0.25s ease" },
    shadows: {
      card: "0 0 32px rgba(244,114,182,0.25), 0 8px 24px rgba(0,0,0,0.3)",
      button:
        "0 0 24px rgba(244,114,182,0.45), 0 4px 16px rgba(253,164,175,0.2)",
      slide: "0 0 64px rgba(244,114,182,0.2), 0 16px 48px rgba(0,0,0,0.4)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #F472B625 0%, transparent 35%),
        radial-gradient(circle at 90% 20%, #FDA4AF20 0%, transparent 40%),
        radial-gradient(circle at 50% 90%, #FB718520 0%, transparent 50%),
        #1A0A14
      `,
    },
  },

  // ==================== OCEAN / ABYSS ====================
  ocean: {
    name: "Ocean",
    description: "Sunlit tropical waters",
    mode: "light",
    colors: {
      primary: "#0284C7",
      accent: "#38BDF8",
      background: "#F0F9FF",
      text: "#0C4A6E",
      heading: "#0369A1",
      smartLayout: "#0284C7",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Outfit", body: "Work Sans" },
    borderRadius: {
      card: "1.125rem",
      slide: "1.5rem",
      button: "0.25rem",
    },
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 4px 24px rgba(2,132,199,0.1), 0 12px 48px rgba(56,189,248,0.08)",
      button:
        "0 4px 20px rgba(2,132,199,0.25), 0 8px 32px rgba(56,189,248,0.15)",
      slide:
        "0 8px 48px rgba(2,132,199,0.12), 0 16px 64px rgba(56,189,248,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 30% 20%, #0284C720 0%, transparent 40%),
        radial-gradient(circle at 70% 60%, #38BDF820 0%, transparent 45%),
        radial-gradient(circle at 50% 90%, #0369A115 0%, transparent 50%),
        #F0F9FF
      `,
    },
  },

  abyss: {
    name: "Abyss",
    description: "Deep sea mysteries",
    mode: "dark",
    colors: {
      primary: "#38BDF8",
      accent: "#0EA5E9",
      background: "#020617",
      text: "#BAE6FD",
      heading: "#7DD3FC",
      smartLayout: "#38BDF8",
      cardBackground: "#0F172A",
    },
    fonts: { heading: "Outfit", body: "Work Sans" },
    borderRadius: {
      card: "1.125rem",
      slide: "1.5rem",
      button: "0.25rem",
    },
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 0 40px rgba(56,189,248,0.2), 0 12px 36px rgba(0,0,0,0.4)",
      button:
        "0 0 32px rgba(56,189,248,0.45), 0 8px 24px rgba(14,165,233,0.25)",
      slide: "0 0 80px rgba(56,189,248,0.18), 0 20px 60px rgba(0,0,0,0.5)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 30% 20%, #38BDF825 0%, transparent 40%),
        radial-gradient(circle at 70% 60%, #0EA5E920 0%, transparent 45%),
        radial-gradient(circle at 50% 90%, #7DD3FC15 0%, transparent 50%),
        #020617
      `,
    },
  },

  // ==================== SAND / OBSIDIAN ====================
  sand: {
    name: "Sand",
    description: "Warm desert dunes",
    mode: "light",
    colors: {
      primary: "#A16207",
      accent: "#CA8A04",
      background: "#FEFCE8",
      text: "#422006",
      heading: "#A16207",
      smartLayout: "#CA8A04",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Fraunces", body: "Commissioner" },
    borderRadius: {
      card: "0",
      slide: "0",
      button: "0",
    },
    transitions: { default: "all 0.2s ease" },
    shadows: {
      card: "6px 6px 0 0 #CA8A04",
      button: "4px 4px 0 0 #A16207",
      slide: "10px 10px 0 0 rgba(161,98,7,0.3)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 20% 30%, #A1620715 0%, transparent 40%),
        radial-gradient(circle at 80% 50%, #CA8A0415 0%, transparent 45%),
        radial-gradient(circle at 40% 80%, #854D0E10 0%, transparent 50%),
        #FEFCE8
      `,
    },
  },

  obsidian: {
    name: "Obsidian",
    description: "Volcanic glass night",
    mode: "dark",
    colors: {
      primary: "#FACC15",
      accent: "#EAB308",
      background: "#0A0A0A",
      text: "#E7E5E4",
      heading: "#FDE047",
      smartLayout: "#FACC15",
      cardBackground: "#1C1917",
    },
    fonts: { heading: "Fraunces", body: "Commissioner" },
    borderRadius: {
      card: "0",
      slide: "0",
      button: "0",
    },
    transitions: { default: "all 0.2s ease" },
    shadows: {
      card: "6px 6px 0 0 rgba(250,204,21,0.4)",
      button: "4px 4px 0 0 #FACC15",
      slide: "10px 10px 0 0 rgba(250,204,21,0.25)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 20% 30%, #FACC1520 0%, transparent 40%),
        radial-gradient(circle at 80% 50%, #EAB30820 0%, transparent 45%),
        radial-gradient(circle at 40% 80%, #FDE04715 0%, transparent 50%),
        #0A0A0A
      `,
    },
  },

  // ==================== MINT / JADE ====================
  mint: {
    name: "Mint",
    description: "Fresh and cool",
    mode: "light",
    colors: {
      primary: "#10B981",
      accent: "#34D399",
      background: "#ECFDF5",
      text: "#064E3B",
      heading: "#047857",
      smartLayout: "#10B981",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Plus Jakarta Sans", body: "Inter" },
    borderRadius: {
      card: "1.5rem",
      slide: "2rem",
      button: "9999px",
    },
    transitions: { default: "all 0.25s ease-out" },
    shadows: {
      card: "0 2px 12px rgba(16,185,129,0.1), 0 4px 24px rgba(52,211,153,0.08)",
      button: "0 4px 16px rgba(16,185,129,0.25)",
      slide:
        "0 6px 32px rgba(16,185,129,0.12), 0 2px 8px rgba(52,211,153,0.06)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 15% 25%, #10B98118 0%, transparent 40%),
        radial-gradient(circle at 85% 35%, #34D39918 0%, transparent 45%),
        radial-gradient(circle at 50% 85%, #05966912 0%, transparent 50%),
        #ECFDF5
      `,
    },
  },

  jade: {
    name: "Jade",
    description: "Precious stone depths",
    mode: "dark",
    colors: {
      primary: "#34D399",
      accent: "#10B981",
      background: "#022C22",
      text: "#A7F3D0",
      heading: "#6EE7B7",
      smartLayout: "#34D399",
      cardBackground: "#064E3B",
    },
    fonts: { heading: "Plus Jakarta Sans", body: "Inter" },
    borderRadius: {
      card: "1.5rem",
      slide: "2rem",
      button: "9999px",
    },
    transitions: { default: "all 0.25s ease-out" },
    shadows: {
      card: "0 0 28px rgba(52,211,153,0.25), 0 8px 24px rgba(0,0,0,0.3)",
      button:
        "0 0 20px rgba(52,211,153,0.45), 0 4px 16px rgba(16,185,129,0.25)",
      slide: "0 0 56px rgba(52,211,153,0.2), 0 12px 40px rgba(0,0,0,0.35)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 15% 25%, #34D39922 0%, transparent 40%),
        radial-gradient(circle at 85% 35%, #10B98120 0%, transparent 45%),
        radial-gradient(circle at 50% 85%, #6EE7B715 0%, transparent 50%),
        #022C22
      `,
    },
  },

  // ==================== ROSE / WINE ====================
  rose: {
    name: "Rose",
    description: "Soft romantic petals",
    mode: "light",
    colors: {
      primary: "#E11D48",
      accent: "#FB7185",
      background: "#FFF1F2",
      text: "#4C0519",
      heading: "#BE123C",
      smartLayout: "#E11D48",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Libre Baskerville", body: "Source Serif Pro" },
    borderRadius: {
      card: "0.625rem",
      slide: "0.875rem",
      button: "0.13rem",
    },
    transitions: { default: "all 0.3s ease" },
    shadows: {
      card: "0 4px 20px rgba(225,29,72,0.1), 0 8px 40px rgba(251,113,133,0.08)",
      button: "0 4px 24px rgba(225,29,72,0.3)",
      slide:
        "0 8px 48px rgba(225,29,72,0.12), 0 4px 16px rgba(251,113,133,0.06)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 20%, #E11D4818 0%, transparent 35%),
        radial-gradient(circle at 90% 30%, #FB718518 0%, transparent 40%),
        radial-gradient(circle at 50% 85%, #BE123C12 0%, transparent 50%),
        #FFF1F2
      `,
    },
  },

  wine: {
    name: "Wine",
    description: "Rich burgundy elegance",
    mode: "dark",
    colors: {
      primary: "#FB7185",
      accent: "#F43F5E",
      background: "#1C0A10",
      text: "#FECDD3",
      heading: "#FDA4AF",
      smartLayout: "#FB7185",
      cardBackground: "#3F1525",
    },
    fonts: { heading: "Libre Baskerville", body: "Source Serif Pro" },
    borderRadius: {
      card: "0.625rem",
      slide: "0.875rem",
      button: "0.13rem",
    },
    transitions: { default: "all 0.3s ease" },
    shadows: {
      card: "0 0 36px rgba(251,113,133,0.2), 0 8px 28px rgba(0,0,0,0.35)",
      button:
        "0 0 28px rgba(251,113,133,0.45), 0 4px 16px rgba(244,63,94,0.25)",
      slide: "0 0 72px rgba(251,113,133,0.18), 0 16px 56px rgba(0,0,0,0.45)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 20%, #FB718522 0%, transparent 35%),
        radial-gradient(circle at 90% 30%, #F43F5E20 0%, transparent 40%),
        radial-gradient(circle at 50% 85%, #FDA4AF15 0%, transparent 50%),
        #1C0A10
      `,
    },
  },

  // ==================== ARCTIC / GLACIER ====================
  arctic: {
    name: "Arctic",
    description: "Crisp icy morning",
    mode: "light",
    colors: {
      primary: "#6366F1",
      accent: "#818CF8",
      background: "#EEF2FF",
      text: "#312E81",
      heading: "#4338CA",
      smartLayout: "#6366F1",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Manrope", body: "Public Sans" },
    borderRadius: {
      card: "1.75rem",
      slide: "2rem",
      button: "0.33rem",
    },
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 2px 8px rgba(99,102,241,0.08), 0 8px 32px rgba(129,140,248,0.12)",
      button:
        "0 4px 20px rgba(99,102,241,0.25), 0 0 40px rgba(129,140,248,0.1)",
      slide:
        "0 8px 40px rgba(99,102,241,0.1), 0 16px 64px rgba(129,140,248,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 25% 25%, #6366F118 0%, transparent 40%),
        radial-gradient(circle at 75% 40%, #818CF818 0%, transparent 45%),
        radial-gradient(circle at 50% 80%, #4F46E512 0%, transparent 50%),
        #EEF2FF
      `,
    },
  },

  glacier: {
    name: "Glacier",
    description: "Frozen twilight depths",
    mode: "dark",
    colors: {
      primary: "#A5B4FC",
      accent: "#818CF8",
      background: "#0C0A1D",
      text: "#E0E7FF",
      heading: "#C7D2FE",
      smartLayout: "#A5B4FC",
      cardBackground: "#1E1B4B",
    },
    fonts: { heading: "Manrope", body: "Public Sans" },
    borderRadius: {
      card: "1.75rem",
      slide: "2rem",
      button: "0.33rem",
    },
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 0 36px rgba(165,180,252,0.2), 0 8px 28px rgba(0,0,0,0.35)",
      button:
        "0 0 28px rgba(165,180,252,0.4), 0 4px 16px rgba(129,140,248,0.25)",
      slide: "0 0 72px rgba(165,180,252,0.18), 0 16px 56px rgba(0,0,0,0.45)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 25% 25%, #A5B4FC22 0%, transparent 40%),
        radial-gradient(circle at 75% 40%, #818CF820 0%, transparent 45%),
        radial-gradient(circle at 50% 80%, #C7D2FE15 0%, transparent 50%),
        #0C0A1D
      `,
    },
  },

  // ==================== HONEY / AMBER ====================
  honey: {
    name: "Honey",
    description: "Golden sweetness",
    mode: "light",
    colors: {
      primary: "#D97706",
      accent: "#FBBF24",
      background: "#FFFBEB",
      text: "#451A03",
      heading: "#B45309",
      smartLayout: "#D97706",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Bricolage Grotesque", body: "Atkinson Hyperlegible" },
    borderRadius: {
      card: "0.75rem",
      slide: "1rem",
      button: "0.17rem",
    },
    transitions: { default: "all 0.25s ease-in-out" },
    shadows: {
      card: "0 4px 16px rgba(217,119,6,0.12), 0 8px 32px rgba(251,191,36,0.1)",
      button:
        "0 4px 20px rgba(217,119,6,0.3), 0 8px 40px rgba(251,191,36,0.15)",
      slide:
        "0 8px 40px rgba(217,119,6,0.14), 0 4px 16px rgba(251,191,36,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 20% 30%, #D9770618 0%, transparent 40%),
        radial-gradient(circle at 80% 40%, #FBBF2418 0%, transparent 45%),
        radial-gradient(circle at 45% 85%, #B4530912 0%, transparent 50%),
        #FFFBEB
      `,
    },
  },

  amber: {
    name: "Amber",
    description: "Fossilized warmth",
    mode: "dark",
    colors: {
      primary: "#FBBF24",
      accent: "#F59E0B",
      background: "#1A1207",
      text: "#FEF3C7",
      heading: "#FCD34D",
      smartLayout: "#FBBF24",
      cardBackground: "#2D2410",
    },
    fonts: { heading: "Bricolage Grotesque", body: "Atkinson Hyperlegible" },
    borderRadius: {
      card: "0.75rem",
      slide: "1rem",
      button: "0.17rem",
    },
    transitions: { default: "all 0.25s ease-in-out" },
    shadows: {
      card: "0 0 32px rgba(251,191,36,0.25), 0 8px 24px rgba(0,0,0,0.35)",
      button: "0 0 24px rgba(251,191,36,0.5), 0 4px 16px rgba(245,158,11,0.3)",
      slide: "0 0 64px rgba(251,191,36,0.2), 0 16px 48px rgba(0,0,0,0.45)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 20% 30%, #FBBF2422 0%, transparent 40%),
        radial-gradient(circle at 80% 40%, #F59E0B20 0%, transparent 45%),
        radial-gradient(circle at 45% 85%, #FCD34D15 0%, transparent 50%),
        #1A1207
      `,
    },
  },

  // ==================== CORAL / MAGMA ====================
  coral: {
    name: "Coral",
    description: "Vibrant reef life",
    mode: "light",
    colors: {
      primary: "#F97316",
      accent: "#FB923C",
      background: "#FFF7ED",
      text: "#431407",
      heading: "#C2410C",
      smartLayout: "#F97316",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Sora", body: "Karla" },
    borderRadius: {
      card: "1rem",
      slide: "1.25rem",
      button: "0.13rem",
    },
    transitions: { default: "all 0.3s ease" },
    shadows: {
      card: "0 4px 20px rgba(249,115,22,0.15), 0 8px 40px rgba(251,146,60,0.1)",
      button: "0 6px 24px rgba(249,115,22,0.35)",
      slide:
        "0 10px 48px rgba(249,115,22,0.16), 0 4px 16px rgba(251,146,60,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 15% 20%, #F9731618 0%, transparent 40%),
        radial-gradient(circle at 85% 35%, #FB923C18 0%, transparent 45%),
        radial-gradient(circle at 50% 80%, #EA580C12 0%, transparent 50%),
        #FFF7ED
      `,
    },
  },

  magma: {
    name: "Magma",
    description: "Molten volcanic fire",
    mode: "dark",
    colors: {
      primary: "#FB923C",
      accent: "#F97316",
      background: "#1A0F0A",
      text: "#FFEDD5",
      heading: "#FDBA74",
      smartLayout: "#FB923C",
      cardBackground: "#2D1A10",
    },
    fonts: { heading: "Sora", body: "Karla" },
    borderRadius: {
      card: "1rem",
      slide: "1.25rem",
      button: "0.13rem",
    },
    transitions: { default: "all 0.3s ease" },
    shadows: {
      card: "0 0 40px rgba(251,146,60,0.3), 0 0 80px rgba(249,115,22,0.15), 0 8px 24px rgba(0,0,0,0.3)",
      button: "0 0 32px rgba(251,146,60,0.55), 0 0 64px rgba(249,115,22,0.25)",
      slide:
        "0 0 80px rgba(251,146,60,0.25), 0 0 160px rgba(249,115,22,0.12), 0 16px 48px rgba(0,0,0,0.4)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 15% 20%, #FB923C22 0%, transparent 40%),
        radial-gradient(circle at 85% 35%, #F9731620 0%, transparent 45%),
        radial-gradient(circle at 50% 80%, #FDBA7415 0%, transparent 50%),
        #1A0F0A
      `,
    },
  },

  // ==================== LAVENDER / VELVET ====================
  lavender: {
    name: "Lavender",
    description: "Calming purple fields",
    mode: "light",
    colors: {
      primary: "#9333EA",
      accent: "#A855F7",
      background: "#FAF5FF",
      text: "#3B0764",
      heading: "#7E22CE",
      smartLayout: "#9333EA",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Epilogue", body: "Rubik" },
    borderRadius: {
      card: "0.5rem",
      slide: "0.75rem",
      button: "0.17rem",
    },
    transitions: { default: "all 0.3s ease-out" },
    shadows: {
      card: "0 4px 20px rgba(147,51,234,0.1), 0 12px 48px rgba(168,85,247,0.08)",
      button: "0 4px 24px rgba(147,51,234,0.28)",
      slide:
        "0 8px 48px rgba(147,51,234,0.12), 0 16px 80px rgba(168,85,247,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 25%, #9333EA18 0%, transparent 40%),
        radial-gradient(circle at 90% 35%, #A855F718 0%, transparent 45%),
        radial-gradient(circle at 50% 85%, #7C3AED12 0%, transparent 50%),
        #FAF5FF
      `,
    },
  },

  velvet: {
    name: "Velvet",
    description: "Luxurious purple night",
    mode: "dark",
    colors: {
      primary: "#C084FC",
      accent: "#A855F7",
      background: "#120A1C",
      text: "#E9D5FF",
      heading: "#D8B4FE",
      smartLayout: "#C084FC",
      cardBackground: "#2E1A47",
    },
    fonts: { heading: "Epilogue", body: "Rubik" },
    borderRadius: {
      card: "0.5rem",
      slide: "0.75rem",
      button: "0.17rem",
    },
    transitions: { default: "all 0.3s ease-out" },
    shadows: {
      card: "0 0 40px rgba(192,132,252,0.25), 0 8px 32px rgba(0,0,0,0.35)",
      button: "0 0 32px rgba(192,132,252,0.5), 0 4px 20px rgba(168,85,247,0.3)",
      slide: "0 0 80px rgba(192,132,252,0.2), 0 16px 64px rgba(0,0,0,0.45)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 25%, #C084FC22 0%, transparent 40%),
        radial-gradient(circle at 90% 35%, #A855F720 0%, transparent 45%),
        radial-gradient(circle at 50% 85%, #D8B4FE15 0%, transparent 50%),
        #120A1C
      `,
    },
  },
};

// ============ CSS Variable Setter ============

export function setThemeVariables(
  theme: ThemeProperties,
  element: HTMLElement = document.documentElement,
) {
  const { colors, shadows, mask, borderRadius } = theme;

  element.style.setProperty("--presentation-primary", colors.primary);
  element.style.setProperty("--presentation-accent", colors.accent);
  element.style.setProperty("--presentation-background", colors.background);
  element.style.setProperty("--presentation-text", colors.text);
  element.style.setProperty("--presentation-heading", colors.heading);
  element.style.setProperty("--presentation-smart-layout", colors.smartLayout);
  element.style.setProperty(
    "--presentation-card-background",
    colors.cardBackground,
  );
  element.style.setProperty("--presentation-heading-font", theme.fonts.heading);
  element.style.setProperty("--presentation-body-font", theme.fonts.body);
  element.style.setProperty(
    "--presentation-card-border-radius",
    borderRadius.card,
  );
  element.style.setProperty(
    "--presentation-slide-border-radius",
    borderRadius.slide,
  );
  element.style.setProperty(
    "--presentation-button-border-radius",
    borderRadius.button,
  );
  element.style.setProperty(
    "--presentation-transition",
    theme.transitions.default,
  );
  element.style.setProperty("--presentation-card-shadow", shadows.card);
  element.style.setProperty("--presentation-button-shadow", shadows.button);
  element.style.setProperty("--presentation-slide-shadow", shadows.slide);

  if (mask) {
    if (mask.clipPath)
      element.style.setProperty("--presentation-mask-clip-path", mask.clipPath);
    if (mask.maskImage)
      element.style.setProperty("--presentation-mask-image", mask.maskImage);
    if (mask.maskSize)
      element.style.setProperty("--presentation-mask-size", mask.maskSize);
    if (mask.maskPosition)
      element.style.setProperty(
        "--presentation-mask-position",
        mask.maskPosition,
      );
    if (mask.maskRepeat)
      element.style.setProperty("--presentation-mask-repeat", mask.maskRepeat);
  }
}
