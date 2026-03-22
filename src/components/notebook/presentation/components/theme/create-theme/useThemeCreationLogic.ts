"use client";

import { colorThemes } from "@/components/notebook/presentation/components/theme/create-theme/create-theme-types";
import { type ThemeFormValues } from "@/components/notebook/presentation/components/theme/types";
import {
  type ThemeColorsKeys,
  type ThemeProperties,
} from "@/lib/presentation/themes";
import { useCallback, useState } from "react";
import { type UseFormSetValue } from "react-hook-form";

interface UseThemeCreationLogicProps {
  setValue: UseFormSetValue<ThemeFormValues>;
  initialTheme?: ThemeProperties; // Should be ThemeProperties or similar
}

export function useThemeCreationLogic({
  setValue,
  initialTheme,
}: UseThemeCreationLogicProps) {
  const [selectedColorTheme, setSelectedColorTheme] = useState(
    initialTheme ? "custom-theme" : (colorThemes[0]?.id ?? "custom-theme"),
  );
  const [showAdvancedColors, setShowAdvancedColors] = useState(false);

  // Initialize form with initial theme if provided
  // Note: This effect runs once when initialTheme changes (or on mount)
  // Ideally setValue should be called in useEffect if we want to react to prop changes,
  // but for initial load, defaultValues in useForm is better.
  // However, since this logic is separated, we might need to handle it here or let the parent handle defaultValues.
  // Let's assume parent handles defaultValues for the form, and this hook handles local state.

  const applyThemePreset = useCallback(
    (themeId: string) => {
      const preset = colorThemes.find((theme) => theme.id === themeId);
      if (!preset) return;

      setSelectedColorTheme(themeId);
      setValue("colors", preset.colors);
      setValue("fonts", preset.fonts);
      setValue("borderRadius", preset.borderRadius);
      setValue("shadows", preset.shadows);
      setValue("mode", preset.mode);
      // For now don't set the background and leave it to be none
      // setValue("background", preset.background);
      setValue("transitions", preset.transitions);
      setValue("mask", preset.mask);
    },
    [setValue],
  );

  const linkedColorChange = useCallback(
    (key: ThemeColorsKeys, value: string) => {
      setValue(`colors.${key}`, value, {
        shouldDirty: true,
      });
    },
    [setValue],
  );

  return {
    selectedColorTheme,
    setSelectedColorTheme,
    showAdvancedColors,
    setShowAdvancedColors,
    applyThemePreset,
    linkedColorChange,
  };
}
