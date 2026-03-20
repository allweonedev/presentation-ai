"use client";

import { FontPicker } from "@/components/ui/font-picker";
import { type ThemeProperties } from "@/lib/presentation/themes";

// Component to load fonts for custom themes
export function ThemeFontLoader({ themeData }: { themeData: ThemeProperties }) {
  const fonts = [themeData.fonts.heading, themeData.fonts.body];

  return (
    <div style={{ display: "none" }}>
      <FontPicker
        defaultValue={fonts[0]}
        loadFonts={fonts}
        loaderOnly
        autoLoad
      />
    </div>
  );
}
