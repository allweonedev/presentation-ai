import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
// Existing chart components
import AreaChartElement from "../custom-elements/area-chart";
import BarGraphElement from "../custom-elements/bar-graph";
import BubbleChartElement from "../custom-elements/bubble-chart";
import ComposedChartElement from "../custom-elements/composed-chart";
import DonutChartElement from "../custom-elements/donut-chart";
import LineGraphElement from "../custom-elements/line-graph";
import PieChartElement from "../custom-elements/pie-chart";
import RadarChartElement from "../custom-elements/radar-chart";
import RadialBarChartElement from "../custom-elements/radial-bar-chart";
import ScatterPlotElement from "../custom-elements/scatter-plot";
import TreemapChartElement from "../custom-elements/treemap-chart";
// New chart components - Phase 1
import HeatmapChartElement from "../custom-elements/heatmap-chart";
import HistogramChartElement from "../custom-elements/histogram-chart";
// New chart components - Phase 2
import RangeAreaChartElement from "../custom-elements/range-area-chart";
import RangeBarChartElement from "../custom-elements/range-bar-chart";
import WaterfallChartElement from "../custom-elements/waterfall-chart";
// New chart components - Phase 3
import BoxPlotChartElement from "../custom-elements/box-plot-chart";
import CandlestickChartElement from "../custom-elements/candlestick-chart";
import OhlcChartElement from "../custom-elements/ohlc-chart";
// New chart components - Phase 4
import NightingaleChartElement from "../custom-elements/nightingale-chart";
import RadialColumnChartElement from "../custom-elements/radial-column-chart";
// New chart components - Phase 5
import ChordChartElement from "../custom-elements/chord-chart";
import SankeyChartElement from "../custom-elements/sankey-chart";
import SunburstChartElement from "../custom-elements/sunburst-chart";
// New chart components - Phase 6
import ConeFunnelChartElement from "../custom-elements/cone-funnel-chart";
import FunnelChartElement from "../custom-elements/funnel-chart";
import PyramidChartElement from "../custom-elements/pyramid-chart";
// New chart components - Phase 7
import LinearGaugeElement from "../custom-elements/linear-gauge";
import RadialGaugeElement from "../custom-elements/radial-gauge";
// Static chart components - Existing
import AreaChartStatic from "../custom-elements/static/area-chart-static";
import BarGraphStatic from "../custom-elements/static/bar-graph-static";
import BubbleChartStatic from "../custom-elements/static/bubble-chart-static";
import ComposedChartStatic from "../custom-elements/static/composed-chart-static";
import DonutChartStatic from "../custom-elements/static/donut-chart-static";
import LineGraphStatic from "../custom-elements/static/line-graph-static";
import PieChartStatic from "../custom-elements/static/pie-chart-static";
import RadarChartStatic from "../custom-elements/static/radar-chart-static";
import RadialBarChartStatic from "../custom-elements/static/radial-bar-chart-static";
import ScatterPlotStatic from "../custom-elements/static/scatter-plot-static";
import TreemapChartStatic from "../custom-elements/static/treemap-chart-static";
// Static chart components - New
import BoxPlotChartStatic from "../custom-elements/static/box-plot-chart-static";
import CandlestickChartStatic from "../custom-elements/static/candlestick-chart-static";
import ChordChartStatic from "../custom-elements/static/chord-chart-static";
import ConeFunnelChartStatic from "../custom-elements/static/cone-funnel-chart-static";
import FunnelChartStatic from "../custom-elements/static/funnel-chart-static";
import HeatmapChartStatic from "../custom-elements/static/heatmap-chart-static";
import HistogramChartStatic from "../custom-elements/static/histogram-chart-static";
import LinearGaugeStatic from "../custom-elements/static/linear-gauge-static";
import NightingaleChartStatic from "../custom-elements/static/nightingale-chart-static";
import OhlcChartStatic from "../custom-elements/static/ohlc-chart-static";
import PyramidChartStatic from "../custom-elements/static/pyramid-chart-static";
import RadialColumnChartStatic from "../custom-elements/static/radial-column-chart-static";
import RadialGaugeStatic from "../custom-elements/static/radial-gauge-static";
import RangeAreaChartStatic from "../custom-elements/static/range-area-chart-static";
import RangeBarChartStatic from "../custom-elements/static/range-bar-chart-static";
import SankeyChartStatic from "../custom-elements/static/sankey-chart-static";
import SunburstChartStatic from "../custom-elements/static/sunburst-chart-static";
import WaterfallChartStatic from "../custom-elements/static/waterfall-chart-static";
import {
  AREA_CHART_ELEMENT,
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
} from "../lib";

