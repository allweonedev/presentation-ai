"use client";

import { CompactBackgroundSelector } from "@/components/notebook/presentation/components/theme/create-theme/CompactBackgroundSelector";
import { Button } from "@/components/ui/button";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import { type ThemeBackground } from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { RotateCcw } from "lucide-react";
import { useCallback, useMemo } from "react";

function isGradientString(input?: string | null) {
  if (!input) return false;
  const v = input.toLowerCase().trim();
  return v.startsWith("linear-gradient") || v.startsWith("radial-gradient");
}

function isImageString(input?: string | null) {
  if (!input) return false;
  return input.trim().startsWith("url(");
}

export function PageBackgroundSection() {
  const pageBackground = usePresentationState((s) => s.pageBackground);
  const setPageBackground = usePresentationState((s) => s.setPageBackground);
  const { save } = useDebouncedSave({ delay: 800 });

  const backgroundValue = useMemo<ThemeBackground | null>(() => {
    const override = pageBackground?.backgroundOverride as string | undefined;
    const type = pageBackground?.backgroundType as
      | ThemeBackground["type"]
      | undefined;
    const gradient =
      pageBackground?.backgroundGradient as ThemeBackground["gradient"];
    const imageUrl = pageBackground?.backgroundImageUrl as string | undefined;

    if (!override && !type && !gradient && !imageUrl) return null;

    if (type === "image" || isImageString(override)) {
      return { type: "image", override, imageUrl };
    }

    if (type === "linear" || type === "radial") {
      return { type, override, gradient };
    }

    if (type === "solid") {
      return { type: "solid", override };
    }

    if (isGradientString(override)) {
      const derivedType = override?.startsWith("radial-gradient")
        ? "radial"
        : "linear";
      return { type: derivedType, override, gradient };
    }

    if (override) {
      return { type: "solid", override };
    }

    return null;
  }, [pageBackground]);

  const applyBackground = useCallback(
    (value: ThemeBackground | undefined | null) => {
      const prev = (pageBackground ?? {}) as Record<string, unknown>;
      const next = { ...prev };

      delete next.backgroundOverride;
      delete next.backgroundType;
      delete next.backgroundGradient;
      delete next.backgroundImageUrl;

      if (value) {
        if (value.type) next.backgroundType = value.type;
        if (value.override) next.backgroundOverride = value.override;
        if (value.type === "linear" || value.type === "radial") {
          if (value.gradient) next.backgroundGradient = value.gradient;
        }
        if (value.type === "image") {
          if (value.imageUrl) next.backgroundImageUrl = value.imageUrl;
        }
      }

      setPageBackground(next);
      save();
    },
    [pageBackground, save, setPageBackground],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Page background
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={() => applyBackground(null)}
        >
          <RotateCcw className="mr-1 h-3.5 w-3.5" />
          Reset
        </Button>
      </div>
      <CompactBackgroundSelector
        value={backgroundValue}
        onChange={applyBackground}
      />
    </div>
  );
}
