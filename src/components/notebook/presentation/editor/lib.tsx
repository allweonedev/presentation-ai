"use client";

import { type MyEditor } from "@/components/plate/editor-kit";
import { BlockSelectionPlugin } from "@platejs/selection/react";
import { type TElement } from "@platejs/slate";
import {
  AreaChart,
  ArrowDownUp,
  ArrowLeftRight,
  ArrowRight,
  BarChart3,
  ChartScatter,
  Circle,
  Clock,
  Diamond,
  Funnel,
  GitCompare,
  Grid3x3,
  Layers,
  Leaf,
  List,
  ListOrdered,
  PieChart,
  Pill,
  Quote,
  Radar,
  RefreshCw,
  Scale,
  Square,
  SquareAsterisk,
  SquareDashedBottomCode,
  SquareSplitVertical,
  SquareStack,
  Star,
  TrendingUp,
  Triangle,
} from "lucide-react";
import { KEYS } from "platejs";
import { type PlateEditor } from "platejs/react";
import { FaStairs } from "react-icons/fa6";

export const BULLET_ITEM = "bullet";
export const BULLET_GROUP = "bullets";
export const STAIR_ITEM = "stair-item";
export const STAIRCASE_GROUP = "staircase";
export const CYCLE_ITEM = "cycle-item";
export const CYCLE_GROUP = "cycle";
export const ICON_ELEMENT = "icon";
export const ICON_LIST_ITEM = "icon-item";
export const ICON_LIST = "icons";
export const ARROW_LIST = "arrows";
export const ARROW_LIST_ITEM = "arrow-item";
export const PYRAMID_GROUP = "pyramid";
export const PYRAMID_ITEM = "pyramid-item";
export const TIMELINE_GROUP = "timeline";
export const TIMELINE_ITEM = "timeline-item";

// New components
export const BOX_GROUP = "boxes";
export const BOX_ITEM = "box-item";
export const COLUMN_GROUP = "column_group";
export const COLUMN_ITEM = "column";

export const COMPARE_GROUP = "compare";
export const COMPARE_SIDE = "compare-side";

export const BEFORE_AFTER_GROUP = "before-after";
export const BEFORE_AFTER_SIDE = "before-after-side";

export const PROS_CONS_GROUP = "pros-cons";
export const PROS_ITEM = "pros-item";
export const CONS_ITEM = "cons-item";

export const SEQUENCE_ARROW_GROUP = "arrow-vertical";
export const SEQUENCE_ARROW_ITEM = "arrow-vertical-item";

export const STATS_GROUP = "stats";
export const STATS_ITEM = "stats-item";

export const FLEX_BOX = "flex_box";

// Quote element
export const QUOTE_ELEMENT = "quote" as const;

// Individual chart element keys
export const PIE_CHART_ELEMENT = "chart-pie" as const;
export const BAR_CHART_ELEMENT = "chart-bar" as const;
export const AREA_CHART_ELEMENT = "chart-area" as const;
export const RADAR_CHART_ELEMENT = "chart-radar" as const;
export const SCATTER_CHART_ELEMENT = "chart-scatter" as const;
export const LINE_CHART_ELEMENT = "chart-line" as const;
export const RADIAL_BAR_CHART_ELEMENT = "chart-radial-bar" as const;
export const COMPOSED_CHART_ELEMENT = "chart-composed" as const;
export const TREEMAP_CHART_ELEMENT = "chart-treemap" as const;
export const BUBBLE_CHART_ELEMENT = "chart-bubble" as const;
export const DONUT_CHART_ELEMENT = "chart-donut" as const;

// New chart element keys - Phase 1: Standard Series
export const HISTOGRAM_CHART_ELEMENT = "chart-histogram" as const;
export const HEATMAP_CHART_ELEMENT = "chart-heatmap" as const;

// New chart element keys - Phase 2: Range Charts
export const RANGE_BAR_CHART_ELEMENT = "chart-range-bar" as const;
export const RANGE_AREA_CHART_ELEMENT = "chart-range-area" as const;
export const WATERFALL_CHART_ELEMENT = "chart-waterfall" as const;

// New chart element keys - Phase 3: Financial Charts
export const BOX_PLOT_CHART_ELEMENT = "chart-box-plot" as const;
export const CANDLESTICK_CHART_ELEMENT = "chart-candlestick" as const;
export const OHLC_CHART_ELEMENT = "chart-ohlc" as const;

// New chart element keys - Phase 4: Polar Charts
export const NIGHTINGALE_CHART_ELEMENT = "chart-nightingale" as const;
export const RADIAL_COLUMN_CHART_ELEMENT = "chart-radial-column" as const;

// New chart element keys - Phase 5: Hierarchical Charts
export const SUNBURST_CHART_ELEMENT = "chart-sunburst" as const;
export const SANKEY_CHART_ELEMENT = "chart-sankey" as const;
export const CHORD_CHART_ELEMENT = "chart-chord" as const;