// Available chart types for composed chart series
export type SeriesChartType = "bar" | "line" | "area" | "scatter";

// Chart title configuration
export interface ChartTitleConfig {
  text?: string;
  fontSize?: number;
  color?: string;
}

// Chart axis label configuration
export interface ChartAxisLabelConfig {
  enabled?: boolean;
}

// Chart axis grid line configuration
export interface ChartAxisGridLineConfig {
  enabled?: boolean;
  style?: "solid" | "dashed" | "dotted";
}

// Chart axis configuration (per-axis settings for X and Y)
export interface ChartAxisConfig {
  title?: string | { text?: string; enabled?: boolean };
  label?: ChartAxisLabelConfig;
  gridLine?: ChartAxisGridLineConfig;
  min?: number;
  max?: number;
}

// Chart animation configuration
export interface ChartAnimationConfig {
  enabled: boolean;
  duration?: number; // in milliseconds
}

// Chart legend configuration
export interface ChartLegendConfig {
  enabled: boolean;
  position?: "top" | "right" | "bottom" | "left";
}

// Chart background configuration
export interface ChartBackgroundConfig {
  fill?: string;
  visible?: boolean;
}

// Donut inner label configuration
export interface ChartInnerLabelConfig {
  text: string;
  fontWeight?: "normal" | "bold";
  fontSize?: number;
  color?: string;
  spacing?: number;
}

// Donut inner circle configuration
export interface ChartInnerCircleConfig {
  fill?: string;
}

// Gauge needle configuration
export interface ChartNeedleConfig {
  enabled?: boolean;
}

// Gauge bar configuration
export interface ChartBarConfig {
  enabled?: boolean;
  fill?: string;
}

// Chart marker configuration
export interface ChartMarkerConfig {
  shape?:
    | "circle"
    | "cross"
    | "diamond"
    | "heart"
    | "plus"
    | "pin"
    | "square"
    | "star"
    | "triangle";
  size?: number;
  fill?: string;
  stroke?: string;
}

export type TChartNode = TElement & {
  chartType?:
    | "bar"
    | "line"
    | "pie"
    | "scatter"
    | "histogram"
    | "donut"
    | "bubble"
    | "heatmap"
    | "range-bar"
    | "range-area"
    | "waterfall"
    | "box-plot"
    | "candlestick"
    | "ohlc"
    | "nightingale"
    | "radial-column"
    | "sunburst"
    | "sankey"
    | "chord"
    | "funnel"
    | "cone-funnel"
    | "pyramid"
    | "radial-gauge"
    | "linear-gauge";
  data?: unknown;
  options?: Record<string, unknown>;
  // Chart customization options
  variant?: "default" | "stacked" | "donut" | "outline" | "bubble";
  orientation?: "vertical" | "horizontal"; // Charts that render left-to-right vs top-to-bottom
  curveType?: "linear" | "monotone" | "step" | "natural";
  scatterShape?:
    | "circle"
    | "cross"
    | "diamond"
    | "heart"
    | "plus"
    | "pin"
    | "square"
    | "star"
    | "triangle";
  showLegend?: boolean;
  showGrid?: boolean;
  showAxisLabels?: boolean;
  innerRadius?: number;
  disableAnimation?: boolean;
  // Color properties
  color?: string; // Primary color for single-color charts
  colors?: string[]; // Array of colors for multi-color charts (pie, radial bar)
  // Composed chart specific: map of series name to chart type
  seriesChartTypes?: Record<string, SeriesChartType>;

  // Enhanced chart configuration options
  title?: ChartTitleConfig;
  subtitle?: ChartTitleConfig;
  xAxis?: ChartAxisConfig;
  yAxis?: ChartAxisConfig;
  animation?: ChartAnimationConfig;
  legend?: ChartLegendConfig;
  background?: ChartBackgroundConfig;

  // Line/Area interpolation (AG Charts type)
  // step-start and step-end use { type: "step", position: "start"|"end" }
  interpolation?: "linear" | "smooth" | "step" | "step-start" | "step-end";

  // Donut inner labels configuration
  innerLabels?: ChartInnerLabelConfig[];
  innerCircle?: ChartInnerCircleConfig;
  innerRadiusRatio?: number;

  // Gauge needle/bar configuration
  needle?: ChartNeedleConfig;
  bar?: ChartBarConfig;

  // Marker configuration (for scatter/bubble/line)
  marker?: ChartMarkerConfig;
};

