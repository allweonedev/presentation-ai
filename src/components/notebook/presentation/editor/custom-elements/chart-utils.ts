/**
 * Shared utility functions for chart components
 * Provides consistent key detection and label formatting across all chart types
 */

type AnyRecord = Record<string, unknown>;

/**
 * Find the label/name key in chart data
 * Supports: "label", "name", or first string field
 */
export function getLabelKey(data: unknown[]): string {
  if (data.length === 0) return "label";
  const sample = data[0] as AnyRecord;
  if ("label" in sample) return "label";
  if ("name" in sample) return "name";
  // Fallback: find first string field that isn't a common value key
  const stringKey = Object.keys(sample).find(
    (key) =>
      typeof sample[key] === "string" &&
      !["value", "count", "x", "y", "z"].includes(key.toLowerCase()),
  );
  return stringKey ?? "label";
}

/**
 * Find the first numeric value key in chart data (excludes label key)
 * Used for single-series charts like Bar, Pie, Radial
 */
export function getValueKey(data: unknown[]): string {
  if (data.length === 0) return "value";
  const sample = data[0] as AnyRecord;
  const labelKey = getLabelKey(data);

  // Find first numeric key that isn't the label
  const numericKey = Object.keys(sample).find(
    (key) => key !== labelKey && typeof sample[key] === "number",
  );
  return numericKey ?? "value";
}

/**
 * Find all numeric value keys in chart data (excludes label key)
 * Used for multi-series charts like Line, Area, Composed
 */
export function getValueKeys(data: unknown[]): string[] {
  if (data.length === 0) return ["value"];
  const sample = data[0] as AnyRecord;
  const labelKey = getLabelKey(data);

  const keys = Object.keys(sample).filter(
    (key) => key !== labelKey && typeof sample[key] === "number",
  );
  return keys.length > 0 ? keys : ["value"];
}

/**
 * Find the X coordinate key for scatter/bubble charts
 */
export function getXKey(data: unknown[]): string {
  if (data.length === 0) return "x";
  const sample = data[0] as AnyRecord;
  if ("x" in sample) return "x";
  if ("X" in sample) return "X";
  return "x";
}

/**
 * Find the Y coordinate key for scatter/bubble charts
 */
export function getYKey(data: unknown[]): string {
  if (data.length === 0) return "y";
  const sample = data[0] as AnyRecord;
  if ("y" in sample) return "y";
  if ("Y" in sample) return "Y";
  return "y";
}

/**
 * Find the Z (size) key for bubble charts
 */
export function getZKey(data: unknown[]): string {
  if (data.length === 0) return "z";
  const sample = data[0] as AnyRecord;
  if ("z" in sample) return "z";
  if ("Z" in sample) return "Z";
  if ("size" in sample) return "size";
  if ("radius" in sample) return "radius";
  return "z";
}

/**
 * Convert a data key to a display-friendly label
 * e.g., "salesRevenue" -> "Sales Revenue", "value" -> "Value"
 */
