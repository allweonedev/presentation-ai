// prisma/seed.ts
import { env } from "@/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../migrate/generated/client";
// Import themes - Note: This requires a TypeScript runner like tsx or ts-node
// If using plain Node.js, you may need to: pnpm add -D tsx
// Then update prisma.config.ts seed command to: "tsx prisma/seed.js"

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});

export const themes = {
  // ==================== DAKTILO / NOIR ====================
  daktilo: {
    name: "Daktilo",
    description: "Modern and clean",
    mode: "light",
    colors: {
      primary: "#3B82F6",
      secondary: "#1F2937",
      accent: "#60A5FA",
      background: "#FFFFFF",
      text: "#1F2937",
      heading: "#3B82F6",
      smartLayout: "#3B82F6",
      cardBackground: "#F3F4F6",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    borderRadius: "0.5rem",
    transitions: {
      default: "all 0.2s ease-in-out",
    },
    shadows: {
      card: "0 1px 3px rgba(0,0,0,0.12)",
      button: "0 2px 4px rgba(59,130,246,0.1)",
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
      secondary: "#E5E7EB",
      accent: "#93C5FD",
      background: "#111827",
      text: "#E5E7EB",
      heading: "#60A5FA",
      smartLayout: "#60A5FA",
      cardBackground: "#1F2937",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    borderRadius: "0.5rem",
    transitions: {
      default: "all 0.2s ease-in-out",
    },
    shadows: {
      card: "0 1px 3px rgba(0,0,0,0.3)",
      button: "0 2px 4px rgba(96,165,250,0.2)",
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
      secondary: "#312E81",
      accent: "#818CF8",
      background: "#F8FAFC",
      text: "#334155",
      heading: "#4F46E5",
      smartLayout: "#4F46E5",
      cardBackground: "#FFFFFF",
    },
    fonts: {
      heading: "Poppins",
      body: "Source Sans Pro",
    },
    borderRadius: "0.75rem",
    transitions: {
      default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    shadows: {
      card: "0 4px 6px rgba(0,0,0,0.05)",
      button: "0 4px 6px rgba(79,70,229,0.1)",
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
      secondary: "#C7D2FE",
      accent: "#A5B4FC",
      background: "#1E1B4B",
      text: "#E2E8F0",
      heading: "#818CF8",
      smartLayout: "#818CF8",
      cardBackground: "#312E81",
    },
    fonts: {
      heading: "Poppins",
      body: "Source Sans Pro",
    },
    borderRadius: "0.75rem",
    transitions: {
      default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    shadows: {
      card: "0 4px 6px rgba(0,0,0,0.2)",
      button: "0 4px 6px rgba(129,140,248,0.2)",
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
      secondary: "#4338CA",
      accent: "#3B82F6",
      background: "#FFFFFF",
      text: "#1F2937",
      heading: "#312E81",
      smartLayout: "#312E81",
      cardBackground: "#F3F4F6",
    },
    fonts: {
      heading: "Space Grotesk",
      body: "IBM Plex Sans",
    },
    borderRadius: "1rem",
    transitions: {
      default: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    shadows: {
      card: "0 8px 16px rgba(0,0,0,0.1)",
      button: "0 4px 12px rgba(49,46,129,0.1)",
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
      secondary: "#A5B4FC",
      accent: "#60A5FA",
      background: "#030712",
      text: "#E5E7EB",
      heading: "#818CF8",
      smartLayout: "#818CF8",
      cardBackground: "#111827",
    },
    fonts: {
      heading: "Space Grotesk",
      body: "IBM Plex Sans",
    },
    borderRadius: "1rem",
    transitions: {
      default: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    shadows: {
      card: "0 8px 16px rgba(0,0,0,0.4)",
      button: "0 4px 12px rgba(129,140,248,0.2)",
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
      secondary: "#374151",
      accent: "#4B5563",
      background: "#F3F4F6",
      text: "#374151",
      heading: "#1F2937",
      smartLayout: "#1F2937",
      cardBackground: "#FFFFFF",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Lora",
    },
    borderRadius: "0.25rem",
    transitions: {
      default: "all 0.2s ease",
    },
    shadows: {
      card: "0 2px 4px rgba(0,0,0,0.08)",
      button: "0 1px 2px rgba(0,0,0,0.05)",
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
      secondary: "#D1D5DB",
      accent: "#9CA3AF",
      background: "#111827",
      text: "#E5E7EB",
      heading: "#E5E7EB",
      smartLayout: "#E5E7EB",
      cardBackground: "#1F2937",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Lora",
    },
    borderRadius: "0.25rem",
    transitions: {
      default: "all 0.2s ease",
    },
    shadows: {
      card: "0 2px 4px rgba(0,0,0,0.2)",
      button: "0 1px 2px rgba(255,255,255,0.1)",
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
      secondary: "#5B21B6",
      accent: "#8B5CF6",
      background: "#FFFFFF",
      text: "#1F2937",
      heading: "#7C3AED",
      smartLayout: "#7C3AED",
      cardBackground: "#F5F3FF",
    },
    fonts: {
      heading: "Montserrat",
      body: "Raleway",
    },
    borderRadius: "0.5rem",
    transitions: {
      default: "all 0.3s ease-out",
    },
    shadows: {
      card: "0 4px 8px rgba(124,58,237,0.1)",
      button: "0 4px 12px rgba(124,58,237,0.15)",
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
      secondary: "#8B5CF6",
      accent: "#C4B5FD",
      background: "#18181B",
      text: "#D4D4D8",
      heading: "#A78BFA",
      smartLayout: "#A78BFA",
      cardBackground: "#27272A",
    },
    fonts: {
      heading: "Montserrat",
      body: "Raleway",
    },
    borderRadius: "0.5rem",
    transitions: {
      default: "all 0.3s ease-out",
    },
    shadows: {
      card: "0 4px 8px rgba(167,139,250,0.2)",
      button: "0 4px 12px rgba(167,139,250,0.25)",
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

  // ==================== ALLWEONE / NEON ====================
  allweoneLight: {
    name: "Allweone",
    description: "Clean and high contrast",
    mode: "light",
    colors: {
      primary: "#06B6D4",
      secondary: "#0E7490",
      accent: "#0EA5E9",
      background: "#FFFFFF",
      text: "#0F172A",
      heading: "#06B6D4",
      smartLayout: "#06B6D4",
      cardBackground: "#ECFEFF",
    },
    fonts: {
      heading: "JetBrains Mono",
      body: "Inter",
    },
    borderRadius: "0.375rem",
    transitions: {
      default: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    shadows: {
      card: "0 4px 12px rgba(6,182,212,0.1)",
      button: "0 4px 16px rgba(6,182,212,0.15)",
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
      secondary: "#67E8F9",
      accent: "#38BDF8",
      background: "#0F172A",
      text: "#E2E8F0",
      heading: "#22D3EE",
      smartLayout: "#22D3EE",
      cardBackground: "#1E293B",
    },
    fonts: {
      heading: "JetBrains Mono",
      body: "Inter",
    },
    borderRadius: "0.375rem",
    transitions: {
      default: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    shadows: {
      card: "0 4px 12px rgba(34,211,238,0.15)",
      button: "0 4px 16px rgba(34,211,238,0.2)",
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
      secondary: "#991B1B",
      accent: "#F87171",
      background: "#FFFFFF",
      text: "#1F2937",
      heading: "#DC2626",
      smartLayout: "#DC2626",
      cardBackground: "#FEF2F2",
    },
    fonts: {
      heading: "Merriweather",
      body: "Source Sans Pro",
    },
    borderRadius: "0.5rem",
    transitions: {
      default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    shadows: {
      card: "0 4px 8px rgba(220,38,38,0.1)",
      button: "0 4px 12px rgba(220,38,38,0.15)",
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
      secondary: "#FCA5A5",
      accent: "#EF4444",
      background: "#18181B",
      text: "#E5E7EB",
      heading: "#F87171",
      smartLayout: "#F87171",
      cardBackground: "#27272A",
    },
    fonts: {
      heading: "Merriweather",
      body: "Source Sans Pro",
    },
    borderRadius: "0.5rem",
    transitions: {
      default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    shadows: {
      card: "0 4px 8px rgba(248,113,113,0.2)",
      button: "0 4px 12px rgba(248,113,113,0.25)",
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
      secondary: "#C2410C",
      accent: "#FB923C",
      background: "#FFFBEB",
      text: "#292524",
      heading: "#EA580C",
      smartLayout: "#EA580C",
      cardBackground: "#FFFFFF",
    },
    fonts: {
      heading: "DM Serif Display",
      body: "DM Sans",
    },
    borderRadius: "0.625rem",
    transitions: {
      default: "all 0.25s ease-in-out",
    },
    shadows: {
      card: "0 4px 8px rgba(234,88,12,0.1)",
      button: "0 4px 12px rgba(234,88,12,0.15)",
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
      secondary: "#FDBA74",
      accent: "#F97316",
      background: "#1C1917",
      text: "#E7E5E4",
      heading: "#FB923C",
      smartLayout: "#FB923C",
      cardBackground: "#292524",
    },
    fonts: {
      heading: "DM Serif Display",
      body: "DM Sans",
    },
    borderRadius: "0.625rem",
    transitions: {
      default: "all 0.25s ease-in-out",
    },
    shadows: {
      card: "0 4px 8px rgba(251,146,60,0.2)",
      button: "0 4px 12px rgba(251,146,60,0.25)",
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
      secondary: "#047857",
      accent: "#34D399",
      background: "#F0FDF4",
      text: "#1F2937",
      heading: "#059669",
      smartLayout: "#059669",
      cardBackground: "#FFFFFF",
    },
    fonts: {
      heading: "Bitter",
      body: "Source Sans Pro",
    },
    borderRadius: "0.75rem",
    transitions: {
      default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    shadows: {
      card: "0 4px 12px rgba(5,150,105,0.08)",
      button: "0 3px 8px rgba(5,150,105,0.15)",
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
      secondary: "#6EE7B7",
      accent: "#10B981",
      background: "#064E3B",
      text: "#E5E7EB",
      heading: "#34D399",
      smartLayout: "#34D399",
      cardBackground: "#065F46",
    },
    fonts: {
      heading: "Bitter",
      body: "Source Sans Pro",
    },
    borderRadius: "0.75rem",
    transitions: {
      default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    shadows: {
      card: "0 4px 12px rgba(52,211,153,0.15)",
      button: "0 3px 8px rgba(52,211,153,0.2)",
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
  aurora: {
    name: "Aurora",
    description: "Northern lights at dawn",
    mode: "light",
    colors: {
      primary: "#06B6D4",
      secondary: "#8B5CF6",
      accent: "#34D399",
      background: "#F0FDFA",
      text: "#134E4A",
      heading: "#0891B2",
      smartLayout: "#06B6D4",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Quicksand", body: "Nunito" },
    borderRadius: "1rem",
    transitions: { default: "all 0.3s ease-out" },
    shadows: {
      card: "0 4px 12px rgba(6,182,212,0.1)",
      button: "0 4px 8px rgba(6,182,212,0.15)",
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
      secondary: "#A78BFA",
      accent: "#4ADE80",
      background: "#0C1222",
      text: "#E2E8F0",
      heading: "#67E8F9",
      smartLayout: "#22D3EE",
      cardBackground: "#1E293B",
    },
    fonts: { heading: "Quicksand", body: "Nunito" },
    borderRadius: "1rem",
    transitions: { default: "all 0.3s ease-out" },
    shadows: {
      card: "0 4px 12px rgba(34,211,238,0.15)",
      button: "0 4px 8px rgba(34,211,238,0.2)",
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
      secondary: "#DB2777",
      accent: "#F472B6",
      background: "#FDF2F8",
      text: "#831843",
      heading: "#BE185D",
      smartLayout: "#EC4899",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Cormorant Garamond", body: "Lato" },
    borderRadius: "0.75rem",
    transitions: { default: "all 0.25s ease" },
    shadows: {
      card: "0 4px 12px rgba(236,72,153,0.1)",
      button: "0 4px 8px rgba(236,72,153,0.15)",
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
      secondary: "#FB7185",
      accent: "#FDA4AF",
      background: "#1A0A14",
      text: "#FECDD3",
      heading: "#F9A8D4",
      smartLayout: "#F472B6",
      cardBackground: "#2D1F2B",
    },
    fonts: { heading: "Cormorant Garamond", body: "Lato" },
    borderRadius: "0.75rem",
    transitions: { default: "all 0.25s ease" },
    shadows: {
      card: "0 4px 12px rgba(244,114,182,0.2)",
      button: "0 4px 8px rgba(244,114,182,0.25)",
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
      secondary: "#0369A1",
      accent: "#38BDF8",
      background: "#F0F9FF",
      text: "#0C4A6E",
      heading: "#0369A1",
      smartLayout: "#0284C7",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Outfit", body: "Work Sans" },
    borderRadius: "0.5rem",
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 4px 12px rgba(2,132,199,0.1)",
      button: "0 4px 8px rgba(2,132,199,0.15)",
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
      secondary: "#7DD3FC",
      accent: "#0EA5E9",
      background: "#020617",
      text: "#BAE6FD",
      heading: "#7DD3FC",
      smartLayout: "#38BDF8",
      cardBackground: "#0F172A",
    },
    fonts: { heading: "Outfit", body: "Work Sans" },
    borderRadius: "0.5rem",
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 4px 12px rgba(56,189,248,0.15)",
      button: "0 4px 8px rgba(56,189,248,0.2)",
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
      secondary: "#854D0E",
      accent: "#CA8A04",
      background: "#FEFCE8",
      text: "#422006",
      heading: "#A16207",
      smartLayout: "#CA8A04",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Fraunces", body: "Commissioner" },
    borderRadius: "0.25rem",
    transitions: { default: "all 0.2s ease" },
    shadows: {
      card: "0 4px 12px rgba(161,98,7,0.1)",
      button: "0 4px 8px rgba(161,98,7,0.12)",
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
      secondary: "#FDE047",
      accent: "#EAB308",
      background: "#0A0A0A",
      text: "#E7E5E4",
      heading: "#FDE047",
      smartLayout: "#FACC15",
      cardBackground: "#1C1917",
    },
    fonts: { heading: "Fraunces", body: "Commissioner" },
    borderRadius: "0.25rem",
    transitions: { default: "all 0.2s ease" },
    shadows: {
      card: "0 4px 12px rgba(250,204,21,0.12)",
      button: "0 4px 8px rgba(250,204,21,0.15)",
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
      secondary: "#059669",
      accent: "#34D399",
      background: "#ECFDF5",
      text: "#064E3B",
      heading: "#047857",
      smartLayout: "#10B981",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Plus Jakarta Sans", body: "Inter" },
    borderRadius: "0.875rem",
    transitions: { default: "all 0.25s ease-out" },
    shadows: {
      card: "0 4px 12px rgba(16,185,129,0.1)",
      button: "0 4px 8px rgba(16,185,129,0.15)",
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
      secondary: "#6EE7B7",
      accent: "#10B981",
      background: "#022C22",
      text: "#A7F3D0",
      heading: "#6EE7B7",
      smartLayout: "#34D399",
      cardBackground: "#064E3B",
    },
    fonts: { heading: "Plus Jakarta Sans", body: "Inter" },
    borderRadius: "0.875rem",
    transitions: { default: "all 0.25s ease-out" },
    shadows: {
      card: "0 4px 12px rgba(52,211,153,0.15)",
      button: "0 4px 8px rgba(52,211,153,0.2)",
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
      secondary: "#BE123C",
      accent: "#FB7185",
      background: "#FFF1F2",
      text: "#4C0519",
      heading: "#BE123C",
      smartLayout: "#E11D48",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Libre Baskerville", body: "Source Serif Pro" },
    borderRadius: "0.5rem",
    transitions: { default: "all 0.3s ease" },
    shadows: {
      card: "0 4px 12px rgba(225,29,72,0.1)",
      button: "0 4px 8px rgba(225,29,72,0.15)",
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
      secondary: "#FDA4AF",
      accent: "#F43F5E",
      background: "#1C0A10",
      text: "#FECDD3",
      heading: "#FDA4AF",
      smartLayout: "#FB7185",
      cardBackground: "#3F1525",
    },
    fonts: { heading: "Libre Baskerville", body: "Source Serif Pro" },
    borderRadius: "0.5rem",
    transitions: { default: "all 0.3s ease" },
    shadows: {
      card: "0 4px 12px rgba(251,113,133,0.18)",
      button: "0 4px 8px rgba(251,113,133,0.22)",
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
      secondary: "#4F46E5",
      accent: "#818CF8",
      background: "#EEF2FF",
      text: "#312E81",
      heading: "#4338CA",
      smartLayout: "#6366F1",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Manrope", body: "Public Sans" },
    borderRadius: "1.25rem",
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 4px 12px rgba(99,102,241,0.1)",
      button: "0 4px 8px rgba(99,102,241,0.15)",
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
      secondary: "#C7D2FE",
      accent: "#818CF8",
      background: "#0C0A1D",
      text: "#E0E7FF",
      heading: "#C7D2FE",
      smartLayout: "#A5B4FC",
      cardBackground: "#1E1B4B",
    },
    fonts: { heading: "Manrope", body: "Public Sans" },
    borderRadius: "1.25rem",
    transitions: { default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
    shadows: {
      card: "0 4px 12px rgba(165,180,252,0.15)",
      button: "0 4px 8px rgba(165,180,252,0.2)",
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
      secondary: "#B45309",
      accent: "#FBBF24",
      background: "#FFFBEB",
      text: "#451A03",
      heading: "#B45309",
      smartLayout: "#D97706",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Bricolage Grotesque", body: "Atkinson Hyperlegible" },
    borderRadius: "0.625rem",
    transitions: { default: "all 0.25s ease-in-out" },
    shadows: {
      card: "0 4px 12px rgba(217,119,6,0.1)",
      button: "0 4px 8px rgba(217,119,6,0.15)",
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
      secondary: "#FCD34D",
      accent: "#F59E0B",
      background: "#1A1207",
      text: "#FEF3C7",
      heading: "#FCD34D",
      smartLayout: "#FBBF24",
      cardBackground: "#2D2410",
    },
    fonts: { heading: "Bricolage Grotesque", body: "Atkinson Hyperlegible" },
    borderRadius: "0.625rem",
    transitions: { default: "all 0.25s ease-in-out" },
    shadows: {
      card: "0 4px 12px rgba(251,191,36,0.15)",
      button: "0 4px 8px rgba(251,191,36,0.2)",
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
      secondary: "#EA580C",
      accent: "#FB923C",
      background: "#FFF7ED",
      text: "#431407",
      heading: "#C2410C",
      smartLayout: "#F97316",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Sora", body: "Karla" },
    borderRadius: "0.75rem",
    transitions: { default: "all 0.3s ease" },
    shadows: {
      card: "0 4px 12px rgba(249,115,22,0.1)",
      button: "0 4px 8px rgba(249,115,22,0.15)",
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
      secondary: "#FDBA74",
      accent: "#F97316",
      background: "#1A0F0A",
      text: "#FFEDD5",
      heading: "#FDBA74",
      smartLayout: "#FB923C",
      cardBackground: "#2D1A10",
    },
    fonts: { heading: "Sora", body: "Karla" },
    borderRadius: "0.75rem",
    transitions: { default: "all 0.3s ease" },
    shadows: {
      card: "0 4px 12px rgba(251,146,60,0.18)",
      button: "0 4px 8px rgba(251,146,60,0.22)",
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
      secondary: "#7C3AED",
      accent: "#A855F7",
      background: "#FAF5FF",
      text: "#3B0764",
      heading: "#7E22CE",
      smartLayout: "#9333EA",
      cardBackground: "#FFFFFF",
    },
    fonts: { heading: "Epilogue", body: "Rubik" },
    borderRadius: "0.5rem",
    transitions: { default: "all 0.3s ease-out" },
    shadows: {
      card: "0 4px 12px rgba(147,51,234,0.1)",
      button: "0 4px 8px rgba(147,51,234,0.15)",
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
      secondary: "#D8B4FE",
      accent: "#A855F7",
      background: "#120A1C",
      text: "#E9D5FF",
      heading: "#D8B4FE",
      smartLayout: "#C084FC",
      cardBackground: "#2E1A47",
    },
    fonts: { heading: "Epilogue", body: "Rubik" },
    borderRadius: "0.5rem",
    transitions: { default: "all 0.3s ease-out" },
    shadows: {
      card: "0 4px 12px rgba(192,132,252,0.18)",
      button: "0 4px 8px rgba(192,132,252,0.22)",
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

async function main() {
  const systemUser = await prisma.user.upsert({
    where: { email: "system@allweone.com" },
    update: {},
    create: {
      id: "0",
      email: "system@allweone.com",
      name: "ALLWEONE System",
    },
  });

  // Seed all built-in themes
  for (const [themeKey, data] of Object.entries(themes)) {
    const { name, description, ...themeData } = data;
    try {
      const customTheme = await prisma.presentationTheme.upsert({
        where: { id: themeKey },
        update: {
          name: name,
          description: description,
          themeData: themeData,
          isPublic: true,
          updatedAt: new Date(),
        },
        create: {
          id: themeKey,
          name: name,
          description: description,
          themeData: themeData,
          isPublic: true,
          userId: systemUser.id,
          isAdmin: true,
        },
      });

      console.log(`✓ Seeded theme: ${customTheme.name} (${themeKey})`);
    } catch (error) {
      console.error(`✗ Failed to seed theme ${themeKey}:`, error);
    }
  }

  console.log("\nTheme seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
