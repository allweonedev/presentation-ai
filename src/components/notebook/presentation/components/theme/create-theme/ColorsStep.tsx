"use client";

import { cn } from "@/lib/utils";
import { Edit2, Heart } from "lucide-react";
import { useState } from "react";
import { type Control, Controller, useWatch } from "react-hook-form";

import { type ColorKey, type ThemeFormValues } from "../types";
import { ColorSettingsPanel } from "./ColorSettingsPanel";
import { ColorThemeGrid } from "./ColorThemeGrid";
import { colorThemes } from "./create-theme-types";

interface ColorsStepProps {
  control: Control<ThemeFormValues>;
  selectedColorTheme: string;
  onColorChange: (key: ColorKey, value: string) => void;
  onSelectColorTheme: (themeId: string) => void;
}

export function ColorsStep({
  control,
  selectedColorTheme,
  onColorChange,
  onSelectColorTheme,
}: ColorsStepProps) {
  // Use useWatch to properly subscribe to form changes
  const watchColors = useWatch({ control, name: "colors" });
  const [mode, setMode] = useState<"curated" | "customize">(
    selectedColorTheme === "custom-theme" ? "customize" : "curated",
  );

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="border-b border-border p-6">
        <p className="mb-4 text-center text-sm text-muted-foreground">
          Choose your theme and background colors
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("curated")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              mode === "curated"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Heart className="h-4 w-4" />
            ALLWEONE®
          </button>
          <button
            onClick={() => setMode("customize")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              mode === "customize"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Edit2 className="h-4 w-4" />
            Customize
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {mode === "curated" ? (
          <ColorThemeGrid
            themes={colorThemes}
            selectedTheme={selectedColorTheme}
            onSelectTheme={onSelectColorTheme}
          />
        ) : (
          <div className="space-y-6">
            <Controller
              name="background"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <ColorSettingsPanel
                  colors={watchColors}
                  onColorChange={onColorChange}
                  background={field.value}
                  onBackgroundChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
