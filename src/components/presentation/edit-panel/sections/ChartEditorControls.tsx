"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { Check, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  ChartDataEditorDialog,
  type ChartDataMode,
  type ChartDataType,
  type SeriesChartType,
} from "@/components/notebook/presentation/editor/custom-elements/chart-data-editor-dialog";
import {
  AREA_CHART_ELEMENT,
  areChartTypesCompatible,
  BAR_CHART_ELEMENT,
  BOX_PLOT_CHART_ELEMENT,
  BUBBLE_CHART_ELEMENT,
  CANDLESTICK_CHART_ELEMENT,
  CHORD_CHART_ELEMENT,
  COMPOSED_CHART_ELEMENT,
  CONE_FUNNEL_CHART_ELEMENT,
  DONUT_CHART_ELEMENT,
  FUNNEL_CHART_ELEMENT,
  HEATMAP_CHART_ELEMENT,
  HISTOGRAM_CHART_ELEMENT,
  LINE_CHART_ELEMENT,
  LINEAR_GAUGE_ELEMENT,
  NIGHTINGALE_CHART_ELEMENT,
  OHLC_CHART_ELEMENT,
  PIE_CHART_ELEMENT,
  PYRAMID_CHART_ELEMENT,
  RADAR_CHART_ELEMENT,
  RADIAL_BAR_CHART_ELEMENT,
  RADIAL_COLUMN_CHART_ELEMENT,
  RADIAL_GAUGE_ELEMENT,
  RANGE_AREA_CHART_ELEMENT,
  RANGE_BAR_CHART_ELEMENT,
  SANKEY_CHART_ELEMENT,
  SCATTER_CHART_ELEMENT,
  SUNBURST_CHART_ELEMENT,
  TREEMAP_CHART_ELEMENT,
  WATERFALL_CHART_ELEMENT,
} from "@/components/notebook/presentation/editor/lib";
import { BlurInput } from "@/components/ui/blur-input";
import { ChartPreview } from "./ChartPreview";

// Chart type display names
const CHART_TYPE_NAMES: Record<string, string> = {
  "chart-pie": "Pie Chart",
  "chart-donut": "Donut Chart",
  "chart-bar": "Bar Chart",
  "chart-line": "Line Chart",
  "chart-area": "Area Chart",
  "chart-scatter": "Scatter Chart",
  "chart-bubble": "Bubble Chart",
  "chart-radar": "Radar Chart",
  "chart-radial-bar": "Radial Bar",
  "chart-composed": "Composed Chart",
  "chart-treemap": "Treemap",
  "chart-radial-gauge": "Radial Gauge",
  "chart-linear-gauge": "Linear Gauge",
  "chart-funnel": "Funnel Chart",
  "chart-cone-funnel": "Cone Funnel",
  "chart-pyramid": "Pyramid Chart",
  "chart-waterfall": "Waterfall Chart",
  "chart-range-bar": "Range Bar Chart",
  "chart-range-area": "Range Area Chart",
  "chart-box-plot": "Box Plot",
  "chart-candlestick": "Candlestick",
  "chart-ohlc": "OHLC",
  "chart-nightingale": "Nightingale",
  "chart-radial-column": "Radial Column",
  "chart-heatmap": "Heatmap",
  "chart-histogram": "Histogram",
  "chart-sunburst": "Sunburst",
  "chart-sankey": "Sankey",
  "chart-chord": "Chord",
};

const ALL_CHART_TYPES = [
  // Polar-categorical charts (label + value in polar form)
  { type: PIE_CHART_ELEMENT, name: "Pie Chart" },
  { type: DONUT_CHART_ELEMENT, name: "Donut Chart" },
  { type: RADAR_CHART_ELEMENT, name: "Radar Chart" },
  { type: RADIAL_BAR_CHART_ELEMENT, name: "Radial Bar" },
  { type: NIGHTINGALE_CHART_ELEMENT, name: "Nightingale" },
  { type: RADIAL_COLUMN_CHART_ELEMENT, name: "Radial Column" },
  // Cartesian charts (label + values on x/y axes)
  { type: BAR_CHART_ELEMENT, name: "Bar Chart" },
  { type: LINE_CHART_ELEMENT, name: "Line Chart" },
  { type: AREA_CHART_ELEMENT, name: "Area Chart" },
  { type: COMPOSED_CHART_ELEMENT, name: "Composed Chart" },
  { type: WATERFALL_CHART_ELEMENT, name: "Waterfall Chart" },
  // XY/XYZ coordinate charts
  { type: SCATTER_CHART_ELEMENT, name: "Scatter Chart" },
  { type: BUBBLE_CHART_ELEMENT, name: "Bubble Chart" },
  // Range charts
  { type: RANGE_BAR_CHART_ELEMENT, name: "Range Bar Chart" },
  { type: RANGE_AREA_CHART_ELEMENT, name: "Range Area Chart" },
  // Financial charts
  { type: CANDLESTICK_CHART_ELEMENT, name: "Candlestick" },
  { type: OHLC_CHART_ELEMENT, name: "OHLC" },
  // Statistical charts
  { type: BOX_PLOT_CHART_ELEMENT, name: "Box Plot" },
  { type: HISTOGRAM_CHART_ELEMENT, name: "Histogram" },
  // Hierarchical charts
  { type: TREEMAP_CHART_ELEMENT, name: "Treemap" },
  { type: SUNBURST_CHART_ELEMENT, name: "Sunburst" },
  // Flow charts
  { type: SANKEY_CHART_ELEMENT, name: "Sankey" },
  { type: CHORD_CHART_ELEMENT, name: "Chord" },
  // Funnel charts
  { type: FUNNEL_CHART_ELEMENT, name: "Funnel Chart" },
  { type: CONE_FUNNEL_CHART_ELEMENT, name: "Cone Funnel" },
  { type: PYRAMID_CHART_ELEMENT, name: "Pyramid Chart" },
  // Gauge charts
  { type: RADIAL_GAUGE_ELEMENT, name: "Radial Gauge" },
  { type: LINEAR_GAUGE_ELEMENT, name: "Linear Gauge" },
  // Other
  { type: HEATMAP_CHART_ELEMENT, name: "Heatmap" },
];