// New chart element keys - Phase 6: Funnel Charts
export const FUNNEL_CHART_ELEMENT = "chart-funnel" as const;
export const CONE_FUNNEL_CHART_ELEMENT = "chart-cone-funnel" as const;
export const PYRAMID_CHART_ELEMENT = "chart-pyramid" as const;

// New chart element keys - Phase 7: Gauge Charts
export const RADIAL_GAUGE_ELEMENT = "chart-radial-gauge" as const;
export const LINEAR_GAUGE_ELEMENT = "chart-linear-gauge" as const;

// Button element key
export const BUTTON_ELEMENT = "button" as const;

// AntV Infographic element key
export const ANTV_INFOGRAPHIC = "antv-infographic" as const;

// Chart compatibility groups based on data structure
export const CHART_TYPES = {
  // Charts using label/value data structure (compatible with each other)
  LABEL_VALUE_CHARTS: [
    PIE_CHART_ELEMENT,
    BAR_CHART_ELEMENT,
    AREA_CHART_ELEMENT,
    RADAR_CHART_ELEMENT,
    LINE_CHART_ELEMENT,
    RADIAL_BAR_CHART_ELEMENT,
    COMPOSED_CHART_ELEMENT,
    TREEMAP_CHART_ELEMENT,
    DONUT_CHART_ELEMENT,
  ],
  // Charts using coordinate data structure (x/y)
  COORDINATE_CHARTS: [SCATTER_CHART_ELEMENT, BUBBLE_CHART_ELEMENT],
} as const;

// Chart-specific capabilities for customization options
export const CHART_CAPABILITIES = {
  [BAR_CHART_ELEMENT]: {
    variants: ["default", "stacked", "horizontal"] as const,
  },
  [AREA_CHART_ELEMENT]: {
    variants: ["default", "stacked"] as const,
    curveTypes: ["linear", "monotone", "step", "natural"] as const,
  },
  [LINE_CHART_ELEMENT]: {
    curveTypes: ["linear", "monotone", "step", "natural"] as const,
  },
  [PIE_CHART_ELEMENT]: {
    variants: ["default"] as const,
  },
  [DONUT_CHART_ELEMENT]: {
    // Donut chart has a fixed inner radius ratio
  },
  [RADAR_CHART_ELEMENT]: {
    variants: ["default", "outline"] as const,
  },
  [SCATTER_CHART_ELEMENT]: {
    scatterShapes: ["circle", "star", "square", "triangle", "diamond"] as const,
  },
  [BUBBLE_CHART_ELEMENT]: {
    // Bubble chart uses z-axis for sizing, no special variants needed
  },
} as const;

// Rich default chart data for each chart type
export const DEFAULT_CHART_DATA = {
  // Label-value charts (pie, bar, area, line, radar, radial bar, treemap)
  labelValue: [
    { label: "Q1 Revenue", value: 45200 },
    { label: "Q2 Revenue", value: 52800 },
    { label: "Q3 Revenue", value: 48100 },
    { label: "Q4 Revenue", value: 61400 },
    { label: "Q1 Next Year", value: 58900 },
  ],
  // Multi-series for composed and stacked charts
  multiSeries: [
    { label: "Jan", revenue: 4500, expenses: 3200, profit: 1300 },
    { label: "Feb", revenue: 5200, expenses: 3400, profit: 1800 },
    { label: "Mar", revenue: 4800, expenses: 3100, profit: 1700 },
    { label: "Apr", revenue: 6100, expenses: 3800, profit: 2300 },
    { label: "May", revenue: 5900, expenses: 3500, profit: 2400 },
    { label: "Jun", revenue: 6800, expenses: 4000, profit: 2800 },
  ],
  // XY coordinate data for scatter plots
  scatter: [
    { x: 10, y: 30 },
    { x: 25, y: 45 },
    { x: 35, y: 20 },
    { x: 45, y: 55 },
    { x: 55, y: 40 },
    { x: 65, y: 70 },
    { x: 75, y: 50 },
    { x: 85, y: 85 },
    { x: 95, y: 60 },
  ],
  // XYZ coordinate data for bubble charts (with z for radius)
  bubble: [
    { x: 10, y: 30, z: 15 },
    { x: 25, y: 45, z: 22 },
    { x: 35, y: 20, z: 18 },
    { x: 45, y: 55, z: 28 },
    { x: 55, y: 40, z: 12 },
    { x: 65, y: 70, z: 35 },
    { x: 75, y: 50, z: 20 },
    { x: 85, y: 85, z: 30 },
  ],
  // OHLC data for candlestick and OHLC charts (date, open, high, low, close)
  ohlc: [
    { date: "2024-01-02", open: 100, high: 105, low: 98, close: 103 },
    { date: "2024-01-03", open: 103, high: 108, low: 101, close: 107 },
    { date: "2024-01-04", open: 107, high: 112, low: 104, close: 106 },
    { date: "2024-01-05", open: 106, high: 110, low: 102, close: 109 },
    { date: "2024-01-08", open: 109, high: 115, low: 107, close: 114 },
  ],
  // Box plot data (category, min, q1, median, q3, max)
  boxPlot: [
    { category: "Q1 Sales", min: 10, q1: 25, median: 50, q3: 75, max: 95 },
    { category: "Q2 Sales", min: 15, q1: 30, median: 55, q3: 80, max: 100 },
    { category: "Q3 Sales", min: 20, q1: 35, median: 60, q3: 85, max: 105 },
    { category: "Q4 Sales", min: 12, q1: 28, median: 52, q3: 78, max: 98 },
  ],
} as const;

