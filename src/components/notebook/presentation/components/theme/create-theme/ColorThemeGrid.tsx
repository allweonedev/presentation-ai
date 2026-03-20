"use client";

import { ThemeCard } from "@/components/presentation/edit-panel/sections/theme/ThemeCard";
import { type ColorTheme } from "./create-theme-types";

interface ColorThemeGridProps {
  themes: ColorTheme[];
  selectedTheme?: string | null;
  onSelectTheme: (themeId: string) => void;
}

export function ColorThemeGrid({
  themes,
  selectedTheme,
  onSelectTheme,
}: ColorThemeGridProps) {
  if (!themes.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {themes.map((theme) => (
        <ThemeCard
          showInfo={false}
          key={theme.id}
          themeId={theme.id}
          theme={theme}
          isSelected={selectedTheme === theme.id}
          onSelect={onSelectTheme}
          showFavoriteButton={false}
          showEllipsis={false}
        />
      ))}
    </div>
  );
}