// Charts that support orientation (vertical/horizontal)
const ORIENTATION_SUPPORTED_TYPES = [
  "chart-bar",
  "chart-range-bar",
  "chart-funnel",
  "chart-cone-funnel",
  "chart-pyramid",
  "chart-linear-gauge",
  "chart-box-plot",
  "chart-waterfall",
];

// Chart types that support variants
const VARIANT_SUPPORTED_TYPES = [
  "chart-bar",
  "chart-area",
  "chart-pie",
  "chart-radar",
];

// Chart types that support curve type
const CURVE_TYPE_SUPPORTED = ["chart-line", "chart-area"];

// Scatter shape supported types
const SCATTER_SHAPE_SUPPORTED = ["chart-scatter"];

// Chart variant type for transformation options
type ChartVariant = {
  type: string;
  name: string;
  options?: Record<string, unknown>;
};

// Generate chart variants from compatible chart types
function generateChartVariants(
  compatibleTypes: { type: string; name: string }[],
): ChartVariant[] {
  const variants: ChartVariant[] = [];

  for (const chart of compatibleTypes) {
    // Bar chart - orientation and stacked variants
    if (chart.type === BAR_CHART_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Bar (Vertical)",
        options: { orientation: "vertical", variant: "default" },
      });
      variants.push({
        type: chart.type,
        name: "Bar (Horizontal)",
        options: { orientation: "horizontal", variant: "default" },
      });
      variants.push({
        type: chart.type,
        name: "Bar (Stacked Vertical)",
        options: { orientation: "vertical", variant: "stacked" },
      });
      variants.push({
        type: chart.type,
        name: "Bar (Stacked Horizontal)",
        options: { orientation: "horizontal", variant: "stacked" },
      });
      continue;
    }

    // Pie chart - just base type (Donut is a separate chart type)
    if (chart.type === PIE_CHART_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Pie",
        options: {},
      });
      continue;
    }

    // Radar chart - default and outline variants
    if (chart.type === RADAR_CHART_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Radar",
        options: { variant: "default" },
      });
      variants.push({
        type: chart.type,
        name: "Radar (Outline)",
        options: { variant: "outline" },
      });
      continue;
    }

    // Line chart - interpolation variants
    if (chart.type === LINE_CHART_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Line (Linear)",
        options: { interpolation: "linear" },
      });
      variants.push({
        type: chart.type,
        name: "Line (Smooth)",
        options: { interpolation: "smooth" },
      });
      variants.push({
        type: chart.type,
        name: "Line (Step)",
        options: { interpolation: "step" },
      });
      variants.push({
        type: chart.type,
        name: "Line (Step Start)",
        options: { interpolation: "step-start" },
      });
      variants.push({
        type: chart.type,
        name: "Line (Step End)",
        options: { interpolation: "step-end" },
      });
      continue;
    }

    // Area chart - interpolation variants
    if (chart.type === AREA_CHART_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Area (Linear)",
        options: { interpolation: "linear" },
      });
      variants.push({
        type: chart.type,
        name: "Area (Smooth)",
        options: { interpolation: "smooth" },
      });
      variants.push({
        type: chart.type,
        name: "Area (Step)",
        options: { interpolation: "step" },
      });
      variants.push({
        type: chart.type,
        name: "Area (Step Start)",
        options: { interpolation: "step-start" },
      });
      variants.push({
        type: chart.type,
        name: "Area (Step End)",
        options: { interpolation: "step-end" },
      });
      variants.push({
        type: chart.type,
        name: "Area (Stacked)",
        options: { interpolation: "smooth", variant: "stacked" },
      });
      continue;
    }

    // Range bar - orientation variants
    if (chart.type === RANGE_BAR_CHART_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Range Bar (Vertical)",
        options: { orientation: "vertical" },
      });
      variants.push({
        type: chart.type,
        name: "Range Bar (Horizontal)",
        options: { orientation: "horizontal" },
      });
      continue;
    }

    // Funnel variants
    if (chart.type === FUNNEL_CHART_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Funnel (Vertical)",
        options: { orientation: "vertical" },
      });
      variants.push({
        type: chart.type,
        name: "Funnel (Horizontal)",
        options: { orientation: "horizontal" },
      });
      continue;
    }

    // Gauge variants
    if (chart.type === RADIAL_GAUGE_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Radial Gauge (Needle)",
        options: { needle: { enabled: true }, bar: { enabled: false } },
      });
      variants.push({
        type: chart.type,
        name: "Radial Gauge (Bar)",
        options: { needle: { enabled: false }, bar: { enabled: true } },
      });
      variants.push({
        type: chart.type,
        name: "Radial Gauge (Both)",
        options: { needle: { enabled: true }, bar: { enabled: true } },
      });
      continue;
    }
    if (chart.type === LINEAR_GAUGE_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Linear Gauge (Horizontal)",
        options: { orientation: "horizontal" },
      });
      variants.push({
        type: chart.type,
        name: "Linear Gauge (Vertical)",
        options: { orientation: "vertical" },
      });
      continue;
    }

    // Cone Funnel variants
    if (chart.type === CONE_FUNNEL_CHART_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Cone Funnel (Vertical)",
        options: { orientation: "vertical" },
      });
      variants.push({
        type: chart.type,
        name: "Cone Funnel (Horizontal)",
        options: { orientation: "horizontal" },
      });
      continue;
    }

    // Pyramid Chart variants
    if (chart.type === PYRAMID_CHART_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Pyramid (Vertical)",
        options: { orientation: "vertical" },
      });
      variants.push({
        type: chart.type,
        name: "Pyramid (Horizontal)",
        options: { orientation: "horizontal" },
      });
      continue;
    }

    // Waterfall variants
    if (chart.type === WATERFALL_CHART_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Waterfall (Vertical)",
        options: { orientation: "vertical" },
      });
      variants.push({
        type: chart.type,
        name: "Waterfall (Horizontal)",
        options: { orientation: "horizontal" },
      });
      continue;
    }

    // Range Area variants (just base type, no variants yet)
    if (chart.type === RANGE_AREA_CHART_ELEMENT) {
      variants.push({
        type: chart.type,
        name: "Range Area",
        options: {},
      });
      continue;
    }

    // Default - just add the base chart type
    variants.push({
      type: chart.type,
      name: chart.name,
      options: {},
    });
  }

  return variants;
}