// =====================================================
// EDITABLE CHART PLUGINS
// =====================================================

// Existing chart plugins
export const PieChartPlugin = createTPlatePlugin({
  key: PIE_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: PIE_CHART_ELEMENT,
    component: PieChartElement,
  },
});

export const BarChartPlugin = createTPlatePlugin({
  key: BAR_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: BAR_CHART_ELEMENT,
    component: BarGraphElement,
  },
});

export const AreaChartPlugin = createTPlatePlugin({
  key: AREA_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: AREA_CHART_ELEMENT,
    component: AreaChartElement,
  },
});

export const ScatterChartPlugin = createTPlatePlugin({
  key: SCATTER_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: SCATTER_CHART_ELEMENT,
    component: ScatterPlotElement,
  },
});

export const LineChartPlugin = createTPlatePlugin({
  key: LINE_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: LINE_CHART_ELEMENT,
    component: LineGraphElement,
  },
});

export const RadarChartPlugin = createTPlatePlugin({
  key: RADAR_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: RADAR_CHART_ELEMENT,
    component: RadarChartElement,
  },
});

export const RadialBarChartPlugin = createTPlatePlugin({
  key: RADIAL_BAR_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: RADIAL_BAR_CHART_ELEMENT,
    component: RadialBarChartElement,
  },
});

export const ComposedChartPlugin = createTPlatePlugin({
  key: COMPOSED_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: COMPOSED_CHART_ELEMENT,
    component: ComposedChartElement,
  },
});

export const TreemapChartPlugin = createTPlatePlugin({
  key: TREEMAP_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: TREEMAP_CHART_ELEMENT,
    component: TreemapChartElement,
  },
});

export const BubbleChartPlugin = createTPlatePlugin({
  key: BUBBLE_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: BUBBLE_CHART_ELEMENT,
    component: BubbleChartElement,
  },
});

export const DonutChartPlugin = createTPlatePlugin({
  key: DONUT_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: DONUT_CHART_ELEMENT,
    component: DonutChartElement,
  },
});

// New chart plugins - Phase 1: Standard Series
export const HistogramChartPlugin = createTPlatePlugin({
  key: HISTOGRAM_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: HISTOGRAM_CHART_ELEMENT,
    component: HistogramChartElement,
  },
});

export const HeatmapChartPlugin = createTPlatePlugin({
  key: HEATMAP_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: HEATMAP_CHART_ELEMENT,
    component: HeatmapChartElement,
  },
});

// New chart plugins - Phase 2: Range Charts
export const RangeBarChartPlugin = createTPlatePlugin({
  key: RANGE_BAR_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: RANGE_BAR_CHART_ELEMENT,
    component: RangeBarChartElement,
  },
});

export const RangeAreaChartPlugin = createTPlatePlugin({
  key: RANGE_AREA_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: RANGE_AREA_CHART_ELEMENT,
    component: RangeAreaChartElement,
  },
});

export const WaterfallChartPlugin = createTPlatePlugin({
  key: WATERFALL_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: WATERFALL_CHART_ELEMENT,
    component: WaterfallChartElement,
  },
});

// New chart plugins - Phase 3: Financial Charts
export const BoxPlotChartPlugin = createTPlatePlugin({
  key: BOX_PLOT_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: BOX_PLOT_CHART_ELEMENT,
    component: BoxPlotChartElement,
  },
});

