"use client";
import ColorPicker from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import {
  type ThemeBackground,
  type ThemeColors,
} from "@/lib/presentation/themes";
import debounce from "lodash.debounce";
import { RotateCcw } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { type ColorKey } from "../types";
import { CompactBackgroundSelector } from "./CompactBackgroundSelector";

interface ColorSettingsPanelProps {
  colors: ThemeColors;
  onColorChange: (key: ColorKey, value: string) => void;
  defaultColors?: Partial<ThemeColors>;
  background?: ThemeBackground | null;
  onBackgroundChange?: (value: ThemeBackground | undefined | null) => void;
}

// Default colors for reset functionality
const DEFAULT_THEME_COLORS: Record<ColorKey, string> = {
  primary: "#6366f1",
  accent: "#8b5cf6",
  heading: "#ffffff",
  text: "#f1f5f9",
  cardBackground: "#ffffff",
  background: "none",
  smartLayout: "#6366f1",
};

export function ColorSettingsPanel({
  colors,
  onColorChange,
  defaultColors = DEFAULT_THEME_COLORS,
  background,
  onBackgroundChange,
}: ColorSettingsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Theme Palette Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Theme palette</h3>
        <ColorInputField
          label="Primary Color"
          color={colors.primary}
          onChange={(color) => onColorChange("primary", color)}
          defaultColor={defaultColors.primary ?? DEFAULT_THEME_COLORS.primary}
        />
        <ColorInputField
          label="Secondary Colors (optional)"
          color={colors.accent}
          onChange={(color) => onColorChange("accent", color)}
          defaultColor={defaultColors.accent ?? DEFAULT_THEME_COLORS.accent}
        />
      </section>

      {/* Text Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Text</h3>
        <ColorInputField
          label="Heading color"
          color={colors.heading}
          onChange={(color) => onColorChange("heading", color)}
          defaultColor={defaultColors.heading ?? DEFAULT_THEME_COLORS.heading}
        />
        <ColorInputField
          label="Body color"
          color={colors.text}
          onChange={(color) => onColorChange("text", color)}
          defaultColor={defaultColors.text ?? DEFAULT_THEME_COLORS.text}
        />
      </section>

      {/* Smart Layout Section (optional) */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Smart Layout</h3>
        <ColorInputField
          label="Smart layout "
          color={colors.smartLayout}
          onChange={(color) => onColorChange("smartLayout", color)}
          defaultColor={
            defaultColors.smartLayout ?? DEFAULT_THEME_COLORS.smartLayout
          }
        />
      </section>

      {/* Background Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Background</h3>
        <ColorInputField
          label="Content Background"
          color={colors.cardBackground}
          onChange={(color) => onColorChange("cardBackground", color)}
          defaultColor={
            defaultColors.cardBackground ?? DEFAULT_THEME_COLORS.cardBackground
          }
        />

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Slide background
          </label>

          <ColorInputField
            color={colors.background}
            onChange={(color) => onColorChange("background", color)}
            defaultColor={
              defaultColors.background ?? DEFAULT_THEME_COLORS.background
            }
            onReset={() => {
              onColorChange("background", "none");
            }}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm text-muted-foreground">
            Page background
          </label>

          <CompactBackgroundSelector
            value={background}
            onChange={onBackgroundChange}
          />
        </div>
      </section>
    </div>
  );
}

interface ColorInputFieldProps {
  label?: string;
  labelClassName?: string;
  color: string;
  onChange: (color: string) => void;
  defaultColor: string;
  onReset?: () => void;
}

function ColorInputField({
  label,
  labelClassName,
  color,
  onChange,
  defaultColor,
  onReset,
}: ColorInputFieldProps) {
  const [inputValue, setInputValue] = useState(color);
  const lastExternalColor = useRef(color);

  // Update input when external color changes
  if (lastExternalColor.current !== color) {
    lastExternalColor.current = color;
    setInputValue(color);
  }

  const debouncedOnChange = useMemo(
    () => debounce((val: string) => onChange(val), 100),
    [onChange],
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      const hexPattern = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const normalizedValue = value.startsWith("#") ? value : `#${value}`;
      if (hexPattern.test(normalizedValue)) {
        debouncedOnChange(normalizedValue);
      }
    },
    [debouncedOnChange],
  );

  const handleInputBlur = useCallback(() => {
    setInputValue(color);
  }, [color]);

  const handlePickerChange = useCallback(
    (newColor: string) => {
      setInputValue(newColor);
      debouncedOnChange(newColor);
    },
    [debouncedOnChange],
  );

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onChange(defaultColor);
      setInputValue(defaultColor);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label
          className={`text-sm text-muted-foreground ${labelClassName ?? ""}`}
        >
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-2">
        <ColorPicker value={color} onChange={handlePickerChange} />

        <Input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleInputBlur}
          onFocus={(e) => e.target.select()}
          className="flex-1 border-0 bg-transparent px-2 py-1 font-mono text-sm shadow-none focus-visible:ring-0"
          placeholder="#000000"
        />

        <button
          type="button"
          onClick={handleReset}
          className="shrink-0 p-2 text-muted-foreground transition-colors hover:text-foreground"
          title="Reset to default"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>
    </div>
  );
}