type AxisConfig = {
  title?: string | { text?: string; enabled?: boolean };
  label?: { enabled?: boolean };
  gridLine?: { enabled?: boolean };
};

interface ChartEditorControlsProps {
  slideId: string;
}

export function ChartEditorControls({ slideId }: ChartEditorControlsProps) {
  const { saveImmediately } = useDebouncedSave();
  const slides = usePresentationState((s) => s.slides);
  const setSlides = usePresentationState((s) => s.setSlides);
  const closeChartEditor = usePresentationState((s) => s.closeChartEditor);
  const [chartDataEditorOpen, setChartDataEditorOpen] = useState(false);

  // Get inline chart editor data from state (when editing inline chart elements)
  const chartEditorData = usePresentationState((s) => s.chartEditorData);
  const boundUpdateElement = usePresentationState((s) => s.boundUpdateElement);

  // Determine if we're editing an inline chart (via boundUpdateElement) or root image chart
  const isInlineChartEditing = !!boundUpdateElement && !!chartEditorData;

  // Get current slide data for root image chart editing
  const currentSlide = slides.find((s) => s.id === slideId);
  const rootImage = currentSlide?.rootImage;

  // Chart properties - use chartEditorData for inline charts, rootImage for root image charts
  const chartType = isInlineChartEditing
    ? chartEditorData.chartType
    : (rootImage?.chartType ?? "");
  const chartData = isInlineChartEditing
    ? (chartEditorData.chartData as ChartDataType | undefined)
    : (rootImage?.chartData as ChartDataType | undefined);
  const chartOptions = isInlineChartEditing
    ? chartEditorData.chartOptions
    : ((rootImage?.chartOptions ?? {}) as Record<string, unknown>);

  const normalizeTitle = (title?: AxisConfig["title"]) =>
    typeof title === "string" ? { text: title } : (title ?? {});
  const xAxisConfig = (chartOptions?.xAxis as AxisConfig) ?? {};
  const yAxisConfig = (chartOptions?.yAxis as AxisConfig) ?? {};

  // Get compatible chart types for conversion
  const compatibleChartTypes = ALL_CHART_TYPES.filter((chart) =>
    areChartTypesCompatible(chartType, chart.type),
  );

  // Chart title and subtitle
  const chartTitle = (chartOptions?.title as { text?: string })?.text ?? "";
  const chartSubtitle =
    (chartOptions?.subtitle as { text?: string })?.text ?? "";

  const showLegend = (chartOptions?.showLegend as boolean) !== false;
  const legendPosition =
    (chartOptions?.legend as { position?: string })?.position ?? "bottom";
  const legacyShowGrid = (chartOptions?.showGrid as boolean) !== false;
  const showAxisLabels = (chartOptions?.showAxisLabels as boolean) ?? true;
  const xAxisLabelEnabled = xAxisConfig.label?.enabled ?? showAxisLabels;
  const yAxisLabelEnabled = yAxisConfig.label?.enabled ?? showAxisLabels;
  const xAxisGridEnabled = xAxisConfig.gridLine?.enabled ?? false;
  const yAxisGridEnabled = yAxisConfig.gridLine?.enabled ?? legacyShowGrid;
  const xAxisTitleConfig = normalizeTitle(xAxisConfig.title);
  const xAxisTitleText = xAxisTitleConfig.text ?? "";
  const yAxisTitleConfig = normalizeTitle(yAxisConfig.title);
  const yAxisTitleText = yAxisTitleConfig.text ?? "";
  const xAxisTitleEnabled =
    xAxisTitleConfig.enabled ?? Boolean(xAxisTitleConfig.text);
  const yAxisTitleEnabled =
    yAxisTitleConfig.enabled ?? Boolean(yAxisTitleConfig.text);
  const variant = (chartOptions?.variant as string) ?? "default";
  const interpolation = (chartOptions?.interpolation as string) ?? "smooth";
  const scatterShape = (chartOptions?.scatterShape as string) ?? "circle";
  const seriesChartTypes =
    (chartOptions?.seriesChartTypes as Record<string, SeriesChartType>) ?? {};

  // Animation settings
  const animationEnabled =
    (chartOptions?.disableAnimation as boolean) === false ||
    (chartOptions?.animation as { enabled?: boolean })?.enabled === true;
  const animationDuration =
    (chartOptions?.animation as { duration?: number })?.duration ?? 500;

  // Background settings
  const backgroundFill =
    (chartOptions?.background as { fill?: string })?.fill ?? "";
  const backgroundVisible =
    (chartOptions?.background as { visible?: boolean })?.visible ?? false;

  // Donut chart inner labels
  type InnerLabelConfig = {
    text: string;
    fontWeight?: "normal" | "bold";
    fontSize?: number;
    color?: string;
    spacing?: number;
  };
  const innerLabels = (chartOptions?.innerLabels as InnerLabelConfig[]) ?? [];
  const innerCircleFill =
    (chartOptions?.innerCircle as { fill?: string })?.fill ?? "";
  const innerRadiusRatio = (chartOptions?.innerRadiusRatio as number) ?? 0.7;
  const innerLabelTitle = innerLabels[0]?.text ?? "";
  const innerLabelValue = innerLabels[1]?.text ?? "";

  // Check if chart type supports axes
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
  ].includes(chartType);

  // Check if this is a donut chart
  const isDonutChart = chartType === DONUT_CHART_ELEMENT;

  const isComposedChart = chartType === COMPOSED_CHART_ELEMENT;
  const supportsVariant = VARIANT_SUPPORTED_TYPES.includes(chartType);
  const supportsCurveType = CURVE_TYPE_SUPPORTED.includes(chartType);
  const supportsScatterShape = SCATTER_SHAPE_SUPPORTED.includes(chartType);
  const supportsOrientation = ORIENTATION_SUPPORTED_TYPES.includes(chartType);

  // Gauge chart detection
  const isRadialGauge = chartType === RADIAL_GAUGE_ELEMENT;
  const isLinearGauge = chartType === LINEAR_GAUGE_ELEMENT;
  const isGaugeChart = isRadialGauge || isLinearGauge;

  // Orientation value
  const orientation = (chartOptions?.orientation as string) ?? "vertical";

  // Gauge-specific options
  const needleEnabled =
    (chartOptions?.needle as { enabled?: boolean })?.enabled ?? false;
  const barEnabled =
    (chartOptions?.bar as { enabled?: boolean })?.enabled ?? true;

  // Get gauge value from chart data
  const getGaugeValue = (): number => {
    if (typeof chartData === "number") return chartData;
    if (
      typeof chartData === "object" &&
      chartData !== null &&
      "value" in chartData
    ) {
      return (chartData as { value: number }).value;
    }
    if (Array.isArray(chartData) && chartData.length > 0) {
      const firstItem = chartData[0] as Record<string, unknown>;
      const numericKey = Object.keys(firstItem).find(
        (key) => typeof firstItem[key] === "number",
      );
      if (numericKey) return firstItem[numericKey] as number;
    }
    return 50;
  };

  const handleGaugeValueChange = (newValue: number) => {
    if (!currentSlide) return;
    const clampedValue = Math.min(100, Math.max(0, newValue));
    handleChartDataUpdate([{ value: clampedValue }]);
  };

  // Determine chart data mode
  const chartDataMode: ChartDataMode =
    chartType === "chart-scatter" ? "xy" : "multi-series";

  // Update chart options handler
  const updateChartOption = (key: string, value: unknown) => {
    // For inline charts, use boundUpdateElement
    if (isInlineChartEditing && boundUpdateElement) {
      boundUpdateElement({ [key]: value });
      return;
    }

    // For root image charts, update via setSlides
    if (!currentSlide) return;

    setSlides(
      slides.map((slide) =>
        slide.id === slideId
          ? {
              ...slide,
              rootImage: {
                ...slide.rootImage!,
                chartOptions: {
                  ...slide.rootImage?.chartOptions,
                  [key]: value,
                },
              },
            }
          : slide,
      ),
    );
    void saveImmediately();
  };

  // Update multiple chart options handler
  const updateChartOptions = (updates: Record<string, unknown>) => {
    // For inline charts, use boundUpdateElement
    if (isInlineChartEditing && boundUpdateElement) {
      boundUpdateElement(updates);
      return;
    }

    // For root image charts, update via setSlides
    if (!currentSlide) return;

    setSlides(
      slides.map((slide) =>
        slide.id === slideId
          ? {
              ...slide,
              rootImage: {
                ...slide.rootImage!,
                chartOptions: {
                  ...slide.rootImage?.chartOptions,
                  ...updates,
                },
              },
            }
          : slide,
      ),
    );
    void saveImmediately();
  };

  // Update chart data handler
  const handleChartDataUpdate = (newData: ChartDataType) => {
    // For inline charts, use boundUpdateElement
    if (isInlineChartEditing && boundUpdateElement) {
      boundUpdateElement({ data: newData });
      return;
    }

    // For root image charts, update via setSlides
    if (!currentSlide) return;

    setSlides(
      slides.map((slide) =>
        slide.id === slideId
          ? {
              ...slide,
              rootImage: {
                ...slide.rootImage!,
                chartData: newData,
              },
            }
          : slide,
      ),
    );
    void saveImmediately();
  };

  // Update series chart types handler (for composed charts)
  const handleSeriesChartTypesUpdate = (
    types: Record<string, SeriesChartType>,
  ) => {
    updateChartOption("seriesChartTypes", types);
  };

  const updateAxisOption = (
    axisKey: "xAxis" | "yAxis",
    updates: Partial<AxisConfig>,
  ) => {
    const currentAxis = axisKey === "xAxis" ? xAxisConfig : yAxisConfig;
    const nextTitle = normalizeTitle(
      updates.title ?? currentAxis.title ?? undefined,
    );

    updateChartOption(axisKey, {
      ...currentAxis,
      ...updates,
      label: {
        ...currentAxis.label,
        ...updates.label,
      },
      gridLine: {
        ...currentAxis.gridLine,
        ...updates.gridLine,
      },
      title:
        updates.title !== undefined
          ? nextTitle
          : (currentAxis.title ?? nextTitle),
    });
  };

  // Remove chart handler
  const handleRemoveChart = () => {
    if (!currentSlide) return;

    setSlides(
      slides.map((slide) =>
        slide.id === slideId
          ? {
              ...slide,
              rootImage: {
                ...slide.rootImage!,
                chartType: undefined,
                chartData: undefined,
                chartOptions: undefined,
              },
            }
          : slide,
      ),
    );
    void saveImmediately();
    closeChartEditor();
  };

  // If no chart data, show empty state
  if (!chartType || !chartData) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No chart data available. Drop a chart element onto the image area to
          add one.
        </p>
      </div>
    );
  }

  const chartDisplayName = CHART_TYPE_NAMES[chartType] ?? "Chart";

  return (
    <>
      <Tabs defaultValue="conversion" className="flex h-full flex-col">
        <div className="border-b px-2 py-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          {/* CONVERSION TAB */}
          <TabsContent value="conversion" className="m-0">
            <div className="space-y-6 p-6">
              {/* Chart Conversion Options */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Transform Chart</Label>
                <p className="text-xs text-muted-foreground">
                  Click a chart variant to transform your data
                </p>
              </div>

              {/* Group variants by base chart type */}
              {(() => {
                const variants = generateChartVariants(compatibleChartTypes);

                // Get the chart type display name
                const getGroupName = (type: string) => {
                  if (type === BAR_CHART_ELEMENT) return "Bar Charts";
                  if (type === LINE_CHART_ELEMENT) return "Line Charts";
                  if (type === AREA_CHART_ELEMENT) return "Area Charts";
                  if (type === FUNNEL_CHART_ELEMENT) return "Funnel Charts";
                  if (type === RANGE_BAR_CHART_ELEMENT) return "Range Charts";
                  if (type === LINEAR_GAUGE_ELEMENT) return "Gauge Charts";
                  if (type === RADIAL_GAUGE_ELEMENT) return "Gauge Charts";
                  // Group polar charts together
                  if (
                    type === RADIAL_BAR_CHART_ELEMENT ||
                    type === NIGHTINGALE_CHART_ELEMENT ||
                    type === RADIAL_COLUMN_CHART_ELEMENT
                  )
                    return "Polar Charts";
                  // Group pie charts together
                  if (
                    type === PIE_CHART_ELEMENT ||
                    type === DONUT_CHART_ELEMENT
                  )
                    return "Pie Charts";
                  // Group hierarchical charts
                  if (
                    type === TREEMAP_CHART_ELEMENT ||
                    type === SUNBURST_CHART_ELEMENT
                  )
                    return "Hierarchical Charts";
                  // Group coordinate charts
                  if (
                    type === SCATTER_CHART_ELEMENT ||
                    type === BUBBLE_CHART_ELEMENT
                  )
                    return "Coordinate Charts";
                  // Group flow charts
                  if (
                    type === SANKEY_CHART_ELEMENT ||
                    type === CHORD_CHART_ELEMENT
                  )
                    return "Flow Charts";
                  return CHART_TYPE_NAMES[type] || "Charts";
                };

                // Group variants by display group name (not just chart type)
                const groupedByName = variants.reduce(
                  (acc, variant) => {
                    const groupName = getGroupName(variant.type);
                    if (!acc[groupName]) acc[groupName] = [];
                    acc[groupName].push(variant);
                    return acc;
                  },
                  {} as Record<string, ChartVariant[]>,
                );

                return Object.entries(groupedByName).map(
                  ([groupName, chartVariants]) => (
                    <div key={groupName} className="space-y-3">
                      {/* Show group header */}
                      <h3 className="text-xs font-medium text-muted-foreground">
                        {groupName}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {chartVariants.map((variant, index) => {
                          // Check if this variant matches current chart type AND options
                          const isCurrentVariant =
                            chartType === variant.type &&
                            (variant.options?.orientation === undefined ||
                              variant.options?.orientation ===
                                (chartOptions?.orientation ?? "vertical")) &&
                            (variant.options?.interpolation === undefined ||
                              variant.options?.interpolation ===
                                (chartOptions?.interpolation ?? "smooth")) &&
                            (variant.options?.variant === undefined ||
                              variant.options?.variant ===
                                (chartOptions?.variant ?? "default")) &&
                            (variant.options?.needle === undefined ||
                              JSON.stringify(variant.options?.needle) ===
                                JSON.stringify(chartOptions?.needle)) &&
                            (variant.options?.bar === undefined ||
                              JSON.stringify(variant.options?.bar) ===
                                JSON.stringify(chartOptions?.bar));

                          return (
                            <button
                              key={`${variant.type}-${variant.name}-${index}`}
                              onClick={() => {
                                // For inline charts, use boundUpdateElement
                                if (
                                  isInlineChartEditing &&
                                  boundUpdateElement
                                ) {
                                  if (variant.type !== chartType) {
                                    // Change chart type and apply options
                                    boundUpdateElement({
                                      type: variant.type,
                                      ...variant.options,
                                    });
                                  } else {
                                    // Same chart type, update options only
                                    boundUpdateElement(variant.options ?? {});
                                  }
                                  return;
                                }

                                // For root image charts, use setSlides
                                if (variant.type !== chartType) {
                                  // Change chart type and apply options
                                  setSlides(
                                    slides.map((slide) =>
                                      slide.id === slideId
                                        ? {
                                            ...slide,
                                            rootImage: {
                                              ...slide.rootImage!,
                                              chartType: variant.type,
                                              chartOptions: {
                                                ...slide.rootImage
                                                  ?.chartOptions,
                                                ...variant.options,
                                              },
                                            },
                                          }
                                        : slide,
                                    ),
                                  );
                                  void saveImmediately();
                                } else {
                                  // Same chart type, update options directly via state
                                  setSlides(
                                    slides.map((slide) =>
                                      slide.id === slideId
                                        ? {
                                            ...slide,
                                            rootImage: {
                                              ...slide.rootImage!,
                                              chartOptions: {
                                                ...slide.rootImage
                                                  ?.chartOptions,
                                                ...variant.options,
                                              },
                                            },
                                          }
                                        : slide,
                                    ),
                                  );
                                  void saveImmediately();
                                }
                              }}
                              className={cn(
                                "group relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all hover:border-primary/50 hover:bg-accent",
                                isCurrentVariant
                                  ? "border-primary bg-primary/5"
                                  : "border-border",
                              )}
                            >
                              {isCurrentVariant && (
                                <div className="absolute top-2 right-2 z-10 rounded-full bg-primary p-1">
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                </div>
                              )}
                              <div className="w-full overflow-hidden rounded-md bg-background/50">
                                <ChartPreview
                                  chartType={variant.type}
                                  variantOptions={variant.options}
                                  className="h-full w-full"
                                />
                              </div>
                              <span className="text-center text-xs font-medium">
                                {variant.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ),
                );
              })()}
            </div>
          </TabsContent>

          {/* DATA TAB */}
          <TabsContent value="data" className="m-0">
            <div className="space-y-6 p-6">
              {/* Edit Data Button */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Edit Chart Data</Label>
                <Button
                  onClick={() => setChartDataEditorOpen(true)}
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Chart Data
                </Button>
              </div>

              {/* Gauge Value Input (for gauge charts) */}
              {isGaugeChart && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Gauge Value
                  </Label>
                  <BlurInput
                    type="number"
                    value={getGaugeValue()}
                    onChange={(value) =>
                      handleGaugeValueChange(Number(value) || 0)
                    }
                    min={0}
                    max={100}
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Value between 0-100
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* CUSTOMIZE TAB */}
          <TabsContent value="customize" className="m-0">
            <div className="space-y-6 p-6">
              {/* Chart Variant (for supported types) */}
              {supportsVariant && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Variant
                  </Label>
                  <Select
                    value={variant}
                    onValueChange={(v) => updateChartOption("variant", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      {chartType === "chart-bar" && (
                        <SelectItem value="stacked">Stacked</SelectItem>
                      )}
                      {chartType === "chart-area" && (
                        <SelectItem value="stacked">Stacked</SelectItem>
                      )}
                      {chartType === "chart-pie" && (
                        <SelectItem value="donut">Donut</SelectItem>
                      )}
                      {chartType === "chart-radar" && (
                        <SelectItem value="outline">Outline</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Interpolation (for line/area charts) */}
              {supportsCurveType && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Interpolation
                  </Label>
                  <Select
                    value={interpolation}
                    onValueChange={(v) => updateChartOption("interpolation", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select interpolation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="smooth">Smooth</SelectItem>
                      <SelectItem value="step">Step</SelectItem>
                      <SelectItem value="step-start">Step Start</SelectItem>
                      <SelectItem value="step-end">Step End</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Scatter Shape (for scatter charts) */}
              {supportsScatterShape && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Point Shape
                  </Label>
                  <Select
                    value={scatterShape}
                    onValueChange={(v) => updateChartOption("scatterShape", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="cross">Cross</SelectItem>
                      <SelectItem value="diamond">Diamond</SelectItem>
                      <SelectItem value="heart">Heart</SelectItem>
                      <SelectItem value="pin">Pin</SelectItem>
                      <SelectItem value="plus">Plus</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="star">Star</SelectItem>
                      <SelectItem value="triangle">Triangle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Orientation (for supported chart types) */}
              {supportsOrientation && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Orientation
                  </Label>
                  <Select
                    value={orientation}
                    onValueChange={(v) => updateChartOption("orientation", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vertical">Vertical</SelectItem>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Radial Gauge specific controls */}
              {isRadialGauge && (
                <div className="space-y-4 rounded-lg border p-4">
                  <Label className="text-sm font-medium">Gauge Options</Label>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="needle-enabled" className="text-sm">
                      Show Needle
                    </Label>
                    <Switch
                      id="needle-enabled"
                      checked={needleEnabled}
                      onCheckedChange={(checked) =>
                        updateChartOption("needle", { enabled: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bar-enabled" className="text-sm">
                      Show Bar
                    </Label>
                    <Switch
                      id="bar-enabled"
                      checked={barEnabled}
                      onCheckedChange={(checked) =>
                        updateChartOption("bar", { enabled: checked })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Chart Title & Subtitle */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground">
                  Chart Labels
                </Label>
                <div className="space-y-2">
                  <BlurInput
                    id="chart-title"
                    placeholder="Chart title"
                    value={chartTitle}
                    onChange={(value) =>
                      updateChartOption("title", { text: String(value) })
                    }
                  />
                  <BlurInput
                    id="chart-subtitle"
                    placeholder="Chart subtitle"
                    value={chartSubtitle}
                    onChange={(value) =>
                      updateChartOption("subtitle", { text: String(value) })
                    }
                  />
                </div>
              </div>

              {/* Legend Settings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="legend-toggle">Legend</Label>
                  <Switch
                    id="legend-toggle"
                    checked={showLegend}
                    onCheckedChange={(checked) => {
                      updateChartOptions({
                        showLegend: checked,
                        legend: {
                          enabled: checked,
                          position: legendPosition,
                        },
                      });
                    }}
                  />
                </div>
                <div
                  className={cn(
                    "rounded-lg border p-3 transition-opacity",
                    !showLegend && "opacity-50",
                  )}
                >
                  <Label htmlFor="legend-position" className="text-xs">
                    Position
                  </Label>
                  <Select
                    value={legendPosition}
                    disabled={!showLegend}
                    onValueChange={(value) => {
                      updateChartOptions({
                        showLegend: showLegend,
                        legend: {
                          enabled: showLegend,
                          position: value,
                        },
                      });
                    }}
                  >
                    <SelectTrigger id="legend-position" className="mt-1.5">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Animation Settings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="animation-toggle">Animation</Label>
                  <Switch
                    id="animation-toggle"
                    checked={animationEnabled}
                    onCheckedChange={(checked) => {
                      updateChartOptions({
                        disableAnimation: !checked,
                        animation: {
                          enabled: checked,
                          duration: animationDuration,
                        },
                      });
                    }}
                  />
                </div>
                <div
                  className={cn(
                    "rounded-lg border p-3 transition-opacity",
                    !animationEnabled && "opacity-50",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animation-duration" className="text-xs">
                      Duration
                    </Label>
                    <span className="text-xs text-muted-foreground">
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
                    onValueChange={([value]) => {
                      updateChartOption("animation", {
                        enabled: animationEnabled,
                        duration: value,
                      });
                    }}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Background Settings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="background-toggle">Background</Label>
                  <Switch
                    id="background-toggle"
                    checked={backgroundVisible}
                    onCheckedChange={(checked) => {
                      updateChartOptions({
                        background: {
                          fill: backgroundFill,
                          visible: checked,
                        },
                      });
                    }}
                  />
                </div>
                <div
                  className={cn(
                    "rounded-lg border p-3 transition-opacity",
                    !backgroundVisible && "opacity-50",
                  )}
                >
                  <Label htmlFor="background-fill" className="text-xs">
                    Color
                  </Label>
                  <div className="mt-1.5 flex gap-2">
                    <Input
                      id="background-fill"
                      type="color"
                      value={backgroundFill || "#ffffff"}
                      disabled={!backgroundVisible}
                      onChange={(e) => {
                        updateChartOption("background", {
                          fill: e.target.value,
                          visible: backgroundVisible,
                        });
                      }}
                      className="h-8 w-12 p-1"
                    />
                    <BlurInput
                      value={backgroundFill}
                      disabled={!backgroundVisible}
                      onChange={(value) => {
                        updateChartOption("background", {
                          fill: String(value),
                          visible: backgroundVisible,
                        });
                      }}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Donut Inner Labels - Only for Donut Charts */}
              {isDonutChart && (
                <div className="space-y-3 rounded-lg border p-4">
                  <h5 className="text-sm font-medium">Inner Labels</h5>
                  <div className="space-y-2">
                    <BlurInput
                      id="inner-label-title"
                      placeholder="Title (e.g. Total)"
                      value={innerLabelTitle}
                      onChange={(value) => {
                        const newLabels: InnerLabelConfig[] = [];
                        if (value) {
                          newLabels.push({
                            text: String(value),
                            fontWeight: "bold",
                          });
                        }
                        if (innerLabelValue) {
                          newLabels.push({
                            text: innerLabelValue,
                            spacing: 4,
                            fontSize: 32,
                          });
                        }
                        updateChartOption("innerLabels", newLabels);
                      }}
                    />
                    <BlurInput
                      id="inner-label-value"
                      placeholder="Value (e.g. $100,000)"
                      value={innerLabelValue}
                      onChange={(value) => {
                        const newLabels: InnerLabelConfig[] = [];
                        if (innerLabelTitle) {
                          newLabels.push({
                            text: innerLabelTitle,
                            fontWeight: "bold",
                          });
                        }
                        if (value) {
                          newLabels.push({
                            text: String(value),
                            spacing: 4,
                            fontSize: 32,
                          });
                        }
                        updateChartOption("innerLabels", newLabels);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inner-circle-fill" className="text-xs">
                      Background Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="inner-circle-fill"
                        type="color"
                        value={innerCircleFill || "#f0f0f0"}
                        onChange={(e) =>
                          updateChartOption("innerCircle", {
                            fill: e.target.value,
                          })
                        }
                        className="h-8 w-12 p-1"
                      />
                      <BlurInput
                        value={innerCircleFill}
                        onChange={(value) =>
                          updateChartOption("innerCircle", {
                            fill: String(value),
                          })
                        }
                        placeholder="#f0f0f0"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
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
                      onValueChange={([value]) => {
                        if (value !== undefined) {
                          updateChartOption("innerRadiusRatio", value / 100);
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Axis controls - only for charts with axes */}
              {supportsAxes && (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">X-Axis</Label>
                    <div className="flex gap-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="x-axis-labels" className="text-xs">
                          Labels
                        </Label>
                        <Switch
                          id="x-axis-labels"
                          checked={xAxisLabelEnabled}
                          onCheckedChange={(checked) =>
                            updateAxisOption("xAxis", {
                              label: { enabled: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="x-axis-grid" className="text-xs">
                          Grid
                        </Label>
                        <Switch
                          id="x-axis-grid"
                          checked={xAxisGridEnabled}
                          onCheckedChange={(checked) =>
                            updateAxisOption("xAxis", {
                              gridLine: { enabled: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="x-axis-title-toggle" className="text-xs">
                      Title
                    </Label>
                    <Switch
                      id="x-axis-title-toggle"
                      checked={xAxisTitleEnabled}
                      onCheckedChange={(checked) =>
                        updateAxisOption("xAxis", {
                          title: { ...xAxisTitleConfig, enabled: checked },
                        })
                      }
                    />
                  </div>
                  <BlurInput
                    id="x-axis-title"
                    placeholder="X-axis title"
                    value={xAxisTitleText}
                    disabled={!xAxisTitleEnabled}
                    onChange={(value) =>
                      updateAxisOption("xAxis", {
                        title: { ...xAxisTitleConfig, text: String(value) },
                      })
                    }
                  />

                  <div className="h-px bg-border" />

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Y-Axis</Label>
                    <div className="flex gap-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="y-axis-labels" className="text-xs">
                          Labels
                        </Label>
                        <Switch
                          id="y-axis-labels"
                          checked={yAxisLabelEnabled}
                          onCheckedChange={(checked) =>
                            updateAxisOption("yAxis", {
                              label: { enabled: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="y-axis-grid" className="text-xs">
                          Grid
                        </Label>
                        <Switch
                          id="y-axis-grid"
                          checked={yAxisGridEnabled}
                          onCheckedChange={(checked) =>
                            updateAxisOption("yAxis", {
                              gridLine: { enabled: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="y-axis-title-toggle" className="text-xs">
                      Title
                    </Label>
                    <Switch
                      id="y-axis-title-toggle"
                      checked={yAxisTitleEnabled}
                      onCheckedChange={(checked) =>
                        updateAxisOption("yAxis", {
                          title: { ...yAxisTitleConfig, enabled: checked },
                        })
                      }
                    />
                  </div>
                  <BlurInput
                    id="y-axis-title"
                    placeholder="Y-axis title"
                    value={yAxisTitleText}
                    disabled={!yAxisTitleEnabled}
                    onChange={(value) =>
                      updateAxisOption("yAxis", {
                        title: { ...yAxisTitleConfig, text: String(value) },
                      })
                    }
                  />
                </div>
              )}

              {/* Remove Chart */}
              <div className="border-t pt-4">
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={handleRemoveChart}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Chart
                </Button>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Chart Data Editor Dialog */}
      <ChartDataEditorDialog
        open={chartDataEditorOpen}
        onOpenChange={setChartDataEditorOpen}
        data={chartData || []}
        onDataChange={handleChartDataUpdate}
        chartType={chartDataMode}
        title={`Edit ${chartDisplayName} Data`}
        isComposedChart={isComposedChart}
        seriesChartTypes={seriesChartTypes}
        onSeriesChartTypesChange={handleSeriesChartTypesUpdate}
      />
    </>
  );
}
