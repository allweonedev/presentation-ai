"use client";

import { type ThemeProperties } from "@/lib/presentation/themes";
import { ColorField } from "./ColorField";

interface ColorEditorProps {
  modeColors: ThemeProperties["colors"];
  onColorChange: (key: keyof ThemeProperties["colors"], value: string) => void;
}

export function ColorEditor({ modeColors, onColorChange }: ColorEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <ColorField
          label="Background"
          value={modeColors.background}
          onChange={(v) => onColorChange("background", v)}
        />
        <ColorField
          label="Primary"
          value={modeColors.primary}
          onChange={(v) => onColorChange("primary", v)}
        />

        <ColorField
          label="Accent"
          value={modeColors.accent}
          onChange={(v) => onColorChange("accent", v)}
        />
      </div>
    </div>
  );
}
