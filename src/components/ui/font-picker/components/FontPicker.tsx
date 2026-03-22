/** biome-ignore-all lint/suspicious/noExplicitAny: This use requires any */
import { useCallback, useEffect, useMemo, useState } from "react";

// The font info is now imported statically at the top of the file.
import fontInfos from "../font-preview/fontInfo.json";

import { cn } from "@/lib/utils";
import {
  type Font,
  type FontPickerProps,
  defaultFont,
  toString,
} from "../types";
import { checkLoaded } from "../utils/fontChecker";
import { sanify } from "../utils/sanify";
import { getFourVariants, loadFontFromObject } from "../utils/utils";
import { FontCombobox } from "./FontCombobox";
import { FontList } from "./FontList";

export default function FontPicker({
  defaultValue = "Open Sans",
  noMatches = "No matches",
  autoLoad = true,
  loaderOnly = false,
  loadAllVariants = false,
  loadFonts = "",
  googleFonts = "all",
  fontCategories = "all",
  localFonts = [],
  mode = "combo",
  fontVariants,
  value,
  fontsLoaded,
  fontsLoadedTimeout,
  className,
  selectClassName,
  ...rest
}: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // All state and effects for loading have been removed (fontInfos, isLoadingFonts, error).

  const allGoogleFonts: Font[] = useMemo(() => {
    // The data from fontInfos is available immediately.
    return (fontInfos as any[]).map((info: Omit<Font, "cased">) => ({
      ...info,
      cased: info.name.toLowerCase(),
    }));
  }, []); // The dependency on fontInfos is removed as it's now a constant import.

  const fonts = useMemo(() => {
    let activeFonts: Font[];

    if (googleFonts === "all") {
      activeFonts = [...allGoogleFonts];
    } else if (typeof googleFonts === "string") {
      const fontNames = googleFonts.trim().toLowerCase().split(",");
      activeFonts = allGoogleFonts.filter((font) =>
        fontNames.includes(font.cased),
      );
    } else if (typeof googleFonts === "function") {
      activeFonts = allGoogleFonts.filter(googleFonts);
    } else {
      const fontNames =
        googleFonts?.map((v) =>
          typeof v === "string" ? v.toLowerCase() : v.cased,
        ) ?? [];
      activeFonts = allGoogleFonts.filter((font) =>
        fontNames.includes(font.cased),
      );
    }

    const processedLocalFonts = localFonts.map((font) => ({
      ...font,
      cased: font.name.toLowerCase(),
      sane: sanify(font.name),
      variants: font.variants.map((v) => toString(v)),
      isLocal: true,
    }));

    activeFonts = [...activeFonts, ...processedLocalFonts];

    if (fontCategories === "all") {
      return activeFonts;
    }

    const categories = Array.isArray(fontCategories)
      ? fontCategories.map((c) => c.toLowerCase())
      : fontCategories.trim().toLowerCase().split(",");

    return activeFonts.filter((font) => categories.includes(font.category));
  }, [googleFonts, allGoogleFonts, localFonts, fontCategories]);

  const getFontByName = useCallback(
    (name: string) => fonts.find((font) => font.name.trim() === name.trim()),
    [fonts],
  );

  const saneDefaultValue = useMemo(() => {
    if (!fonts || fonts.length === 0) {
      return defaultValue;
    }
    const search = defaultValue.toLowerCase().trim();
    return fonts.some((font) => font.cased === search)
      ? defaultValue
      : fonts[0]?.name;
  }, [fonts, defaultValue]);

  const [currentFont, setCurrentFont] = useState<Font>(
    () => getFontByName(saneDefaultValue!) || defaultFont,
  );

  useEffect(() => {
    setCurrentFont(getFontByName(saneDefaultValue!) || defaultFont);
  }, [saneDefaultValue, getFontByName]);

  const handleFontSelect = useCallback(
    (font: Font) => {
      if (autoLoad) {
        loadFontFromObject(font, loadAllVariants, getFourVariants);
      }
      fontVariants?.({ fontName: font.name, variants: font.variants });
      value?.(font.name);
    },
    [autoLoad, loadAllVariants, fontVariants, value],
  );

  useEffect(() => {
    if (!fontsLoaded) return;

    const fontsToLoad: string[] = [];
    if (typeof loadFonts === "string" && loadFonts) {
      fontsToLoad.push(loadFonts);
    } else if (Array.isArray(loadFonts)) {
      loadFonts.forEach((font) => {
        const fontName = typeof font === "string" ? font : font?.fontName;
        if (fontName) fontsToLoad.push(fontName);
      });
    }

    console.log("fontsToLoad", fontsToLoad);
    const fontsToCheck = [...new Set([currentFont.name, ...fontsToLoad])];

    const checkFonts = async () => {
      try {
        const results = await Promise.all(
          fontsToCheck.map((font) =>
            checkLoaded({ fontFamily: font, timeout: fontsLoadedTimeout }),
          ),
        );
        fontsLoaded?.(!results.some((res) => !res));
      } catch (e) {
        console.error("Error checking if font families loaded", e);
        fontsLoaded?.(false);
      }
    };

    checkFonts();
  }, [loadFonts, currentFont, fontsLoaded, fontsLoadedTimeout]);

  // When acting as a loader-only component, proactively load all fonts passed in props.
  useEffect(() => {
    if (!loaderOnly) return;

    const fontsToLoad: string[] = [];
    if (typeof loadFonts === "string" && loadFonts) {
      fontsToLoad.push(loadFonts);
    } else if (Array.isArray(loadFonts)) {
      loadFonts.forEach((font) => {
        const fontName = typeof font === "string" ? font : font?.fontName;
        if (fontName) fontsToLoad.push(fontName);
      });
    }

    // De-duplicate and load each font family via Google Fonts
    [...new Set(fontsToLoad)].forEach((fontName) => {
      const font = getFontByName(fontName);
      if (font) {
        loadFontFromObject(font, loadAllVariants, getFourVariants);
      }
    });
  }, [loaderOnly, loadFonts, getFontByName, loadAllVariants]);

  if (loaderOnly) {
    return null;
  }

  // Error display is removed as a static import will fail at build time, not run time.

  return (
    <div className={cn("w-full", className)} {...rest}>
      {mode === "combo" ? (
        <FontCombobox
          fonts={fonts}
          currentFont={currentFont}
          onFontSelect={handleFontSelect}
          noMatches={noMatches}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          open={open}
          onOpenChange={setOpen}
          className={selectClassName}
        />
      ) : (
        <FontList
          fonts={fonts}
          currentFont={currentFont}
          onFontSelect={handleFontSelect}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          isLoadingFonts={false}
        />
      )}
    </div>
  );
}
