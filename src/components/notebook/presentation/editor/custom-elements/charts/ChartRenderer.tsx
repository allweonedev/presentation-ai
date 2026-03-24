"use client";

import { cn } from "@/lib/utils";
import { AgCharts, AgGauge } from "ag-charts-react";
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
} from "../../lib";
import { type TChartNode } from "../../plugins/chart-plugin";
import {
  buildChartConfigOptions,
  getLabelKey,
  getValueKey,
  getValueKeys,
  getXKey,
  getYKey,
  getZKey,
  keyToLabel,
} from "../chart-utils";
import { useChartTheme } from "./use-chart-theme";

type AnyRecord = Record<string, unknown>;
type SeriesChartType = "bar" | "line" | "area" | "scatter";

// Default chart colors - vibrant, visible colors
const CHART_COLORS = [
  "#2563eb", // Blue
  "#16a34a", // Green
  "#ea580c", // Orange
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#84cc16", // Lime
];

function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length] ?? CHART_COLORS[0]!;
}

export interface ChartRendererProps {
  chartType: string;
  chartData: unknown;
  chartOptions?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
}

export function ChartRenderer({
  chartType,
  chartData,
  chartOptions = {},
  className,
  style,
}: ChartRendererProps) {
  const themeConfig = useChartTheme();
  const dataArray = Array.isArray(chartData) ? (chartData as AnyRecord[]) : [];
  const labelKey = getLabelKey(dataArray);
  const valueKey = getValueKey(dataArray);
  const config = buildChartConfigOptions(chartOptions as unknown as TChartNode);

  console.log(themeConfig);
  const primaryColor = (chartOptions.color as string) ?? getChartColor(0);

  const containerClass = cn(
    "h-full w-full rounded-lg border bg-card p-2 shadow-2xs",
    className,
  );
  const containerStyle: React.CSSProperties = {
    backgroundColor: "var(--presentation-background)",
    color: "var(--presentation-text)",
    borderColor: "hsl(var(--border))",
    ...style,
  };

  // Build chart options based on chart type
  let options: Record<string, unknown>;

  switch (chartType) {
    case PIE_CHART_ELEMENT: {
      const colors = dataArray.map((_, index) => getChartColor(index));

      options = {
        data: dataArray,
        series: [
          {
            type: "pie",
            angleKey: valueKey,
            legendItemKey: labelKey,
            fills: colors,
            strokes: colors,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };

      break;
    }

    case DONUT_CHART_ELEMENT: {
      const colors = dataArray.map((_, index) => getChartColor(index));
      const innerLabels =
        (chartOptions.innerLabels as Record<string, unknown>[]) ?? undefined;
      const innerCircle =
        (chartOptions.innerCircle as Record<string, unknown>) ?? undefined;
      const innerRadiusRatio = (chartOptions.innerRadiusRatio as number) ?? 0.7;

      options = {
        data: dataArray,
        series: [
          {
            type: "donut",
            calloutLabelKey: labelKey,
            angleKey: valueKey,
            fills: colors,
            strokes: colors,
            innerLabels,
            innerCircle,
            innerRadiusRatio,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case BAR_CHART_ELEMENT: {
      const isHorizontal = chartOptions.orientation === "horizontal";

      options = {
        data: dataArray,
        series: [
          {
            type: "bar",
            xKey: labelKey,
            yKey: valueKey,
            yName: keyToLabel(valueKey),
            fill: primaryColor,
            stroke: primaryColor,
            direction: isHorizontal ? "horizontal" : "vertical",
          },
        ],
        axes: [
          {
            type: "category",
            position: isHorizontal ? "left" : "bottom",
            label: config.xAxis.showLabel ? {} : { enabled: false },
            gridLine: config.xAxis.showGrid ? {} : { enabled: false },
            title: config.xAxis.title,
          },
          {
            type: "number",
            position: isHorizontal ? "bottom" : "left",
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
            title: config.yAxis.title,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case LINE_CHART_ELEMENT: {
      const valueKeys = getValueKeys(dataArray);

      options = {
        data: dataArray,
        series: valueKeys.map((key, index) => ({
          type: "line",
          xKey: labelKey,
          yKey: key,
          yName: keyToLabel(key),
          stroke: index === 0 ? primaryColor : getChartColor(index),
          strokeWidth: 2,
          marker: {
            enabled: true,
            size: 6,
            fill: index === 0 ? primaryColor : getChartColor(index),
          },
        })),
        axes: [
          {
            type: "category",
            position: "bottom",
            label: config.xAxis.showLabel ? {} : { enabled: false },
            gridLine: config.xAxis.showGrid ? {} : { enabled: false },
            title: config.xAxis.title,
          },
          {
            type: "number",
            position: "left",
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
            title: config.yAxis.title,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case AREA_CHART_ELEMENT: {
      const valueKeys = getValueKeys(dataArray);

      options = {
        data: dataArray,
        series: valueKeys.map((key, index) => ({
          type: "area",
          xKey: labelKey,
          yKey: key,
          yName: keyToLabel(key),
          fill: index === 0 ? primaryColor : getChartColor(index),
          stroke: index === 0 ? primaryColor : getChartColor(index),
          fillOpacity: 0.4,
          marker: { enabled: false },
        })),
        axes: [
          {
            type: "category",
            position: "bottom",
            label: config.xAxis.showLabel ? {} : { enabled: false },
            gridLine: config.xAxis.showGrid ? {} : { enabled: false },
            title: config.xAxis.title,
          },
          {
            type: "number",
            position: "left",
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
            title: config.yAxis.title,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case RADAR_CHART_ELEMENT: {
      const valueKeys = getValueKeys(dataArray);

      options = {
        data: dataArray,
        series: valueKeys.map((key, index) => ({
          type: "radar-area",
          angleKey: labelKey,
          radiusKey: key,
          radiusName: keyToLabel(key),
          stroke: getChartColor(index),
          fill: getChartColor(index),
          fillOpacity: 0.2,
          marker: { enabled: true, size: 4, fill: getChartColor(index) },
        })),
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case SCATTER_CHART_ELEMENT: {
      const xKey = getXKey(dataArray);
      const yKey = getYKey(dataArray);

      options = {
        data: dataArray,
        series: [
          {
            type: "scatter",
            xKey: xKey,
            yKey: yKey,
            xName: "X",
            yName: "Y",
            marker: { fill: primaryColor, stroke: primaryColor, size: 10 },
          },
        ],
        axes: [
          {
            type: "number",
            position: "bottom",
            title: config.xAxis.title ?? { text: "X" },
            label: config.xAxis.showLabel ? {} : { enabled: false },
            gridLine: config.xAxis.showGrid ? {} : { enabled: false },
          },
          {
            type: "number",
            position: "left",
            title: config.yAxis.title ?? { text: "Y" },
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case BUBBLE_CHART_ELEMENT: {
      const xKey = getXKey(dataArray);
      const yKey = getYKey(dataArray);
      const zKey = getZKey(dataArray);

      options = {
        data: dataArray,
        series: [
          {
            type: "bubble",
            xKey: xKey,
            yKey: yKey,
            sizeKey: zKey,
            xName: "X",
            yName: "Y",
            sizeName: "Size",
            marker: {
              fill: primaryColor,
              stroke: primaryColor,
              fillOpacity: 0.7,
              maxSize: 30,
            },
          },
        ],
        axes: [
          {
            type: "number",
            position: "bottom",
            title: config.xAxis.title ?? { text: "X" },
            label: config.xAxis.showLabel ? {} : { enabled: false },
            gridLine: config.xAxis.showGrid ? {} : { enabled: false },
          },
          {
            type: "number",
            position: "left",
            title: config.yAxis.title ?? { text: "Y" },
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case RADIAL_BAR_CHART_ELEMENT: {
      const colors = dataArray.map((_, index) => getChartColor(index));

      options = {
        data: dataArray,
        axes: [
          { type: "angle-number" as const },
          { type: "radius-category" as const, innerRadiusRatio: 0.3 },
        ],
        series: [
          {
            type: "radial-bar" as const,
            angleKey: valueKey,
            radiusKey: labelKey,
            angleName: valueKey,
            radiusName: labelKey,
            fills: colors,
            strokes: colors,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case TREEMAP_CHART_ELEMENT: {
      const colors = dataArray.map((_, index) => getChartColor(index));

      // Transform data to treemap format with hierarchical structure
      // AG Charts treemap requires data with children array
      const treemapChildren = dataArray.map((item, index) => ({
        name: String(item[labelKey] ?? `Item ${index + 1}`),
        size: Number(item[valueKey]) || 1,
      }));

      // Wrap in a root node with children
      const treemapData = [
        {
          name: "Root",
          children: treemapChildren,
        },
      ];

      options = {
        data: treemapData,
        series: [
          {
            type: "treemap",
            labelKey: "name",
            sizeKey: "size",
            fills: colors,
            strokes: colors,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case CANDLESTICK_CHART_ELEMENT: {
      const xKey = "date";
      const openKey = "open";
      const highKey = "high";
      const lowKey = "low";
      const closeKey = "close";

      options = {
        data: dataArray,
        ...(config.title && { title: config.title }),
        ...(config.subtitle && { subtitle: config.subtitle }),
        series: [
          {
            type: "candlestick" as const,
            xKey,
            openKey,
            highKey,
            lowKey,
            closeKey,
          },
        ],
        axes: [
          {
            type: "category",
            position: "bottom",
            label: config.xAxis.showLabel ? {} : { enabled: false },
            gridLine: config.xAxis.showGrid ? {} : { enabled: false },
            title: config.xAxis.title,
          },
          {
            type: "number",
            position: "left",
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
            title: config.yAxis.title,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case OHLC_CHART_ELEMENT: {
      const xKey = "date";
      const openKey = "open";
      const highKey = "high";
      const lowKey = "low";
      const closeKey = "close";

      options = {
        data: dataArray,
        ...(config.title && { title: config.title }),
        ...(config.subtitle && { subtitle: config.subtitle }),
        series: [
          {
            type: "ohlc" as const,
            xKey,
            openKey,
            highKey,
            lowKey,
            closeKey,
          },
        ],
        axes: [
          {
            type: "category",
            position: "bottom",
            label: config.xAxis.showLabel ? {} : { enabled: false },
            gridLine: config.xAxis.showGrid ? {} : { enabled: false },
            title: config.xAxis.title,
          },
          {
            type: "number",
            position: "left",
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
            title: config.yAxis.title,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case BOX_PLOT_CHART_ELEMENT: {
      const xKey = "category";
      const minKey = "min";
      const q1Key = "q1";
      const medianKey = "median";
      const q3Key = "q3";
      const maxKey = "max";

      options = {
        data: dataArray,
        ...(config.title && { title: config.title }),
        ...(config.subtitle && { subtitle: config.subtitle }),
        series: [
          {
            type: "box-plot" as const,
            xKey,
            minKey,
            q1Key,
            medianKey,
            q3Key,
            maxKey,
          },
        ],
        axes: [
          {
            type: "category",
            position: "bottom",
            label: config.xAxis.showLabel ? {} : { enabled: false },
            gridLine: config.xAxis.showGrid ? {} : { enabled: false },
            title: config.xAxis.title,
          },
          {
            type: "number",
            position: "left",
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
            title: config.yAxis.title,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case COMPOSED_CHART_ELEMENT: {
      const valueKeys = getValueKeys(dataArray);
      const seriesChartTypes =
        (chartOptions.seriesChartTypes as Record<string, SeriesChartType>) ??
        {};
      const DEFAULT_CHART_TYPES: SeriesChartType[] = ["bar", "line", "area"];

      const series = valueKeys.map((key, index) => {
        const seriesType =
          seriesChartTypes[key] ??
          DEFAULT_CHART_TYPES[index % DEFAULT_CHART_TYPES.length];
        const color = getChartColor(index);

        if (seriesType === "bar") {
          return {
            type: "bar",
            xKey: labelKey,
            yKey: key,
            yName: keyToLabel(key),
            fill: color,
            stroke: color,
          };
        }
        if (seriesType === "line") {
          return {
            type: "line",
            xKey: labelKey,
            yKey: key,
            yName: keyToLabel(key),
            stroke: color,
            strokeWidth: 2,
            marker: { enabled: false },
          };
        }
        if (seriesType === "scatter") {
          return {
            type: "scatter",
            xKey: labelKey,
            yKey: key,
            yName: keyToLabel(key),
            marker: { fill: color, stroke: color, size: 8 },
          };
        }
        return {
          type: "area",
          xKey: labelKey,
          yKey: key,
          yName: keyToLabel(key),
          fill: color,
          stroke: color,
          fillOpacity: 0.3,
        };
      });

      options = {
        data: dataArray,
        series,
        axes: [
          {
            type: "category",
            position: "bottom",
            label: config.xAxis.showLabel ? {} : { enabled: false },
            gridLine: config.xAxis.showGrid ? {} : { enabled: false },
            title: config.xAxis.title,
          },
          {
            type: "number",
            position: "left",
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
            title: config.yAxis.title,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case HISTOGRAM_CHART_ELEMENT: {
      const xKey =
        dataArray.length > 0
          ? (Object.keys(dataArray[0] ?? {}).find(
              (key) => typeof dataArray[0]?.[key] === "number",
            ) ?? "value")
          : "value";
      const binCount =
        (chartOptions as { options: { binCount: number } })?.options
          ?.binCount ?? 10;

      options = {
        data: dataArray,
        series: [
          {
            type: "histogram" as const,
            xKey,
            xName: xKey.charAt(0).toUpperCase() + xKey.slice(1),
            fill: primaryColor,
            stroke: primaryColor,
            binCount,
          },
        ],
        axes: [
          {
            type: "number" as const,
            position: "bottom" as const,
            label: config.xAxis.showLabel ? {} : { enabled: false },
          },
          {
            type: "number" as const,
            position: "left" as const,
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case HEATMAP_CHART_ELEMENT: {
      options = {
        data: dataArray,
        series: [
          {
            type: "heatmap" as const,
            xKey: "x",
            yKey: "y",
            colorKey: "value",
            xName: "X",
            yName: "Y",
            colorName: "Value",
          },
        ],
        axes: [
          {
            type: "category" as const,
            position: "bottom" as const,
          },
          {
            type: "category" as const,
            position: "left" as const,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case RANGE_BAR_CHART_ELEMENT: {
      const isHorizontal = chartOptions.orientation === "horizontal";
      options = {
        data: dataArray,
        series: [
          {
            type: "range-bar" as const,
            xKey: "category",
            yLowKey: "low",
            yHighKey: "high",
            fill: primaryColor,
            stroke: primaryColor,
            direction: isHorizontal
              ? ("horizontal" as const)
              : ("vertical" as const),
          },
        ],
        axes: [
          {
            type: "category" as const,
            position: (isHorizontal ? "left" : "bottom") as "left" | "bottom",
            label: config.xAxis.showLabel ? {} : { enabled: false },
          },
          {
            type: "number" as const,
            position: (isHorizontal ? "bottom" : "left") as "left" | "bottom",
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case RANGE_AREA_CHART_ELEMENT: {
      options = {
        data: dataArray,
        series: [
          {
            type: "range-area" as const,
            xKey: "date",
            yLowKey: "low",
            yHighKey: "high",
            fill: primaryColor,
            stroke: primaryColor,
          },
        ],
        axes: [
          {
            type: "category" as const,
            position: "bottom" as const,
            label: config.xAxis.showLabel ? {} : { enabled: false },
          },
          {
            type: "number" as const,
            position: "left" as const,
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case WATERFALL_CHART_ELEMENT: {
      const isHorizontal = chartOptions.orientation === "horizontal";
      options = {
        data: dataArray,
        series: [
          {
            type: "waterfall" as const,
            xKey: "category",
            yKey: "amount",
            direction: isHorizontal
              ? ("horizontal" as const)
              : ("vertical" as const),
            item: {
              positive: { fill: primaryColor, stroke: primaryColor },
              negative: { fill: "#ef4444", stroke: "#ef4444" },
              total: { fill: "#6b7280", stroke: "#6b7280" },
            },
          },
        ],
        axes: [
          {
            type: "category" as const,
            position: (isHorizontal ? "left" : "bottom") as "left" | "bottom",
            label: config.xAxis.showLabel ? {} : { enabled: false },
          },
          {
            type: "number" as const,
            position: (isHorizontal ? "bottom" : "left") as "left" | "bottom",
            label: config.yAxis.showLabel ? {} : { enabled: false },
            gridLine: config.yAxis.showGrid ? {} : { enabled: false },
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case NIGHTINGALE_CHART_ELEMENT: {
      const colors = dataArray.map((_, index) => getChartColor(index));

      options = {
        data: dataArray,
        series: [
          {
            type: "nightingale" as const,
            angleKey: labelKey,
            radiusKey: valueKey,
            sectorSpacing: 2,
            fills: colors,
            strokes: colors,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case RADIAL_COLUMN_CHART_ELEMENT: {
      options = {
        data: dataArray,
        series: [
          {
            type: "radial-column" as const,
            angleKey: labelKey,
            radiusKey: valueKey,
            fill: primaryColor,
            stroke: primaryColor,
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case SUNBURST_CHART_ELEMENT: {
      options = {
        data: dataArray,
        series: [
          {
            type: "sunburst" as const,
            labelKey: "name",
            sizeKey: "value",
            childrenKey: "children",
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case SANKEY_CHART_ELEMENT: {
      options = {
        data: dataArray,
        series: [
          {
            type: "sankey" as const,
            fromKey: "from",
            toKey: "to",
            sizeKey: "size",
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case CHORD_CHART_ELEMENT: {
      options = {
        data: dataArray,
        series: [
          {
            type: "chord" as const,
            fromKey: "from",
            toKey: "to",
            sizeKey: "size",
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case FUNNEL_CHART_ELEMENT: {
      const isHorizontal = chartOptions.orientation === "horizontal";
      options = {
        data: dataArray,
        series: [
          {
            type: "funnel" as const,
            stageKey: labelKey,
            valueKey: valueKey,
            direction: isHorizontal
              ? ("horizontal" as const)
              : ("vertical" as const),
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case CONE_FUNNEL_CHART_ELEMENT: {
      const isHorizontal = chartOptions.orientation === "horizontal";
      options = {
        data: dataArray,
        series: [
          {
            type: "cone-funnel" as const,
            stageKey: labelKey,
            valueKey: valueKey,
            direction: isHorizontal
              ? ("horizontal" as const)
              : ("vertical" as const),
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case PYRAMID_CHART_ELEMENT: {
      const isHorizontal = chartOptions.orientation === "horizontal";
      options = {
        data: dataArray,
        series: [
          {
            type: "pyramid" as const,
            stageKey: labelKey,
            valueKey: valueKey,
            direction: isHorizontal
              ? ("horizontal" as const)
              : ("vertical" as const),
          },
        ],
        legend: config.legend,
        animation: config.animation,
        background: config.background,
      };
      break;
    }

    case RADIAL_GAUGE_ELEMENT: {
      const needleEnabled =
        (chartOptions as { needle: { enabled: boolean } })?.needle?.enabled ??
        false;
      const barEnabled =
        (chartOptions as { bar: { enabled: boolean } })?.bar?.enabled ?? true;

      let gaugeValue = 50;
      if (dataArray.length > 0) {
        const firstItem = dataArray[0]!;
        const valueKeyFound = Object.keys(firstItem).find(
          (key) => typeof firstItem[key] === "number",
        );
        if (valueKeyFound) {
          gaugeValue = firstItem[valueKeyFound] as number;
        }
      } else if (typeof chartData === "number") {
        gaugeValue = chartData;
      }

      const gaugeOptions = {
        type: "radial-gauge" as const,
        value: gaugeValue,
        scale: { min: 0, max: 100 },
        needle: { enabled: needleEnabled },
        bar: { enabled: barEnabled, fill: primaryColor },
        animation: config.animation,
        background: config.background,
        ...(config.title && { title: config.title }),
        ...(config.subtitle && { subtitle: config.subtitle }),
        ...themeConfig,
      };

      return (
        <div className={containerClass} style={containerStyle}>
          <AgGauge options={gaugeOptions} />
        </div>
      );
    }

    case LINEAR_GAUGE_ELEMENT: {
      const isHorizontal = chartOptions.orientation !== "vertical";

      let gaugeValue = 50;
      if (dataArray.length > 0) {
        const firstItem = dataArray[0]!;
        const valueKeyFound = Object.keys(firstItem).find(
          (key) => typeof firstItem[key] === "number",
        );
        if (valueKeyFound) {
          gaugeValue = firstItem[valueKeyFound] as number;
        }
      } else if (typeof chartData === "number") {
        gaugeValue = chartData;
      }

      const gaugeOptions = {
        type: "linear-gauge" as const,
        value: gaugeValue,
        direction: isHorizontal
          ? ("horizontal" as const)
          : ("vertical" as const),
        scale: { min: 0, max: 100 },
        bar: { fill: primaryColor },
        animation: config.animation,
        background: config.background,
        ...(config.title && { title: config.title }),
        ...(config.subtitle && { subtitle: config.subtitle }),
        ...themeConfig,
      };

      return (
        <div className={containerClass} style={containerStyle}>
          <AgGauge options={gaugeOptions} />
        </div>
      );
    }

    default:
      return (
        <div
          className={cn(
            "flex h-full items-center justify-center bg-muted/30 p-4",
            className,
          )}
          style={style}
        >
          <p className="text-sm text-muted-foreground">
            Unsupported chart type: {chartType}
          </p>
        </div>
      );
  }

  // Apply theme configuration and title/subtitle to chart options
  const themedOptions = {
    ...options,
    ...(config.title && { title: config.title }),
    ...(config.subtitle && { subtitle: config.subtitle }),
    ...themeConfig,
  };

  return (
    <div className={containerClass} style={containerStyle}>
      <AgCharts options={themedOptions} />
    </div>
  );
}
