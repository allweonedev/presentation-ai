import {
  type ThemeColors,
  type ThemeProperties,
  type Themes,
} from "@/lib/presentation/themes";
// Form values for creating/editing a theme
export type ThemeFormValues = {
  isPublic: boolean;
  themeBase: Themes | "blank";
} & ThemeProperties;

// Color key type for theme colors
export type ColorKey = keyof ThemeColors;
export const fontOptions = [
  "Inter, sans-serif",
  "Poppins, sans-serif",
  "Montserrat, sans-serif",
  "Roboto, sans-serif",
  "Playfair Display, serif",
  "Merriweather, serif",
  "Lora, serif",
  "Source Sans Pro, sans-serif",
  "DM Sans, sans-serif",
  "JetBrains Mono, monospace",
  "Raleway, sans-serif",
  "Open Sans, sans-serif",
];

export interface CustomTheme {
  id: string;
  name: string;
  description: string | null;
  themeData: ThemeProperties;
  isPublic: boolean;
  logoUrl: string | null;
  userId: string;
  user?: {
    name: string | null;
  };
  likeCount?: number;
  isLiked?: boolean;
  isFavorite?: boolean;
}
