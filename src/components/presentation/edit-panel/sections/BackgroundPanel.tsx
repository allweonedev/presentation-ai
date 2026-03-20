"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_COLORS } from "@/components/ui/color-picker";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import {
  themes,
  type ThemeProperties,
  type Themes,
} from "@/lib/presentation/themes";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { Plus, RotateCcw } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { BackgroundImageEditor } from "./BackgroundImageEditor";
import { GradientMaker } from "./GradientMaker";

type GradientType = "solid" | "linear" | "radial";
type GradientStop = { id: string; color: string; position: number };
type BackgroundGradient = {
  type: GradientType;
  angle?: number; // linear
  shape?: "circle" | "ellipse"; // radial
  at?: { x: number; y: number }; // radial position (percent)
  stops: GradientStop[];
};

function isGradientString(input: string | undefined | null) {
  if (!input) return false;
  const v = input.toLowerCase().trim();
  return v.startsWith("linear-gradient") || v.startsWith("radial-gradient");
}

function buildStopsCss(stops: GradientStop[]) {
  return [...stops]
    .sort((a, b) => a.position - b.position)
    .map(
      (s) =>
        `${s.color} ${Math.round(Math.max(0, Math.min(100, s.position)))}%`,
    )
    .join(", ");
}

function toLinearCss(g: Pick<BackgroundGradient, "angle" | "stops">) {
  const angle = Math.round(g.angle ?? 135);
  return `linear-gradient(${angle}deg, ${buildStopsCss(g.stops ?? [])})`;
}

function toRadialCss(g: Pick<BackgroundGradient, "shape" | "at" | "stops">) {
  const shape = g.shape ?? "circle";
  const at = g.at ?? { x: 50, y: 50 };
  return `radial-gradient(${shape} at ${Math.round(at.x)}% ${Math.round(at.y)}%, ${buildStopsCss(g.stops ?? [])})`;
}

export function BackgroundPanel() {
  const { theme, customThemeData, pageBackground, setPageBackground } =
    usePresentationState();
  const { save } = useDebouncedSave({ delay: 800 });

  const baseTheme: ThemeProperties = useMemo(() => {
    if (customThemeData) return customThemeData;
    const key = (theme in themes ? (theme as Themes) : "mystique") as Themes;
    return themes[key];
  }, [customThemeData, theme]);

  const modeColors = baseTheme.colors;

  const updateConfig = useCallback(
    (patch: Record<string, unknown>) => {
      const prev = (pageBackground ?? {}) as Record<string, unknown>;
      setPageBackground({ ...prev, ...patch });
    },
    [pageBackground, setPageBackground],
  );

  const [isMakerOpen, setIsMakerOpen] = useState<boolean>(false);
  // Selected solid color derived from current pageBackground
  const selectedSolid = useMemo(() => {
    const override = pageBackground?.backgroundOverride as string | undefined;
    return isGradientString(override)
      ? modeColors.background
      : (override ?? modeColors.background);
  }, [pageBackground?.backgroundOverride, modeColors.background]);

  const onSolidChange = useCallback(
    (value: string) => {
      updateConfig({ backgroundType: "solid", backgroundOverride: value });
      save();
    },
    [updateConfig, save],
  );

  const onReset = useCallback(() => {
    const prev = (pageBackground ?? {}) as Record<string, unknown>;
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      backgroundOverride: _o,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      backgroundType: _t,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      backgroundGradient: _g,
      ...rest
    } = prev;
    setPageBackground(rest);
    save();
  }, [pageBackground, setPageBackground, save]);

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 border-b border-border bg-card px-4 pb-4">
        <div className="flex gap-2">
          <Button
            onClick={() => setIsMakerOpen(true)}
            className="flex-1"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Custom
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            size="sm"
            className="flex-1 bg-transparent"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="h-full overflow-hidden">
        <Tabs
          defaultValue={
            (pageBackground?.backgroundType as GradientType) || "solid"
          }
          className="flex h-full flex-col"
        >
          <TabsList className="w-full justify-start gap-0 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="solid"
              className="flex-1 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Solid
            </TabsTrigger>
            <TabsTrigger
              value="linear"
              className="flex-1 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Linear
            </TabsTrigger>
            <TabsTrigger
              value="radial"
              className="flex-1 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Radial
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className="flex-1 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Image
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <div className="p-6">
              <TabsContent
                value="solid"
                className="m-0 flex justify-center space-y-4"
              >
                <SolidGrid
                  selected={selectedSolid}
                  onPick={(c) => onSolidChange(c)}
                />
              </TabsContent>
              <TabsContent value="linear" className="m-0">
                <div className="flex justify-center">
                  <LinearJsonGrid
                    onPick={(preset) => {
                      updateConfig({
                        backgroundType: "linear",
                        backgroundGradient: {
                          type: "linear",
                          ...preset.gradient,
                        },
                        backgroundOverride: preset.css,
                      });
                      save();
                    }}
                    count={300}
                  />
                </div>
              </TabsContent>
              <TabsContent value="radial" className="m-0">
                <div className="flex justify-center">
                  <RadialJsonGrid
                    onPick={(preset) => {
                      updateConfig({
                        backgroundType: "radial",
                        backgroundGradient: {
                          type: "radial",
                          ...preset.gradient,
                        },
                        backgroundOverride: preset.css,
                      });
                      save();
                    }}
                    count={300}
                  />
                </div>
              </TabsContent>
              <TabsContent value="image" className="m-0">
                <BackgroundImageEditor
                  config={pageBackground}
                  updateConfig={updateConfig}
                  onApply={() => save()}
                />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </div>

      <Dialog open={isMakerOpen} onOpenChange={setIsMakerOpen}>
        <DialogContent className="max-w-6xl">
          <DialogTitle>Create Custom Background</DialogTitle>
          <div className="mt-4">
            <GradientMaker
              onApply={(css) => {
                updateConfig({ backgroundOverride: css });
                save();
              }}
              onClose={() => setIsMakerOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SolidGrid({
  selected,
  onPick,
  paletteSize = DEFAULT_COLORS.length,
}: {
  selected?: string;
  onPick: (color: string) => void;
  paletteSize?: number;
}) {
  const palette = useMemo(
    () => DEFAULT_COLORS.slice(0, paletteSize),
    [paletteSize],
  );
  return (
    <div className="grid h-full w-max grid-cols-7 place-items-center gap-3">
      {/* Custom color picker as the first grid item */}
      <div className="relative">
        <input
          type="color"
          value={selected ?? "#ffffff"}
          onChange={(e) => onPick(e.target.value)}
          className="absolute size-10 cursor-pointer opacity-0"
          aria-label="Custom color"
          title="Custom color"
        />
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted transition-all hover:scale-110 hover:border-primary hover:bg-primary/10"
        >
          <Plus className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Palette colors as grid items */}
      {palette.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => onPick(c.value)}
          className={cn(
            "size-10 rounded-lg border-2 transition-all hover:scale-110 focus:ring-2 focus:ring-primary focus:ring-offset-2",
            selected === c.value
              ? "border-primary ring-2 ring-primary ring-offset-2"
              : "border-transparent hover:border-primary/50",
          )}
          style={{ background: c.value }}
          aria-label={c.name}
          title={`${c.name} ${c.value}`}
        />
      ))}
    </div>
  );
}

