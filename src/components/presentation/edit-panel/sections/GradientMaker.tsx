"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ColorPicker from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Check,
  Layers,
  MoveDown,
  MoveUp,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

interface GradientLayer {
  id: string;
  type: "linear" | "radial";
  direction: number; // linear (deg)
  shape: "circle" | "ellipse"; // radial
  position: string; // radial preset position
  size:
    | "closest-side"
    | "closest-corner"
    | "farthest-side"
    | "farthest-corner"
    | "custom";
  customRadius: { x: number; y: number };
  positionX: number;
  positionY: number;
  useCustomPosition: boolean;
  colorStops: ColorStop[];
  opacity: number; // 0-100
  blendMode: string;
}

const defaultLayer: Omit<GradientLayer, "id"> = {
  type: "linear",
  direction: 90,
  shape: "circle",
  position: "center",
  size: "farthest-corner",
  customRadius: { x: 50, y: 50 },
  positionX: 50,
  positionY: 50,
  useCustomPosition: false,
  opacity: 100,
  blendMode: "normal",
  colorStops: [
    { id: "1", color: "#ff0000", position: 0 },
    { id: "2", color: "#0000ff", position: 100 },
  ],
};

const radialPositions = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
  "top left",
  "top right",
  "bottom left",
  "bottom right",
];

const radialSizes = [
  { value: "closest-side", label: "Closest Side" },
  { value: "closest-corner", label: "Closest Corner" },
  { value: "farthest-side", label: "Farthest Side" },
  { value: "farthest-corner", label: "Farthest Corner" },
  { value: "custom", label: "Custom Size" },
];

const blendModes = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
];