export const CandlestickChartPlugin = createTPlatePlugin({
  key: CANDLESTICK_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: CANDLESTICK_CHART_ELEMENT,
    component: CandlestickChartElement,
  },
});

export const OhlcChartPlugin = createTPlatePlugin({
  key: OHLC_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: OHLC_CHART_ELEMENT,
    component: OhlcChartElement,
  },
});

// New chart plugins - Phase 4: Polar Charts
export const NightingaleChartPlugin = createTPlatePlugin({
  key: NIGHTINGALE_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: NIGHTINGALE_CHART_ELEMENT,
    component: NightingaleChartElement,
  },
});

export const RadialColumnChartPlugin = createTPlatePlugin({
  key: RADIAL_COLUMN_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: RADIAL_COLUMN_CHART_ELEMENT,
    component: RadialColumnChartElement,
  },
});

// New chart plugins - Phase 5: Hierarchical Charts
export const SunburstChartPlugin = createTPlatePlugin({
  key: SUNBURST_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: SUNBURST_CHART_ELEMENT,
    component: SunburstChartElement,
  },
});

export const SankeyChartPlugin = createTPlatePlugin({
  key: SANKEY_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: SANKEY_CHART_ELEMENT,
    component: SankeyChartElement,
  },
});

export const ChordChartPlugin = createTPlatePlugin({
  key: CHORD_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: CHORD_CHART_ELEMENT,
    component: ChordChartElement,
  },
});

// New chart plugins - Phase 6: Funnel Charts
export const FunnelChartPlugin = createTPlatePlugin({
  key: FUNNEL_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: FUNNEL_CHART_ELEMENT,
    component: FunnelChartElement,
  },
});

export const ConeFunnelChartPlugin = createTPlatePlugin({
  key: CONE_FUNNEL_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: CONE_FUNNEL_CHART_ELEMENT,
    component: ConeFunnelChartElement,
  },
});

export const PyramidChartPlugin = createTPlatePlugin({
  key: PYRAMID_CHART_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: PYRAMID_CHART_ELEMENT,
    component: PyramidChartElement,
  },
});

// New chart plugins - Phase 7: Gauge Charts
export const RadialGaugePlugin = createTPlatePlugin({
  key: RADIAL_GAUGE_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: RADIAL_GAUGE_ELEMENT,
    component: RadialGaugeElement,
  },
});

export const LinearGaugePlugin = createTPlatePlugin({
  key: LINEAR_GAUGE_ELEMENT,
  node: {
    isElement: true,
    isVoid: true,
    type: LINEAR_GAUGE_ELEMENT,
    component: LinearGaugeElement,
  },
});

// =====================================================
// STATIC CHART PLUGINS
// =====================================================

// Existing static plugins
export const PieChartStaticPlugin = createTPlatePlugin({
  key: PIE_CHART_ELEMENT,
  node: { isElement: true, component: PieChartStatic },
});

export const BarChartStaticPlugin = createTPlatePlugin({
  key: BAR_CHART_ELEMENT,
  node: { isElement: true, component: BarGraphStatic },
});

export const AreaChartStaticPlugin = createTPlatePlugin({
  key: AREA_CHART_ELEMENT,
  node: { isElement: true, component: AreaChartStatic },
});

export const ScatterChartStaticPlugin = createTPlatePlugin({
  key: SCATTER_CHART_ELEMENT,
  node: { isElement: true, component: ScatterPlotStatic },
});

export const LineChartStaticPlugin = createTPlatePlugin({
  key: LINE_CHART_ELEMENT,
  node: { isElement: true, component: LineGraphStatic },
});

export const RadarChartStaticPlugin = createTPlatePlugin({
  key: RADAR_CHART_ELEMENT,
  node: { isElement: true, component: RadarChartStatic },
});

export const RadialBarChartStaticPlugin = createTPlatePlugin({
  key: RADIAL_BAR_CHART_ELEMENT,
  node: { isElement: true, component: RadialBarChartStatic },
});

export const ComposedChartStaticPlugin = createTPlatePlugin({
  key: COMPOSED_CHART_ELEMENT,
  node: { isElement: true, component: ComposedChartStatic },
});