export function keyToLabel(key: string): string {
  // Handle common abbreviations
  if (key === "x" || key === "X") return "X";
  if (key === "y" || key === "Y") return "Y";
  if (key === "z" || key === "Z") return "Size";

  // Convert camelCase/snake_case to Title Case with spaces
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capitals
    .replace(/[_-]/g, " ") // Replace underscores/dashes with spaces
    .replace(/\s+/g, " ") // Normalize spaces
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Chart configuration interface for new config options
 */
interface ChartConfigElement {
  title?: { text?: string; fontSize?: number; color?: string };
  subtitle?: { text?: string; fontSize?: number; color?: string };
  xAxis?: {
    title?: string | { text?: string; enabled?: boolean };
    label?: { enabled?: boolean };
    gridLine?: { enabled?: boolean };
  };
  yAxis?: {
    title?: string | { text?: string; enabled?: boolean };
    label?: { enabled?: boolean };
    gridLine?: { enabled?: boolean };
  };
  legend?: {
    enabled?: boolean;
    position?: "top" | "right" | "bottom" | "left";
  };
  animation?: { enabled?: boolean; duration?: number };
  background?: { fill?: string; visible?: boolean };
  showLegend?: boolean;
  showGrid?: boolean;
  showAxisLabels?: boolean;
  disableAnimation?: boolean;
}

/**
 * Build common chart configuration options from element properties
 * This reduces code duplication across chart components
 */
export function buildChartConfigOptions(element: ChartConfigElement) {
  const titleConfig = element.title;
  const subtitleConfig = element.subtitle;
  const xAxisConfig = element.xAxis;
  const yAxisConfig = element.yAxis;
  const legendConfig = element.legend;
  const animationConfig = element.animation;
  const backgroundConfig = element.background;

  // Legacy computed values for backward compatibility
  const showLegend = element.showLegend ?? element.legend?.enabled ?? true;
  const showGrid = element.showGrid ?? true;
  const showAxisLabels = element.showAxisLabels ?? true;
  const disableAnimation = element.disableAnimation ?? false;
  const animationEnabled = animationConfig?.enabled ?? !disableAnimation;

  // Per-axis settings with fallback to legacy settings
  const xAxisShowLabel = xAxisConfig?.label?.enabled ?? showAxisLabels;
  const xAxisShowGrid = xAxisConfig?.gridLine?.enabled ?? false; // X-axis grid off by default
  const yAxisShowLabel = yAxisConfig?.label?.enabled ?? showAxisLabels;
  const yAxisShowGrid = yAxisConfig?.gridLine?.enabled ?? showGrid;

  // Normalize axis title configs (support legacy string values)
  const xAxisTitleConfig =
    typeof xAxisConfig?.title === "string"
      ? { text: xAxisConfig.title }
      : (xAxisConfig?.title ?? {});
  const yAxisTitleConfig =
    typeof yAxisConfig?.title === "string"
      ? { text: yAxisConfig.title }
      : (yAxisConfig?.title ?? {});

  const xAxisTitleEnabled =
    (xAxisTitleConfig as { enabled?: boolean }).enabled ??
    Boolean((xAxisTitleConfig as { text?: string }).text);
  const yAxisTitleEnabled =
    (yAxisTitleConfig as { enabled?: boolean }).enabled ??
    Boolean((yAxisTitleConfig as { text?: string }).text);

  return {
    // Title configuration
    title: titleConfig?.text
      ? {
          text: titleConfig.text,
          ...(titleConfig.fontSize && { fontSize: titleConfig.fontSize }),
          ...(titleConfig.color && { color: titleConfig.color }),
        }
      : undefined,
    // Subtitle configuration
    subtitle: subtitleConfig?.text
      ? {
          text: subtitleConfig.text,
          ...(subtitleConfig.fontSize && { fontSize: subtitleConfig.fontSize }),
          ...(subtitleConfig.color && { color: subtitleConfig.color }),
        }
      : undefined,
    // Per-axis configuration
    xAxis: {
      showLabel: xAxisShowLabel,
      showGrid: xAxisShowGrid,
      title: xAxisTitleEnabled
        ? { text: (xAxisTitleConfig as { text?: string }).text }
        : undefined,
    },
    yAxis: {
      showLabel: yAxisShowLabel,
      showGrid: yAxisShowGrid,
      title: yAxisTitleEnabled
        ? { text: (yAxisTitleConfig as { text?: string }).text }
        : undefined,
    },
    // Legacy axis title access (backward compatibility)
    xAxisTitle: xAxisTitleEnabled
      ? { text: (xAxisTitleConfig as { text?: string }).text }
      : undefined,
    yAxisTitle: yAxisTitleEnabled
      ? { text: (yAxisTitleConfig as { text?: string }).text }
      : undefined,
    // Legend configuration
    legend: {
      enabled: showLegend,
      ...(legendConfig?.position && { position: legendConfig.position }),
    },
    // Animation configuration
    animation: {
      enabled: animationEnabled,
      ...(animationConfig?.duration && { duration: animationConfig.duration }),
    },
    // Background configuration
    background: {
      visible: backgroundConfig?.visible ?? false,
      ...(backgroundConfig?.fill && { fill: backgroundConfig.fill }),
    },
    // Legacy computed flags for backward compatibility
    showAxisLabels,
    showGrid,
    showLegend,
  };
}

/**
 * Interpolation config type for AG Charts
 */
export type InterpolationConfig =
  | { type: "linear" | "smooth" }
  | { type: "step"; position: "start" | "middle" | "end" };

/**
 * Convert interpolation value to AG Charts format
 * Handles step interpolation with position property
 *
 * @param value - Interpolation value from element (linear, smooth, step, step-start, step-end)
 * @returns AG Charts interpolation config object
 */
export function getInterpolationConfig(value: string): InterpolationConfig {
  switch (value) {
    case "step-start":
      return { type: "step", position: "start" };
    case "step-end":
      return { type: "step", position: "end" };
    case "step":
      return { type: "step", position: "middle" };
    case "linear":
      return { type: "linear" };
    case "smooth":
    default:
      return { type: "smooth" };
  }
}