// Element categories for organized dropdown
export const ELEMENT_CATEGORIES = {
  BULLETS: "Bullets",
  BOXES: "Boxes",
  STEPS: "Steps",
  SEQUENCES: "Sequences",
  LAYOUTS: "Layouts",
  COMPARISONS: "Comparisons",
  CHARTS: "Charts",
  STATS: "Stats",
  QUOTES: "Quotes",
} as const;

// Category icons mapping
export const CATEGORY_ICONS = {
  [ELEMENT_CATEGORIES.BULLETS]: <ListOrdered className="h-4 w-4" />,
  [ELEMENT_CATEGORIES.BOXES]: <Square className="h-4 w-4" />,
  [ELEMENT_CATEGORIES.STEPS]: <FaStairs className="h-4 w-4" />,
  [ELEMENT_CATEGORIES.SEQUENCES]: <ArrowRight className="h-4 w-4" />,
  [ELEMENT_CATEGORIES.LAYOUTS]: <SquareStack className="h-4 w-4" />,
  [ELEMENT_CATEGORIES.COMPARISONS]: <GitCompare className="h-4 w-4" />,
  [ELEMENT_CATEGORIES.CHARTS]: <PieChart className="h-4 w-4" />,
  [ELEMENT_CATEGORIES.STATS]: <BarChart3 className="h-4 w-4" />,
  [ELEMENT_CATEGORIES.QUOTES]: <Quote className="h-4 w-4" />,
} as const;

// Chart data category mapping - maps each chart type to its data category
export type ChartDataCategory =
  | "categorical" // All charts using label + value(s): Bar, Line, Area, Composed, Pie, Donut, Radar, Radial Bar, Nightingale, Radial Column
  | "xy" // Scatter - x/y coordinates
  | "xyz" // Bubble - x/y/z coordinates
  | "range" // Range Bar, Range Area - category + low/high values
  | "ohlc" // Candlestick, OHLC - financial data
  | "box-plot" // Box Plot - statistical data
  | "hierarchical" // Treemap, Sunburst - nested data
  | "flow" // Sankey, Chord - from/to/size
  | "funnel" // Funnel, Cone Funnel, Pyramid - stage/value
  | "heatmap" // Heatmap - x/y/value matrix
  | "histogram" // Histogram - single values for binning
  | "waterfall" // Waterfall chart - standalone
  | "gauge"; // Radial/Linear Gauge - single value

// Map of chart element types to their data categories
const CHART_DATA_CATEGORY_MAP: Record<string, ChartDataCategory> = {
  // Categorical charts (label + value(s) - can transform between each other)
  // This includes both cartesian (x/y axes) and polar displays
  [PIE_CHART_ELEMENT]: "categorical",
  [DONUT_CHART_ELEMENT]: "categorical",
  [RADAR_CHART_ELEMENT]: "categorical",
  [RADIAL_BAR_CHART_ELEMENT]: "categorical",
  [NIGHTINGALE_CHART_ELEMENT]: "categorical",
  [RADIAL_COLUMN_CHART_ELEMENT]: "categorical",
  [BAR_CHART_ELEMENT]: "categorical",
  [LINE_CHART_ELEMENT]: "categorical",
  [AREA_CHART_ELEMENT]: "categorical",
  [COMPOSED_CHART_ELEMENT]: "categorical",

  // XY coordinate charts
  [SCATTER_CHART_ELEMENT]: "xy",

  // XYZ coordinate charts (includes size/z dimension)
  [BUBBLE_CHART_ELEMENT]: "xyz",

  // Range charts (category + low/high values)
  [RANGE_BAR_CHART_ELEMENT]: "range",
  [RANGE_AREA_CHART_ELEMENT]: "range",

  // OHLC charts (financial - open, high, low, close)
  [CANDLESTICK_CHART_ELEMENT]: "ohlc",
  [OHLC_CHART_ELEMENT]: "ohlc",

  // Box plot charts (statistical)
  [BOX_PLOT_CHART_ELEMENT]: "box-plot",

  // Hierarchical charts (nested data with children)
  [TREEMAP_CHART_ELEMENT]: "hierarchical",
  [SUNBURST_CHART_ELEMENT]: "hierarchical",

  // Flow charts (from, to, size)
  [SANKEY_CHART_ELEMENT]: "flow",
  [CHORD_CHART_ELEMENT]: "flow",

  // Funnel charts (stage/label + value)
  [FUNNEL_CHART_ELEMENT]: "funnel",
  [CONE_FUNNEL_CHART_ELEMENT]: "funnel",
  [PYRAMID_CHART_ELEMENT]: "funnel",

  // Heatmap charts (x, y, value matrix)
  [HEATMAP_CHART_ELEMENT]: "heatmap",

  // Histogram charts (single values for binning)
  [HISTOGRAM_CHART_ELEMENT]: "histogram",

  // Gauge charts (single value)
  [RADIAL_GAUGE_ELEMENT]: "gauge",
  [LINEAR_GAUGE_ELEMENT]: "gauge",

  // Waterfall chart (standalone - specific data format)
  [WATERFALL_CHART_ELEMENT]: "waterfall",
};

