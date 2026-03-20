export interface FontPickerProps extends React.ComponentPropsWithoutRef<"div"> {
  defaultValue?: string;
  noMatches?: string;
  autoLoad?: boolean;
  loaderOnly?: boolean;
  loadAllVariants?: boolean;
  loadFonts?: string[] | FontToVariant[] | string;
  googleFonts?: string[] | Font[] | string | ((font: Font) => boolean);
  fontCategories?: string[] | string;
  localFonts?: Font[] | undefined;
  mode?: "combo" | "list";
  fontVariants?: (fontVariants: FontToVariant) => void;
  value?: (value: string) => void;
  fontsLoaded?: (fontsLoaded: boolean) => void;
  fontsLoadedTimeout?: number;
  selectClassName?: string;
}

export interface Font {
  category: string;
  name: string;
  sane: string;
  cased: string;
  variants: Variant[];
  isLocal?: boolean;
  subsets?: string[];
}

export interface FourFonts {
  regular?: number;
  bold?: number;
  italic?: number;
  boldItalic?: number;
}

export type Variant = FontVariant | string;

export interface FontVariant {
  italic: boolean;
  weight: number;
}

export interface FontToVariant {
  fontName: string;
  variants: Variant[];
}

export function toString(v: Variant) {
  if (typeof v === "string") {
    return v;
  }
  return (v.italic ? "1" : "0") + "," + v.weight;
}

export const defaultFont: Font = {
  category: "sans-serif",
  name: "Open Sans",
  sane: "open_sans",
  cased: "open sans",
  variants: [
    "0,300",
    "0,400",
    "0,500",
    "0,600",
    "0,700",
    "0,800",
    "1,300",
    "1,400",
    "1,500",
    "1,600",
    "1,700",
    "1,800",
  ],
};