type LinearPreset = {
  css: string;
  gradient: Pick<BackgroundGradient, "angle" | "stops">;
};
type RadialPreset = {
  css: string;
  gradient: Pick<BackgroundGradient, "shape" | "at" | "stops">;
};

type JsonGradient = { name: string; colors: string[] };

async function loadGradients(): Promise<JsonGradient[]> {
  try {
    const mod = await import("./gradient.json");
    const data = (mod?.default ?? []) as unknown;
    const list = Array.isArray(data) ? (data as JsonGradient[]) : [];
    // sanitize: only keep entries with at least one valid color string
    return list.filter(
      (g) =>
        g &&
        Array.isArray(g.colors) &&
        g.colors.some((c) => typeof c === "string" && c.trim().length > 0),
    );
  } catch {
    return [];
  }
}

// Assume JSON colors are valid and present (author-provided)
function normalizeColors(colors: unknown): string[] {
  return colors as string[];
}

function toLinearFromJson(colors: string[], angle: number): LinearPreset {
  const safe = normalizeColors(colors);
  const stops: GradientStop[] = safe.map((c, idx) => ({
    id: `j-${idx}`,
    color: c,
    position: Math.round((idx / (safe.length - 1)) * 100),
  }));
  const gradient = { angle, stops };
  return { css: toLinearCss(gradient), gradient };
}

function toRadialFromJson(colors: string[]): RadialPreset {
  const safe = normalizeColors(colors);
  const stops: GradientStop[] = safe.map((c, idx) => ({
    id: `j-${idx}`,
    color: c,
    position: Math.round((idx / (safe.length - 1)) * 100),
  }));
  const gradient = { shape: "circle" as const, at: { x: 50, y: 50 }, stops };
  return { css: toRadialCss(gradient), gradient };
}

function LinearJsonGrid({
  onPick,
  count = 300,
}: {
  onPick: (preset: LinearPreset) => void;
  count?: number;
}) {
  const [items, setItems] = React.useState<LinearPreset[] | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const json = await loadGradients();
      if (cancelled) return;
      const presets = json
        .slice(0, count)
        .map((g, idx) =>
          toLinearFromJson(g.colors ?? [], 135 + (idx % 4) * 15),
        );
      setItems(presets);
    })();
    return () => {
      cancelled = true;
    };
  }, [count]);

  if (!items) {
    return (
      <div className="grid w-max grid-cols-4 place-items-center gap-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-20 animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid w-max grid-cols-4 place-items-center gap-3">
      {items.map((p, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(p)}
          className="h-16 w-20 rounded-lg border-2 border-border transition-all hover:scale-105 hover:border-primary hover:shadow-md"
          style={{ background: p.css }}
          aria-label={`Linear preset ${i + 1}`}
          title={p.css}
        />
      ))}
    </div>
  );
}

function RadialJsonGrid({
  onPick,
  count = 300,
}: {
  onPick: (preset: RadialPreset) => void;
  count?: number;
}) {
  const [items, setItems] = React.useState<RadialPreset[] | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const json = await loadGradients();
      if (cancelled) return;
      const presets = json
        .slice(0, count)
        .map((g) => toRadialFromJson(g.colors ?? []));
      setItems(presets);
    })();
    return () => {
      cancelled = true;
    };
  }, [count]);

  if (!items) {
    return (
      <div className="grid w-max grid-cols-4 place-items-center gap-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-20 animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid w-max grid-cols-4 place-items-center gap-3">
      {items.map((p, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(p)}
          className="h-16 w-20 rounded-lg border-2 border-border transition-all hover:scale-105 hover:border-primary hover:shadow-md"
          style={{ background: p.css }}
          aria-label={`Radial preset ${i + 1}`}
          title={p.css}
        />
      ))}
    </div>
  );
}