/**
 * Gets the data category for a chart type
 * Used to determine which charts can be converted to each other
 */
export function getChartDataCategory(
  chartType: string,
): ChartDataCategory | null {
  return CHART_DATA_CATEGORY_MAP[chartType] ?? null;
}

/**
 * Helper function to check if two chart types are compatible (can convert between them)
 * Charts are compatible if they use the same data structure/category
 */
export function areChartTypesCompatible(
  chartType1: string,
  chartType2: string,
): boolean {
  const category1 = getChartDataCategory(chartType1);
  const category2 = getChartDataCategory(chartType2);

  // If either chart doesn't have a category, they're not compatible
  if (!category1 || !category2) {
    return false;
  }

  // Charts are compatible if they share the same data category
  return category1 === category2;
}

// Element capabilities - defines which elements support which layout options
export const ELEMENT_CAPABILITIES: Record<
  string,
  {
    orientation?: readonly ["vertical", "horizontal"];
    sidedness?: readonly ["single", "double"];
    numbered?: boolean;
    showLine?: boolean;
    showIcon?: boolean;
    columnSize?: readonly ["sm", "md", "lg", "xl"];
    alignment?: readonly ("left" | "center" | "right")[];
  }
> = {
  [TIMELINE_GROUP]: {
    orientation: ["vertical", "horizontal"] as const,
    sidedness: ["single", "double"] as const,
    numbered: true,
    showLine: true,
    alignment: ["left", "right"] as readonly ("left" | "right")[],
  },
  [ARROW_LIST]: {
    orientation: ["vertical", "horizontal"] as const,
    alignment: ["left", "center", "right"] as const,
  },
  [SEQUENCE_ARROW_GROUP]: {
    orientation: ["vertical", "horizontal"] as const,
  },
  [FLEX_BOX]: {
    columnSize: ["sm", "md", "lg", "xl"] as const,
  },
  [BOX_GROUP]: {
    columnSize: ["sm", "md", "lg", "xl"] as const,
  },
  [BULLET_GROUP]: {
    columnSize: ["sm", "md", "lg", "xl"] as const,
  },
  [STATS_GROUP]: {
    columnSize: ["sm", "md", "lg", "xl"] as const,
  },
  [ICON_LIST]: {
    columnSize: ["sm", "md", "lg", "xl"] as const,
  },
  [STAIRCASE_GROUP]: {
    alignment: ["left", "right"] as readonly ("left" | "right")[],
  },
  [PYRAMID_GROUP]: {
    alignment: ["left", "right"] as readonly ("left" | "right")[],
  },
};

// Helper functions to check element capabilities
export function supportsOrientation(elementType: string): boolean {
  return (
    elementType in ELEMENT_CAPABILITIES &&
    "orientation" in
      (ELEMENT_CAPABILITIES[elementType as keyof typeof ELEMENT_CAPABILITIES] ??
        [])
  );
}

export function supportsSidedness(elementType: string): boolean {
  return (
    elementType in ELEMENT_CAPABILITIES &&
    "sidedness" in
      (ELEMENT_CAPABILITIES[elementType as keyof typeof ELEMENT_CAPABILITIES] ??
        [])
  );
}

export function supportsNumbered(elementType: string): boolean {
  return (
    elementType in ELEMENT_CAPABILITIES &&
    "numbered" in
      (ELEMENT_CAPABILITIES[elementType as keyof typeof ELEMENT_CAPABILITIES] ??
        [])
  );
}

export function supportsShowLine(elementType: string): boolean {
  return (
    elementType in ELEMENT_CAPABILITIES &&
    "showLine" in
      (ELEMENT_CAPABILITIES[elementType as keyof typeof ELEMENT_CAPABILITIES] ??
        [])
  );
}

export function supportsColumnCount(elementType: string): boolean {
  return (
    elementType in ELEMENT_CAPABILITIES &&
    "columnCount" in
      (ELEMENT_CAPABILITIES[elementType as keyof typeof ELEMENT_CAPABILITIES] ??
        [])
  );
}

export function supportsAlignment(elementType: string): boolean {
  return (
    elementType in ELEMENT_CAPABILITIES &&
    "alignment" in
      (ELEMENT_CAPABILITIES[elementType as keyof typeof ELEMENT_CAPABILITIES] ??
        [])
  );
}

export function supportsColumnSize(elementType: string): boolean {
  return (
    elementType in ELEMENT_CAPABILITIES &&
    "columnSize" in
      (ELEMENT_CAPABILITIES[elementType as keyof typeof ELEMENT_CAPABILITIES] ??
        {})
  );
}

