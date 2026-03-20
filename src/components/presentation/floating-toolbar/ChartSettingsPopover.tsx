"use client";

import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";

import { ToolbarButton, ToolbarGroup } from "@/components/plate/ui/toolbar";
import { DebouncedInput } from "@/components/ui/debounced-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToolbarContext } from "./ToolbarContext";

// Type definition for axis configuration
interface AxisConfig {
  title?: string | { text?: string; enabled?: boolean };
  label?: { enabled?: boolean };
  gridLine?: { enabled?: boolean };
}

export function ChartSettingsPopover() {
  const {
    element,
    elementType,
    handleNodePropertyUpdate,
    isCurrentElementChart,
  } = useToolbarContext();

  if (!isCurrentElementChart) {
    return null;
  }

  // Get current values from element
  const title = (element as { title?: { text?: string } })?.title?.text ?? "";
  const subtitle =
    (element as { subtitle?: { text?: string } })?.subtitle?.text ?? "";

  // Get per-axis configuration
  const xAxisConfig = (element as { xAxis?: AxisConfig })?.xAxis ?? {};
  const yAxisConfig = (element as { yAxis?: AxisConfig })?.yAxis ?? {};

  const normalizeTitle = (title?: AxisConfig["title"]) =>
    typeof title === "string" ? { text: title } : (title ?? {});

  // Legacy fallbacks
  const showGrid = (element as { showGrid?: boolean })?.showGrid ?? true;
  const showAxisLabels =
    (element as { showAxisLabels?: boolean })?.showAxisLabels ?? true;

  // Per-axis values with fallback to legacy
  const xAxisTitleConfig = normalizeTitle(xAxisConfig.title);
  const xAxisTitleEnabled =
    xAxisTitleConfig.enabled ?? Boolean(xAxisTitleConfig.text);
  const xAxisTitle = xAxisTitleConfig.text ?? "";
  const xAxisLabelEnabled = xAxisConfig.label?.enabled ?? showAxisLabels;
  const xAxisGridEnabled = xAxisConfig.gridLine?.enabled ?? false;

  const yAxisTitleConfig = normalizeTitle(yAxisConfig.title);
  const yAxisTitleEnabled =
    yAxisTitleConfig.enabled ?? Boolean(yAxisTitleConfig.text);
  const yAxisTitle = yAxisTitleConfig.text ?? "";
  const yAxisLabelEnabled = yAxisConfig.label?.enabled ?? showAxisLabels;
  const yAxisGridEnabled = yAxisConfig.gridLine?.enabled ?? showGrid;

  // Animation settings
  const animationEnabled =
    (element as { disableAnimation?: boolean })?.disableAnimation === false ||
    (element as { animation?: { enabled?: boolean } })?.animation?.enabled ===
      true;
  const animationDuration =
    (element as { animation?: { duration?: number } })?.animation?.duration ??
    500;

  // Legend settings
  const legendEnabled =
    (element as { showLegend?: boolean })?.showLegend ??
    (element as { legend?: { enabled?: boolean } })?.legend?.enabled ??
    true;
  const legendPosition =
    (element as { legend?: { position?: string } })?.legend?.position ??
    "bottom";

  // Background settings
  const backgroundFill =
    (element as { background?: { fill?: string } })?.background?.fill ?? "";
  const backgroundVisible =
    (element as { background?: { visible?: boolean } })?.background?.visible ??
    false;

  // Check if chart type supports axes (not applicable to pie/donut/gauge/etc)
  const supportsAxes = ![
    "chart-pie",
    "chart-donut",
    "chart-radar",
    "chart-radial-bar",
    "chart-nightingale",
    "chart-radial-column",
    "chart-sunburst",
    "chart-sankey",
    "chart-chord",
    "chart-funnel",
    "chart-cone-funnel",
    "chart-pyramid",
    "chart-radial-gauge",
    "chart-linear-gauge",
    "chart-treemap",
  ].includes(elementType);

  // Check if this is a donut chart (for inner labels)
  const isDonutChart = elementType === "chart-donut";

  // Donut inner labels configuration
  type InnerLabelConfig = {
    text: string;
    fontWeight?: "normal" | "bold";
    fontSize?: number;
    color?: string;
    spacing?: number;
  };
  const innerLabels =
    (element as { innerLabels?: InnerLabelConfig[] })?.innerLabels ?? [];
  const innerCircleFill =
    (element as { innerCircle?: { fill?: string } })?.innerCircle?.fill ?? "";
  const innerRadiusRatio =
    (element as { innerRadiusRatio?: number })?.innerRadiusRatio ?? 0.7;

  // Get first two inner labels for UI (title and value)
  const innerLabelTitle = innerLabels[0]?.text ?? "";
  const innerLabelValue = innerLabels[1]?.text ?? "";

  // Handlers for nested object updates
  const updateTitle = (text: string) => {
    handleNodePropertyUpdate("title", { text });
  };

  const updateSubtitle = (text: string) => {
    handleNodePropertyUpdate("subtitle", { text });
  };

  // Update X-axis settings
  const updateXAxis = (updates: Partial<AxisConfig>) => {
    const nextTitle = normalizeTitle(
      updates.title ?? xAxisConfig.title ?? undefined,
    );
    handleNodePropertyUpdate("xAxis", {
      ...xAxisConfig,
      ...updates,
      label: {
        ...xAxisConfig.label,
        ...updates.label,
      },
      gridLine: {
        ...xAxisConfig.gridLine,
        ...updates.gridLine,
      },
      title:
        updates.title !== undefined
          ? nextTitle
          : (xAxisConfig.title ?? nextTitle),
    });
  };

  // Update Y-axis settings
  const updateYAxis = (updates: Partial<AxisConfig>) => {
    const nextTitle = normalizeTitle(
      updates.title ?? yAxisConfig.title ?? undefined,
    );
    handleNodePropertyUpdate("yAxis", {
      ...yAxisConfig,
      ...updates,
      label: {
        ...yAxisConfig.label,
        ...updates.label,
      },
      gridLine: {
        ...yAxisConfig.gridLine,
        ...updates.gridLine,
      },
      title:
        updates.title !== undefined
          ? nextTitle
          : (yAxisConfig.title ?? nextTitle),
    });
  };

  const updateAnimation = (enabled: boolean, duration?: number) => {
    // Update both disableAnimation (backward compat) and animation object
    handleNodePropertyUpdate("disableAnimation", !enabled);
    handleNodePropertyUpdate("animation", {
      enabled,
      duration: duration ?? animationDuration,
    });
  };

  const updateLegend = (enabled: boolean, position?: string) => {
    // Update both showLegend (backward compat) and legend object
    handleNodePropertyUpdate("showLegend", enabled);
    handleNodePropertyUpdate("legend", {
      enabled,
      position: position ?? legendPosition,
    });
  };

  const updateBackground = (fill: string, visible?: boolean) => {
    handleNodePropertyUpdate("background", {
      fill,
      visible: visible ?? backgroundVisible,
    });
  };

  const updateInnerLabels = (titleText: string, valueText: string) => {
    const newLabels: InnerLabelConfig[] = [];
    if (titleText) {
      newLabels.push({
        text: titleText,
        fontWeight: "bold",
      });
    }
    if (valueText) {
      newLabels.push({
        text: valueText,
        spacing: 4,
        fontSize: 32,
      });
    }
    handleNodePropertyUpdate("innerLabels", newLabels);
  };

  return (
    <ToolbarGroup>
      <Popover>
        <PopoverTrigger asChild>
          <ToolbarButton tooltip="Chart Settings" size="sm">
            <Settings className="h-4 w-4" />
          </ToolbarButton>
        </PopoverTrigger>
        <PopoverContent
          className="ignore-click-outside/toolbar max-h-[70vh] w-80 overflow-y-auto"
          align="start"
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Chart Settings</h4>
              <p className="text-sm text-muted-foreground">
                Configure chart appearance
              </p>
            </div>

            {/* Title Section */}
            <div className="grid gap-2">
              <Label htmlFor="chart-title">Title</Label>
              <DebouncedInput
                id="chart-title"
                placeholder="Chart title"
                value={title}
                onChange={(value) => updateTitle(String(value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="chart-subtitle">Subtitle</Label>
              <DebouncedInput
                id="chart-subtitle"
                placeholder="Chart subtitle"
                value={subtitle}
                onChange={(value) => updateSubtitle(String(value))}
              />
            </div>

            {/* X-Axis Section - Only for applicable charts */}
            {supportsAxes && (
              <div className="space-y-3 rounded-lg border p-3">
                <h5 className="text-sm font-medium">X-Axis</h5>

                <div className="flex items-center justify-between">
                  <Label htmlFor="x-axis-labels" className="text-xs">
                    Show Labels
                  </Label>
                  <Switch
                    id="x-axis-labels"
                    checked={xAxisLabelEnabled}
                    onCheckedChange={(checked) =>
                      updateXAxis({ label: { enabled: checked } })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="x-axis-grid" className="text-xs">
                    Show Grid Lines
                  </Label>
                  <Switch
                    id="x-axis-grid"
                    checked={xAxisGridEnabled}
                    onCheckedChange={(checked) =>
                      updateXAxis({ gridLine: { enabled: checked } })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="x-axis-title-enabled" className="text-xs">
                    Show Title
                  </Label>
                  <Switch
                    id="x-axis-title-enabled"
                    checked={xAxisTitleEnabled}
                    onCheckedChange={(checked) =>
                      updateXAxis({
                        title: { ...xAxisTitleConfig, enabled: checked },
                      })
                    }
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="x-axis-title" className="text-xs">
                    Title
                  </Label>
                  <DebouncedInput
                    id="x-axis-title"
                    placeholder="X-axis title"
                    value={xAxisTitle}
                    disabled={!xAxisTitleEnabled}
                    onChange={(value) =>
                      updateXAxis({
                        title: { ...xAxisTitleConfig, text: String(value) },
                      })
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Y-Axis Section - Only for applicable charts */}
            {supportsAxes && (
              <div className="space-y-3 rounded-lg border p-3">
                <h5 className="text-sm font-medium">Y-Axis</h5>

                <div className="flex items-center justify-between">
                  <Label htmlFor="y-axis-labels" className="text-xs">
                    Show Labels
                  </Label>
                  <Switch
                    id="y-axis-labels"
                    checked={yAxisLabelEnabled}
                    onCheckedChange={(checked) =>
                      updateYAxis({ label: { enabled: checked } })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="y-axis-grid" className="text-xs">
                    Show Grid Lines
                  </Label>
                  <Switch
                    id="y-axis-grid"
                    checked={yAxisGridEnabled}
                    onCheckedChange={(checked) =>
                      updateYAxis({ gridLine: { enabled: checked } })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="y-axis-title-enabled" className="text-xs">
                    Show Title
                  </Label>
                  <Switch
                    id="y-axis-title-enabled"
                    checked={yAxisTitleEnabled}
                    onCheckedChange={(checked) =>
                      updateYAxis({
                        title: { ...yAxisTitleConfig, enabled: checked },
                      })
                    }
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="y-axis-title" className="text-xs">
                    Title
                  </Label>
                  <DebouncedInput
                    id="y-axis-title"
                    placeholder="Y-axis title"
                    value={yAxisTitle}
                    disabled={!yAxisTitleEnabled}
                    onChange={(value) =>
                      updateYAxis({
                        title: { ...yAxisTitleConfig, text: String(value) },
                      })
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Animation Section - Uses grid-rows for smooth transition */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="animation-toggle">Animation</Label>
                <Switch
                  id="animation-toggle"
                  checked={animationEnabled}
                  onCheckedChange={(checked) => updateAnimation(checked)}
                />
              </div>

              <div
                className={cn(
                  "rounded-lg border p-3 transition-opacity",
                  !animationEnabled && "opacity-50",
                )}
                aria-disabled={!animationEnabled}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="animation-duration">Duration</Label>
                  <span className="text-sm text-muted-foreground">
                    {animationDuration}ms
                  </span>
                </div>
                <Slider
                  id="animation-duration"
                  min={100}
                  max={2000}
                  step={100}
                  value={[animationDuration]}
                  disabled={!animationEnabled}
                  onValueChange={([value]) =>
                    updateAnimation(animationEnabled, value)
                  }
                  className="mt-2"
                />
              </div>
            </div>

            {/* Legend Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="legend-toggle">Legend</Label>
                <Switch
                  id="legend-toggle"
                  checked={legendEnabled}
                  onCheckedChange={(checked) => updateLegend(checked)}
                />
              </div>

              <div
                className={cn(
                  "rounded-lg border p-3 transition-opacity",
                  !legendEnabled && "opacity-50",
                )}
                aria-disabled={!legendEnabled}
              >
                <Label htmlFor="legend-position">Legend Position</Label>
                <Select
                  value={legendPosition}
                  disabled={!legendEnabled}
                  onValueChange={(value) => updateLegend(legendEnabled, value)}
                >
                  <SelectTrigger id="legend-position" className="mt-1.5">
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent className="ignore-click-outside/toolbar">
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Background Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="background-toggle">Background</Label>
                <Switch
                  id="background-toggle"
                  checked={backgroundVisible}
                  onCheckedChange={(checked) =>
                    updateBackground(backgroundFill, checked)
                  }
                />
              </div>

              <div
                className={cn(
                  "rounded-lg border p-3 transition-opacity",
                  !backgroundVisible && "opacity-50",
                )}
                aria-disabled={!backgroundVisible}
              >
                <Label htmlFor="background-fill">Background Color</Label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    id="background-fill"
                    type="color"
                    value={backgroundFill || "#ffffff"}
                    disabled={!backgroundVisible}
                    onChange={(e) =>
                      updateBackground(e.target.value, backgroundVisible)
                    }
                    className="h-8 w-12 p-1"
                  />
                  <DebouncedInput
                    value={backgroundFill}
                    disabled={!backgroundVisible}
                    onChange={(value) =>
                      updateBackground(String(value), backgroundVisible)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Inner Labels Section - Only for Donut Charts */}
            {isDonutChart && (
              <div className="space-y-3 rounded-lg border p-3">
                <h5 className="text-sm font-medium">Inner Labels</h5>

                <div className="grid gap-1.5">
                  <Label htmlFor="inner-label-title" className="text-xs">
                    Title
                  </Label>
                  <DebouncedInput
                    id="inner-label-title"
                    placeholder="e.g. Total"
                    value={innerLabelTitle}
                    onChange={(value) =>
                      updateInnerLabels(String(value), innerLabelValue)
                    }
                    className="h-8 text-sm"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="inner-label-value" className="text-xs">
                    Value
                  </Label>
                  <DebouncedInput
                    id="inner-label-value"
                    placeholder="e.g. $100,000"
                    value={innerLabelValue}
                    onChange={(value) =>
                      updateInnerLabels(innerLabelTitle, String(value))
                    }
                    className="h-8 text-sm"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="inner-circle-fill" className="text-xs">
                    Background Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="inner-circle-fill"
                      type="color"
                      value={innerCircleFill || "#f0f0f0"}
                      onChange={(e) =>
                        handleNodePropertyUpdate("innerCircle", {
                          fill: e.target.value,
                        })
                      }
                      className="h-8 w-12 p-1"
                    />
                    <DebouncedInput
                      value={innerCircleFill}
                      onChange={(value) =>
                        handleNodePropertyUpdate("innerCircle", {
                          fill: String(value),
                        })
                      }
                      placeholder="#f0f0f0"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="inner-radius-ratio" className="text-xs">
                    Inner Radius: {Math.round(innerRadiusRatio * 100)}%
                  </Label>
                </div>
                <Slider
                  id="inner-radius-ratio"
                  min={0}
                  max={100}
                  step={5}
                  value={[Math.round(innerRadiusRatio * 100)]}
                  onValueChange={(values) => {
                    const value = values[0];
                    if (value !== undefined) {
                      handleNodePropertyUpdate("innerRadiusRatio", value / 100);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </ToolbarGroup>
  );
}
