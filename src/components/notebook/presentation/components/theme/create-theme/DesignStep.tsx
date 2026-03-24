"use client";

import { cn } from "@/lib/utils";
import { Shapes } from "lucide-react";
import { type Control, type UseFormSetValue, useWatch } from "react-hook-form";
import { type ThemeFormValues } from "../types";
import { type DesignStyle } from "./create-theme-types";

const designStyles: {
  id: DesignStyle;
  name: string;
  description: string;
  preview: string;
  innerPreview: string;
}[] = [
  {
    id: "standard",
    name: "Standard",
    description: "Small border radius with minimal shadow-sm",
    preview: "rounded-lg shadow-xs",
    innerPreview: "rounded-md shadow-xs",
  },
  {
    id: "flat",
    name: "Flat",
    description: "No shadow-sm and no border radius",
    preview: "rounded-none shadow-none",
    innerPreview: "rounded-none shadow-none",
  },
  {
    id: "outline",
    name: "Outline",
    description: "Outline-like effect using shadow-sm",
    preview: "rounded-none shadow-[0_0_0_2px_rgba(37,99,235,1)]",
    innerPreview: "rounded-none shadow-[0_0_0_2px_rgba(37,99,235,1)]",
  },
  {
    id: "blocky",
    name: "Blocky",
    description: "3D effect using unblurred box shadow-sm",
    preview: "rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]",
    innerPreview: "rounded-none shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]",
  },
  {
    id: "rounded",
    name: "Rounded",
    description: "Just rounded with gentle shadows",
    preview: "rounded-3xl shadow-xs",
    innerPreview: "rounded-full shadow-xs",
  },
];

interface DesignStepProps {
  setValue: UseFormSetValue<ThemeFormValues>;
  control: Control<ThemeFormValues>;
}

export function DesignStep({ setValue, control }: DesignStepProps) {
  // Use useWatch instead of watch() to properly subscribe to form changes
  const currentCardRadius = useWatch({ control, name: "borderRadius.card" });
  const currentCardShadow = useWatch({ control, name: "shadows.card" });

  // Helper to determine selected style based on current values
  const getSelectedStyle = () => {
    // Flat: no radius, no shadow
    if (currentCardRadius === "0" && currentCardShadow === "none")
      return "flat";

    // Outline: no radius, outline shadow
    if (currentCardRadius === "0" && currentCardShadow?.includes("0 0 0 2px"))
      return "outline";

    // Blocky: no radius, hard 3D shadow
    if (currentCardRadius === "0" && currentCardShadow?.includes("4px 4px 0 0"))
      return "blocky";

    // Rounded: large radius
    if (currentCardRadius === "1.5rem") return "rounded";

    // Standard: small radius with minimal shadow
    if (currentCardRadius === "0.5rem") return "standard";

    return "standard";
  };

  const selectedStyle = getSelectedStyle();

  const handleStyleSelect = (styleId: DesignStyle) => {
    const options = { shouldDirty: true };
    // Map style ID to actual theme values
    switch (styleId) {
      case "standard":
        // Small border radius with minimal shadow
        setValue("borderRadius.card", "0.5rem", options);
        setValue("borderRadius.slide", "0.5rem", options);
        setValue("borderRadius.button", "0.375rem", options);
        setValue("shadows.card", "0 1px 3px rgba(0,0,0,0.05)", options);
        setValue("shadows.button", "0 1px 2px rgba(0,0,0,0.03)", options);
        setValue("shadows.slide", "0 2px 4px rgba(0,0,0,0.04)", options);
        break;
      case "flat":
        // No shadow and no border radius
        setValue("borderRadius.card", "0", options);
        setValue("borderRadius.slide", "0", options);
        setValue("borderRadius.button", "0", options);
        setValue("shadows.card", "none", options);
        setValue("shadows.button", "none", options);
        setValue("shadows.slide", "none", options);
        break;
      case "outline":
        // Outline-like effect using shadow
        setValue("borderRadius.card", "0", options);
        setValue("borderRadius.slide", "0", options);
        setValue("borderRadius.button", "0", options);
        setValue("shadows.card", "0 0 0 2px currentColor", options);
        setValue("shadows.button", "0 0 0 2px currentColor", options);
        setValue("shadows.slide", "0 0 0 2px currentColor", options);
        break;
      case "blocky":
        // 3D effect using box shadow (not blurred)
        setValue("borderRadius.card", "0", options);
        setValue("borderRadius.slide", "0", options);
        setValue("borderRadius.button", "0", options);
        setValue("shadows.card", "4px 4px 0 0 rgba(0,0,0,0.2)", options);
        setValue("shadows.button", "3px 3px 0 0 rgba(0,0,0,0.2)", options);
        setValue("shadows.slide", "6px 6px 0 0 rgba(0,0,0,0.15)", options);
        break;
      case "rounded":
        // Just rounded
        setValue("borderRadius.card", "1.5rem", options);
        setValue("borderRadius.slide", "2rem", options);
        setValue("borderRadius.button", "9999px", options);
        setValue("shadows.card", "0 1px 3px rgba(0,0,0,0.05)", options);
        setValue("shadows.button", "0 1px 2px rgba(0,0,0,0.03)", options);
        setValue("shadows.slide", "0 2px 4px rgba(0,0,0,0.04)", options);
        break;
      default:
        // Default to standard
        setValue("borderRadius.card", "0.5rem", options);
        setValue("borderRadius.slide", "0.5rem", options);
        setValue("borderRadius.button", "0.375rem", options);
        setValue("shadows.card", "0 1px 3px rgba(0,0,0,0.05)", options);
        setValue("shadows.button", "0 1px 2px rgba(0,0,0,0.03)", options);
        setValue("shadows.slide", "0 2px 4px rgba(0,0,0,0.04)", options);
        break;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-6">
        <div className="text-center">
          <Shapes className="mx-auto mb-4 h-12 w-12 text-blue-600" />
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            Choose a style for your content
          </h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4">
          {designStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleStyleSelect(style.id)}
              className={cn(
                "rounded-xl border-2 bg-card p-6 text-left transition-all hover:border-muted-foreground/50",
                selectedStyle === style.id
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/20"
                  : "border-border",
              )}
            >
              <div className="flex items-center gap-6">
                {/* Preview box */}
                <div
                  className={cn(
                    "flex h-16 w-24 items-center justify-center border border-border/50 bg-background",
                    style.preview,
                  )}
                >
                  <div
                    className={cn("h-8 w-12 bg-muted", style.innerPreview)}
                  />
                </div>

                {/* Style info */}
                <div className="flex-1">
                  <h4 className="mb-1 text-lg font-semibold text-foreground">
                    {style.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {style.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