export function GradientMaker({
  onApply,
  onClose,
}: {
  onApply?: (cssBackground: string, blendModes?: string) => void;
  onClose?: () => void;
}) {
  const [layers, setLayers] = useState<GradientLayer[]>([
    { ...defaultLayer, id: "layer-1" },
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>("layer-1");
  const { toast } = useToast();

  const activeLayer =
    layers.find((layer) => layer.id === activeLayerId) || layers[0]!;

  const generateLayerCSS = useCallback((layer: GradientLayer) => {
    const {
      type,
      direction,
      shape,
      position,
      size,
      customRadius,
      positionX,
      positionY,
      useCustomPosition,
      colorStops,
    } = layer;
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const colorString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (type === "linear") {
      return `linear-gradient(${direction}deg, ${colorString})`;
    }
    let sizeString = "";
    if (size === "custom") {
      sizeString =
        shape === "circle"
          ? `${customRadius.x}px`
          : `${customRadius.x}px ${customRadius.y}px`;
    } else {
      sizeString = size;
    }
    const pos = useCustomPosition
      ? `at ${positionX}% ${positionY}%`
      : `at ${position}`;
    return `radial-gradient(${shape} ${sizeString} ${pos}, ${colorString})`;
  }, []);

  const generateBackgroundImage = useCallback(() => {
    return layers.map((layer) => generateLayerCSS(layer)).join(", ");
  }, [layers, generateLayerCSS]);

  const backgroundBlendModes = layers.map((l) => l.blendMode).join(", ");

  const _copyCSS = async () => {
    const cssLines: string[] = [];
    cssLines.push(`background: ${generateBackgroundImage()};`);
    if (backgroundBlendModes && /[^,]*[^n]ormal/.test(backgroundBlendModes)) {
      cssLines.push(`background-blend-mode: ${backgroundBlendModes};`);
    }
    const cssString = cssLines.join("\n");
    try {
      await navigator.clipboard.writeText(cssString);
      toast({
        title: "CSS copied!",
        description: "Background CSS copied to clipboard.",
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy CSS.",
        variant: "destructive",
      });
    }
  };

  const applyToBackground = () => {
    if (onApply) onApply(generateBackgroundImage(), backgroundBlendModes);
    toast({
      title: "Applied",
      description: "Background applied to presentation.",
    });
    onClose?.();
  };

  const addLayer = () => {
    const newId = `layer-${Date.now()}`;
    const newLayer: GradientLayer = {
      ...defaultLayer,
      id: newId,
      colorStops: [
        { id: `${newId}-1`, color: "#ffffff", position: 0 },
        { id: `${newId}-2`, color: "#000000", position: 100 },
      ],
    };
    setLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(newId);
  };

  const removeLayer = (layerId: string) => {
    if (layers.length <= 1) {
      toast({
        title: "Cannot remove layer",
        description: "At least one layer is required.",
        variant: "destructive",
      });
      return;
    }
    setLayers((prev) => prev.filter((l) => l.id !== layerId));
    if (activeLayerId === layerId)
      setActiveLayerId(
        layers.find((l) => l.id !== layerId)?.id || layers[0]!.id,
      );
  };

  const moveLayer = (layerId: string, dir: "up" | "down") => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === layerId);
      if (idx === -1) return prev;
      const to = dir === "up" ? idx - 1 : idx + 1;
      if (to < 0 || to >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(idx, 1);
      copy.splice(to, 0, moved!);
      return copy;
    });
  };

  const updateActiveLayer = (updates: Partial<GradientLayer>) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === activeLayerId ? { ...l, ...updates } : l)),
    );
  };

  const addColorStop = () => {
    const newId = Date.now().toString();
    const newPos =
      activeLayer.colorStops.length > 0
        ? Math.min(
            Math.max(...activeLayer.colorStops.map((s) => s.position)) + 10,
            100,
          )
        : 50;
    updateActiveLayer({
      colorStops: [
        ...activeLayer.colorStops,
        { id: newId, color: "#ffffff", position: newPos },
      ],
    });
  };
  const removeColorStop = (id: string) => {
    if (activeLayer.colorStops.length <= 2) {
      toast({
        title: "Cannot remove color stop",
        description: "A gradient requires at least two stops.",
        variant: "destructive",
      });
      return;
    }
    updateActiveLayer({
      colorStops: activeLayer.colorStops.filter((s) => s.id !== id),
    });
  };
  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    updateActiveLayer({
      colorStops: activeLayer.colorStops.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" /> Background Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="h-64 w-full rounded-lg border"
            style={{ background: generateBackgroundImage() }}
          />
          <div className="flex gap-2">
            <Button
              onClick={applyToBackground}
              size="sm"
              variant="default"
              className="w-full"
            >
              <Check className="mr-2 h-4 w-4" /> Save Background
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Layer Controls</CardTitle>
          <Button
            onClick={() => {
              setLayers([{ ...defaultLayer, id: "layer-1" }]);
              setActiveLayerId("layer-1");
            }}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset All
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Gradient Layers ({layers.length})</Label>
              <Button onClick={addLayer} size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Layer
              </Button>
            </div>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {layers.map((layer, index) => (
                <div
                  key={layer.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-colors ${activeLayerId === layer.id ? "border-primary bg-primary/10" : "hover:bg-muted/50"}`}
                  onClick={() => setActiveLayerId(layer.id)}
                >
                  <div
                    className="h-6 w-6 rounded border"
                    style={{ background: generateLayerCSS(layer) }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      Layer {index + 1} ({layer.type})
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {layer.opacity}% opacity • {layer.blendMode}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayer(layer.id, "up");
                      }}
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      disabled={index === 0}
                    >
                      <MoveUp className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayer(layer.id, "down");
                      }}
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      disabled={index === layers.length - 1}
                    >
                      <MoveDown className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLayer(layer.id);
                      }}
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Editing: Layer{" "}
              {layers.findIndex((l) => l.id === activeLayerId) + 1}
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Opacity ({activeLayer.opacity}%)</Label>
                <Slider
                  value={[activeLayer.opacity]}
                  onValueChange={([v]) => updateActiveLayer({ opacity: v })}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Blend Mode</Label>
                <Select
                  value={activeLayer.blendMode}
                  onValueChange={(v) => updateActiveLayer({ blendMode: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blendModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs
              value={activeLayer.type}
              onValueChange={(v) =>
                updateActiveLayer({ type: v as "linear" | "radial" })
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="linear">Linear</TabsTrigger>
                <TabsTrigger value="radial">Radial</TabsTrigger>
              </TabsList>

              <TabsContent value="linear" className="space-y-4">
                <div className="space-y-2">
                  <Label>Direction ({activeLayer.direction}°)</Label>
                  <Slider
                    value={[activeLayer.direction]}
                    onValueChange={([v]) => updateActiveLayer({ direction: v })}
                    max={360}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </TabsContent>

              <TabsContent value="radial" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Shape</Label>
                    <Select
                      value={activeLayer.shape}
                      onValueChange={(v) =>
                        updateActiveLayer({ shape: v as "circle" | "ellipse" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circle">Circle</SelectItem>
                        <SelectItem value="ellipse">Ellipse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Select
                      value={activeLayer.size}
                      onValueChange={(v) =>
                        updateActiveLayer({ size: v as GradientLayer["size"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {radialSizes.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {activeLayer.size === "custom" && (
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <Label className="text-sm font-medium">Custom Radius</Label>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">
                          {activeLayer.shape === "circle"
                            ? "Radius"
                            : "X Radius"}{" "}
                          ({activeLayer.customRadius.x}px)
                        </Label>
                        <Slider
                          value={[activeLayer.customRadius.x]}
                          onValueChange={([v]) =>
                            updateActiveLayer({
                              customRadius: {
                                ...activeLayer.customRadius,
                                x: v!,
                              },
                            })
                          }
                          max={500}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                      </div>
                      {activeLayer.shape === "ellipse" && (
                        <div className="space-y-2">
                          <Label className="text-xs">
                            Y Radius ({activeLayer.customRadius.y}px)
                          </Label>
                          <Slider
                            value={[activeLayer.customRadius.y]}
                            onValueChange={([v]) =>
                              updateActiveLayer({
                                customRadius: {
                                  ...activeLayer.customRadius,
                                  y: v!,
                                },
                              })
                            }
                            max={500}
                            min={10}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Position</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateActiveLayer({
                          useCustomPosition: !activeLayer.useCustomPosition,
                        })
                      }
                    >
                      {activeLayer.useCustomPosition
                        ? "Use Presets"
                        : "Custom Position"}
                    </Button>
                  </div>
                  {activeLayer.useCustomPosition ? (
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="space-y-2">
                        <Label className="text-xs">
                          X Position ({activeLayer.positionX}%)
                        </Label>
                        <Slider
                          value={[activeLayer.positionX]}
                          onValueChange={([v]) =>
                            updateActiveLayer({ positionX: v })
                          }
                          max={100}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">
                          Y Position ({activeLayer.positionY}%)
                        </Label>
                        <Slider
                          value={[activeLayer.positionY]}
                          onValueChange={([v]) =>
                            updateActiveLayer({ positionY: v })
                          }
                          max={100}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <Select
                      value={activeLayer.position}
                      onValueChange={(v) => updateActiveLayer({ position: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {radialPositions.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Color Stops</Label>
                <Button onClick={addColorStop} size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add Color
                </Button>
              </div>
              <div className="space-y-3">
                {activeLayer.colorStops
                  .sort((a, b) => a.position - b.position)
                  .map((stop) => (
                    <div
                      key={stop.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <ColorPicker
                          value={stop.color}
                          onChange={(c) =>
                            updateColorStop(stop.id, { color: c })
                          }
                        >
                          <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            style={{ backgroundColor: stop.color }}
                          />
                        </ColorPicker>
                        <Input
                          value={stop.color}
                          onChange={(e) =>
                            updateColorStop(stop.id, { color: e.target.value })
                          }
                          className="flex-1 font-mono text-sm"
                          placeholder="#ffffff"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {stop.position}%
                        </Badge>
                        <div className="w-20">
                          <Slider
                            value={[stop.position]}
                            onValueChange={([v]) =>
                              updateColorStop(stop.id, { position: v })
                            }
                            max={100}
                            min={0}
                            step={1}
                          />
                        </div>
                        <Button
                          onClick={() => removeColorStop(stop.id)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export type { GradientLayer };