export const TreemapChartStaticPlugin = createTPlatePlugin({
  key: TREEMAP_CHART_ELEMENT,
  node: { isElement: true, component: TreemapChartStatic },
});

export const BubbleChartStaticPlugin = createTPlatePlugin({
  key: BUBBLE_CHART_ELEMENT,
  node: { isElement: true, component: BubbleChartStatic },
});

export const DonutChartStaticPlugin = createTPlatePlugin({
  key: DONUT_CHART_ELEMENT,
  node: { isElement: true, component: DonutChartStatic },
});

// New static plugins - Phase 1
export const HistogramChartStaticPlugin = createTPlatePlugin({
  key: HISTOGRAM_CHART_ELEMENT,
  node: { isElement: true, component: HistogramChartStatic },
});

export const HeatmapChartStaticPlugin = createTPlatePlugin({
  key: HEATMAP_CHART_ELEMENT,
  node: { isElement: true, component: HeatmapChartStatic },
});

// New static plugins - Phase 2
export const RangeBarChartStaticPlugin = createTPlatePlugin({
  key: RANGE_BAR_CHART_ELEMENT,
  node: { isElement: true, component: RangeBarChartStatic },
});

export const RangeAreaChartStaticPlugin = createTPlatePlugin({
  key: RANGE_AREA_CHART_ELEMENT,
  node: { isElement: true, component: RangeAreaChartStatic },
});

export const WaterfallChartStaticPlugin = createTPlatePlugin({
  key: WATERFALL_CHART_ELEMENT,
  node: { isElement: true, component: WaterfallChartStatic },
});

// New static plugins - Phase 3
export const BoxPlotChartStaticPlugin = createTPlatePlugin({
  key: BOX_PLOT_CHART_ELEMENT,
  node: { isElement: true, component: BoxPlotChartStatic },
});

export const CandlestickChartStaticPlugin = createTPlatePlugin({
  key: CANDLESTICK_CHART_ELEMENT,
  node: { isElement: true, component: CandlestickChartStatic },
});

export const OhlcChartStaticPlugin = createTPlatePlugin({
  key: OHLC_CHART_ELEMENT,
  node: { isElement: true, component: OhlcChartStatic },
});

// New static plugins - Phase 4
export const NightingaleChartStaticPlugin = createTPlatePlugin({
  key: NIGHTINGALE_CHART_ELEMENT,
  node: { isElement: true, component: NightingaleChartStatic },
});

export const RadialColumnChartStaticPlugin = createTPlatePlugin({
  key: RADIAL_COLUMN_CHART_ELEMENT,
  node: { isElement: true, component: RadialColumnChartStatic },
});

// New static plugins - Phase 5
export const SunburstChartStaticPlugin = createTPlatePlugin({
  key: SUNBURST_CHART_ELEMENT,
  node: { isElement: true, component: SunburstChartStatic },
});

export const SankeyChartStaticPlugin = createTPlatePlugin({
  key: SANKEY_CHART_ELEMENT,
  node: { isElement: true, component: SankeyChartStatic },
});

export const ChordChartStaticPlugin = createTPlatePlugin({
  key: CHORD_CHART_ELEMENT,
  node: { isElement: true, component: ChordChartStatic },
});

// New static plugins - Phase 6
export const FunnelChartStaticPlugin = createTPlatePlugin({
  key: FUNNEL_CHART_ELEMENT,
  node: { isElement: true, component: FunnelChartStatic },
});

export const ConeFunnelChartStaticPlugin = createTPlatePlugin({
  key: CONE_FUNNEL_CHART_ELEMENT,
  node: { isElement: true, component: ConeFunnelChartStatic },
});

export const PyramidChartStaticPlugin = createTPlatePlugin({
  key: PYRAMID_CHART_ELEMENT,
  node: { isElement: true, component: PyramidChartStatic },
});

// New static plugins - Phase 7
export const RadialGaugeStaticPlugin = createTPlatePlugin({
  key: RADIAL_GAUGE_ELEMENT,
  node: { isElement: true, component: RadialGaugeStatic },
});

export const LinearGaugeStaticPlugin = createTPlatePlugin({
  key: LINEAR_GAUGE_ELEMENT,
  node: { isElement: true, component: LinearGaugeStatic },
});