export function getAlignmentOptions(elementType: string) {
  const capabilities =
    ELEMENT_CAPABILITIES[elementType as keyof typeof ELEMENT_CAPABILITIES];
  return capabilities?.alignment ?? ["left", "center", "right"];
}

export function getOrientationOptions(elementType: string): readonly string[] {
  const capabilities =
    ELEMENT_CAPABILITIES[elementType as keyof typeof ELEMENT_CAPABILITIES];
  return capabilities?.orientation ?? [];
}

export function getSidednessOptions(elementType: string): readonly string[] {
  const capabilities =
    ELEMENT_CAPABILITIES[elementType as keyof typeof ELEMENT_CAPABILITIES];
  return capabilities?.sidedness ?? [];
}

export function getNumberedOptions(elementType: string): boolean {
  const capabilities =
    ELEMENT_CAPABILITIES[elementType as keyof typeof ELEMENT_CAPABILITIES];
  return capabilities?.numbered ?? false;
}

export function getShowLineOptions(elementType: string): boolean {
  const capabilities =
    ELEMENT_CAPABILITIES[elementType as keyof typeof ELEMENT_CAPABILITIES];
  return capabilities?.showLine ?? false;
}

export function getColumnSizeOptions(elementType: string): readonly string[] {
  if (supportsColumnSize(elementType)) {
    return ["sm", "md", "lg", "xl"] as const;
  }
  return [];
}

export const getColumnSizeLabel = (columnSize: "sm" | "md" | "lg" | "xl") => {
  switch (columnSize) {
    case "sm":
      return "Small";
    case "md":
      return "Medium";
    case "lg":
      return "Large";
    case "xl":
      return "Extra Large";
  }
};

// Grouped blocks structure for hierarchical dropdown - all variants stored directly
export const GROUPED_BLOCKS = {
  [ELEMENT_CATEGORIES.BULLETS]: [
    // Bullets variants
    {
      type: BULLET_GROUP,
      name: "Numbered",
      variant: "numbered",
      key: "bulletType",
      icon: <ListOrdered className="h-4 w-4" />,
    },
    {
      type: BULLET_GROUP,
      name: "Basic",
      variant: "basic",
      key: "bulletType",
      icon: <List className="h-4 w-4" />,
    },
    {
      type: BULLET_GROUP,
      name: "Arrow",
      variant: "arrow",
      key: "bulletType",
      icon: <ArrowRight className="h-4 w-4" />,
    },
  ],
  [ELEMENT_CATEGORIES.BOXES]: [
    // Boxes variants
    {
      type: BOX_GROUP,
      name: "Solid",
      variant: "solid",
      key: "boxType",
      icon: <Square className="h-4 w-4" />,
    },
    {
      type: BOX_GROUP,
      name: "Outline",
      variant: "outline",
      key: "boxType",
      icon: <SquareDashedBottomCode className="h-4 w-4" />,
    },
    {
      type: BOX_GROUP,
      name: "With Icons",
      variant: "icon",
      key: "boxType",
      icon: <SquareAsterisk className="h-4 w-4" />,
    },
    {
      type: BOX_GROUP,
      name: "Side Line",
      variant: "sideline",
      key: "boxType",
      icon: <SquareSplitVertical className="h-4 w-4" />,
    },
    {
      type: BOX_GROUP,
      name: "Joined",
      variant: "joined",
      key: "boxType",
      icon: <SquareStack className="h-4 w-4" />,
    },
    {
      type: BOX_GROUP,
      name: "Leaf",
      variant: "leaf",
      key: "boxType",
      icon: <Leaf className="h-4 w-4" />,
    },
  ],
  [ELEMENT_CATEGORIES.STEPS]: [
    {
      type: STAIRCASE_GROUP,
      name: "Staircase",
      icon: <FaStairs className="h-4 w-4" />,
    },
    // Pyramid/Funnel variants
    {
      type: PYRAMID_GROUP,
      name: "Pyramid",
      variant: "pyramid",
      key: "isFunnel",
      icon: <Triangle className="h-4 w-4" />,
    },
    {
      type: PYRAMID_GROUP,
      name: "Funnel",
      variant: "funnel",
      key: "isFunnel",
      icon: <Funnel className="h-4 w-4" />,
    },
    // Arrow Sequence - consolidated orientation variants
    {
      type: SEQUENCE_ARROW_GROUP,
      name: "Arrow Sequence",
      icon: <ArrowDownUp className="h-4 w-4" />,
      supportsOrientation: true,
    },
  ],
  [ELEMENT_CATEGORIES.SEQUENCES]: [
    // Arrows variants
    {
      type: ARROW_LIST,
      name: "Arrow",
      variant: "arrow",
      key: "svgType",
      icon: <ArrowRight className="h-4 w-4" />,
    },
    {
      type: ARROW_LIST,
      name: "Pill",
      variant: "pill",
      key: "svgType",
      icon: <Pill className="h-4 w-4" />,
    },
    {
      type: ARROW_LIST,
      name: "Parallelogram",
      variant: "parallelogram",
      key: "svgType",
      icon: <Diamond className="h-4 w-4" />,
    },
    // Timeline - consolidated orientation variants
    {
      type: TIMELINE_GROUP,
      name: "Timeline",
      icon: <Clock className="h-4 w-4" />,
      supportsOrientation: true,
    },
  ],
  [ELEMENT_CATEGORIES.LAYOUTS]: [
    {
      type: CYCLE_GROUP,
      name: "Cycle",
      icon: <RefreshCw className="h-4 w-4" />,
    },
    {
      type: ICON_LIST,
      name: "Icons",
      icon: <Star className="h-4 w-4" />,
    },
    {
      type: COLUMN_GROUP,
      name: "Columns",
      icon: <SquareStack className="h-4 w-4" />,
    },
  ],
  [ELEMENT_CATEGORIES.COMPARISONS]: [
    {
      type: COMPARE_GROUP,
      name: "Compare",
      icon: <GitCompare className="h-4 w-4" />,
    },
    {
      type: BEFORE_AFTER_GROUP,
      name: "Before/After",
      icon: <ArrowLeftRight className="h-4 w-4" />,
    },
    {
      type: PROS_CONS_GROUP,
      name: "Pros & Cons",
      icon: <Scale className="h-4 w-4" />,
    },
  ],
  [ELEMENT_CATEGORIES.CHARTS]: [
    {
      type: PIE_CHART_ELEMENT,
      name: "Pie Chart",
      icon: <PieChart className="h-4 w-4" />,
    },
    {
      type: DONUT_CHART_ELEMENT,
      name: "Donut Chart",
      icon: <Circle className="h-4 w-4" />,
    },
    {
      type: BAR_CHART_ELEMENT,
      name: "Bar Chart",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      type: AREA_CHART_ELEMENT,
      name: "Area Chart",
      icon: <AreaChart className="h-4 w-4" />,
    },
    {
      type: RADAR_CHART_ELEMENT,
      name: "Radar Chart",
      icon: <Radar className="h-4 w-4" />,
    },
    {
      type: SCATTER_CHART_ELEMENT,
      name: "Scatter Chart",
      icon: <ChartScatter className="h-4 w-4" />,
    },
    {
      type: BUBBLE_CHART_ELEMENT,
      name: "Bubble Chart",
      icon: <Circle className="h-4 w-4" />,
    },
    {
      type: LINE_CHART_ELEMENT,
      name: "Line Chart",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      type: RADIAL_BAR_CHART_ELEMENT,
      name: "Radial Bar",
      icon: <Circle className="h-4 w-4" />,
    },
    {
      type: COMPOSED_CHART_ELEMENT,
      name: "Composed",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      type: TREEMAP_CHART_ELEMENT,
      name: "Treemap",
      icon: <Grid3x3 className="h-4 w-4" />,
    },
    // New chart types
    {
      type: HISTOGRAM_CHART_ELEMENT,
      name: "Histogram",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      type: HEATMAP_CHART_ELEMENT,
      name: "Heatmap",
      icon: <Grid3x3 className="h-4 w-4" />,
    },
    {
      type: RANGE_BAR_CHART_ELEMENT,
      name: "Range Bar",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      type: RANGE_AREA_CHART_ELEMENT,
      name: "Range Area",
      icon: <AreaChart className="h-4 w-4" />,
    },
    {
      type: WATERFALL_CHART_ELEMENT,
      name: "Waterfall",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      type: BOX_PLOT_CHART_ELEMENT,
      name: "Box Plot",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      type: CANDLESTICK_CHART_ELEMENT,
      name: "Candlestick",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      type: OHLC_CHART_ELEMENT,
      name: "OHLC",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      type: NIGHTINGALE_CHART_ELEMENT,
      name: "Nightingale",
      icon: <PieChart className="h-4 w-4" />,
    },
    {
      type: RADIAL_COLUMN_CHART_ELEMENT,
      name: "Radial Column",
      icon: <Circle className="h-4 w-4" />,
    },
    {
      type: SUNBURST_CHART_ELEMENT,
      name: "Sunburst",
      icon: <Circle className="h-4 w-4" />,
    },
    {
      type: SANKEY_CHART_ELEMENT,
      name: "Sankey",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      type: CHORD_CHART_ELEMENT,
      name: "Chord",
      icon: <Circle className="h-4 w-4" />,
    },
    {
      type: FUNNEL_CHART_ELEMENT,
      name: "Funnel",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      type: CONE_FUNNEL_CHART_ELEMENT,
      name: "Cone Funnel",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      type: PYRAMID_CHART_ELEMENT,
      name: "Pyramid Chart",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      type: RADIAL_GAUGE_ELEMENT,
      name: "Radial Gauge",
      icon: <Circle className="h-4 w-4" />,
    },
    {
      type: LINEAR_GAUGE_ELEMENT,
      name: "Linear Gauge",
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ],
  [ELEMENT_CATEGORIES.STATS]: [
    {
      type: STATS_GROUP,
      name: "Plain",
      variant: "plain",
      key: "statsType",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      type: STATS_GROUP,
      name: "Circle",
      variant: "circle",
      key: "statsType",
      icon: <Star className="h-4 w-4" />,
    },
    {
      type: STATS_GROUP,
      name: "Circle Bold",
      variant: "circle-bold",
      key: "statsType",
      icon: <Square className="h-4 w-4" />,
    },
    {
      type: STATS_GROUP,
      name: "Star Rating",
      variant: "star",
      key: "statsType",
      icon: <Star className="h-4 w-4" />,
    },
    {
      type: STATS_GROUP,
      name: "Bar",
      variant: "bar",
      key: "statsType",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      type: STATS_GROUP,
      name: "Dot Grid",
      variant: "dot-grid",
      key: "statsType",
      icon: <SquareStack className="h-4 w-4" />,
    },
    {
      type: STATS_GROUP,
      name: "Dot Line",
      variant: "dot-line",
      key: "statsType",
      icon: <ArrowRight className="h-4 w-4" />,
    },
  ],
  [ELEMENT_CATEGORIES.QUOTES]: [
    {
      type: QUOTE_ELEMENT,
      name: "Large Quote",
      variant: "large",
      key: "variant",
      icon: <Quote className="h-4 w-4" />,
    },
    {
      type: QUOTE_ELEMENT,
      name: "Side Quote with Icon",
      variant: "sidequote-icon",
      key: "variant",
      icon: <Quote className="h-4 w-4" />,
    },
    {
      type: QUOTE_ELEMENT,
      name: "Simple Side Quote",
      variant: "sidequote",
      key: "variant",
      icon: <Quote className="h-4 w-4" />,
    },
  ],
} as const;

// Keep BLOCKS for backward compatibility but mark as deprecated
export const BLOCKS = Object.values(GROUPED_BLOCKS).flat();

// Helper function to check if an element type is a chart
export function isChartType(elementType: string): boolean {
  return GROUPED_BLOCKS[ELEMENT_CATEGORIES.CHARTS].some(
    (chart) => chart.type === elementType,
  );
}

// Helper function to get the category of an element type
export function getElementCategory(elementType: string): string | null {
  for (const [category, elements] of Object.entries(GROUPED_BLOCKS)) {
    if (elements.some((el) => el.type === elementType)) {
      return category;
    }
  }
  return null;
}

/**
 * Gets available conversion options based on the current element type
 * Returns grouped structure for hierarchical dropdown
 */
export function getAvailableConversionOptions(currentElementType: string) {
  const isCurrentElementChart = isChartType(currentElementType);

  // If current element is a chart, only show chart category
  if (isCurrentElementChart) {
    return {
      [ELEMENT_CATEGORIES.CHARTS]: GROUPED_BLOCKS[
        ELEMENT_CATEGORIES.CHARTS
      ].filter((chart) =>
        areChartTypesCompatible(currentElementType, chart.type),
      ),
    };
  }

  // For non-chart elements, show all categories except charts
  const availableGroups: Record<
    string,
    (typeof GROUPED_BLOCKS)[keyof typeof GROUPED_BLOCKS]
  > = {};

  for (const [category, elements] of Object.entries(GROUPED_BLOCKS)) {
    if (category !== ELEMENT_CATEGORIES.CHARTS) {
      availableGroups[category] = elements;
    }
  }

  return availableGroups;
}

export const PARENT_CHILD_RELATIONSHIP = {
  [BULLET_GROUP]: {
    child: BULLET_ITEM,
  },
  [STAIRCASE_GROUP]: {
    child: STAIR_ITEM,
  },
  [CYCLE_GROUP]: {
    child: CYCLE_ITEM,
  },
  [ICON_LIST]: {
    child: ICON_LIST_ITEM,
  },
  [ARROW_LIST]: {
    child: ARROW_LIST_ITEM,
  },
  [PYRAMID_GROUP]: {
    child: PYRAMID_ITEM,
  },
  [TIMELINE_GROUP]: {
    child: TIMELINE_ITEM,
  },
  [BOX_GROUP]: {
    child: BOX_ITEM,
  },
  [COLUMN_GROUP]: {
    child: COLUMN_ITEM,
  },
  [COMPARE_GROUP]: {
    child: COMPARE_SIDE,
  },
  [BEFORE_AFTER_GROUP]: {
    child: BEFORE_AFTER_SIDE,
  },
  [PROS_CONS_GROUP]: {
    child: [PROS_ITEM, CONS_ITEM],
  },
  [STATS_GROUP]: {
    child: STATS_ITEM,
  },
  [SEQUENCE_ARROW_GROUP]: {
    child: SEQUENCE_ARROW_ITEM,
  },
};

// Single helper per latest instruction: given only editor and element, derive class.
// Note: CYCLE_ITEM grid positioning is now handled by CycleElement parent component
export function getGridClassForElement(
  _editor: PlateEditor,
  element: TElement,
): string {
  // CYCLE_ITEM grid positioning is now handled by CycleElement wrapper
  if (element.type === CYCLE_ITEM) return "";

  if (element.type === PROS_ITEM || element.type === CONS_ITEM) return "h-full";

  if (element.type === KEYS.column) return "flex-1";
  return "";
}

/**
 * Handles the conversion of layout elements to different types
 * @param editor - The Plate editor instance
 * @param type - The target element type to convert to
 * @param variant - Optional variant properties to apply
 */
export function handleLayoutChange(
  editor: MyEditor,
  type: string,
  variant?: Record<string, unknown>,
): void {
  const selectionIds = editor.getOption(BlockSelectionPlugin, "selectedIds");
  const node = editor.api.nodes({ id: Array.from(selectionIds ?? [])[0] });
  const [element] = node?.[0] ?? [];

  if (!element) return;

  // Handle parent-child relationship elements (lists, groups, etc.)
  if (PARENT_CHILD_RELATIONSHIP[element.type]?.child) {
    editor.tf.withoutNormalizing(() => {
      // Process variant values (e.g., convert "funnel" string to boolean for isFunnel)
      const processedVariant = variant ? { ...variant } : {};

      // Special handling for pyramid/funnel variant
      if (processedVariant.isFunnel !== undefined) {
        processedVariant.isFunnel =
          processedVariant.isFunnel === "funnel" ||
          processedVariant.isFunnel === true;
      }

      // If we're changing variants within the same type, just update the variant
      if (type === element.type && Object.keys(processedVariant).length > 0) {
        editor.tf.setNodes(processedVariant, {
          at: editor.api.findPath(element),
        });
      } else {
        // If we're changing the element type, update type and variant
        editor.tf.setNodes(
          { type, ...processedVariant },
          { at: editor.api.findPath(element) },
        );
        // Update child element types
        element.children.forEach((child) => {
          editor.tf.setNodes(
            { type: PARENT_CHILD_RELATIONSHIP[type]?.child },
            { at: editor.api.findPath(child) },
          );
        });
      }
      // Force update all the children so that the UI is updated when variants change
      element.children.forEach((child) => {
        editor.tf.setNodes(
          { lastUpdate: Date.now() },
          { at: editor.api.findPath(child) },
        );
      });
    });
    return;
  }

  // Handle chart elements (direct conversion)
  if (isChartType(element.type)) {
    const currentData = (element as { data?: unknown }).data;
    const isTargetScatter = type === SCATTER_CHART_ELEMENT;
    const isTargetBubble = type === BUBBLE_CHART_ELEMENT;
    const isTargetComposed = type === COMPOSED_CHART_ELEMENT;
    const isTargetOHLC =
      type === CANDLESTICK_CHART_ELEMENT || type === OHLC_CHART_ELEMENT;
    const isTargetBoxPlot = type === BOX_PLOT_CHART_ELEMENT;

    // Add default data if converting to a chart and there's no existing data
    const chartData =
      currentData && Array.isArray(currentData) && currentData.length > 0
        ? undefined // Keep existing data
        : isTargetScatter
          ? DEFAULT_CHART_DATA.scatter
          : isTargetBubble
            ? DEFAULT_CHART_DATA.bubble
            : isTargetOHLC
              ? DEFAULT_CHART_DATA.ohlc
              : isTargetBoxPlot
                ? DEFAULT_CHART_DATA.boxPlot
                : isTargetComposed
                  ? DEFAULT_CHART_DATA.multiSeries
                  : DEFAULT_CHART_DATA.labelValue;

    editor.tf.setNodes(
      { type, ...(chartData ? { data: chartData } : {}) },
      { at: editor.api.findPath(element) },
    );
  }
}

/**
 * Handles updating node properties with forced sibling updates
 * @param editor - The Plate editor instance
 * @param key - The property key to update
 * @param value - The new value for the property
 */
export function handleNodePropertyUpdate(
  editor: MyEditor,
  key: string,
  value:
    | string
    | boolean
    | number
    | Record<string, unknown>
    | unknown[]
    | undefined,
  targetElementId?: string,
): void {
  const selectionIds = editor.getOption(BlockSelectionPlugin, "selectedIds");
  const node = editor.api.nodes({
    id: targetElementId ?? Array.from(selectionIds ?? [])[0],
  });
  const [element] = node?.[0] ?? [];

  if (!element) return;

  const elementPath = editor.api.findPath(element);
  if (!elementPath) return;

  editor.tf.withoutNormalizing(() => {
    if (value === undefined) {
      // Remove the property by setting it to undefined
      editor.tf.setNodes({ [key]: undefined }, { at: elementPath });
    } else {
      if (element.type === ANTV_INFOGRAPHIC && key === "syntax") {
        editor.tf.setNodes(
          { [key]: value, data: undefined },
          { at: elementPath },
        );
      } else {
        // Update the node property - convert boolean to string for numbered property
        editor.tf.setNodes({ [key]: value }, { at: elementPath });
      }
    }
    // Force update all the siblings so that the UI is updated
    element.children.forEach((child) => {
      editor.tf.setNodes(
        { lastUpdate: Date.now() },
        { at: editor.api.findPath(child) },
      );
    });
  });
}
