"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type SeriesChartType, type TChartNode } from "../plugins/chart-plugin";
import {
  buildChartConfigOptions,
  getLabelKey,
  getValueKeys,
  keyToLabel,
} from "./chart-utils";
import { getChartColor } from "./charts/ag-chart-wrapper";
import { useChartTheme } from "./charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

// Default chart type rotation for series without explicit type
const DEFAULT_CHART_TYPES: SeriesChartType[] = ["bar", "line", "area"];

export default function ComposedChartElement(
  props: PlateElementProps<TChartNode>,
) {
  const element = props.element as TChartNode;
  const rawData = element.data as unknown;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const labelKey = getLabelKey(dataArray);
  const valueKeys = getValueKeys(dataArray);
  const themeConfig = useChartTheme();

  const config = buildChartConfigOptions(element);
  const seriesChartTypes = element.seriesChartTypes ?? {};

  // Get chart type for a series, with fallback to default rotation
  const getChartType = (key: string, index: number): SeriesChartType => {
    if (seriesChartTypes[key]) return seriesChartTypes[key];
    return DEFAULT_CHART_TYPES[index % DEFAULT_CHART_TYPES.length] ?? "bar";
  };

  // Build series array based on chart types
  const series = valueKeys.map((key, index) => {
    const chartType = getChartType(key, index);
    const color = getChartColor(index);

    if (chartType === "bar") {
      return {
        type: "bar" as const,
        xKey: labelKey,
        yKey: key,
        yName: keyToLabel(key),
        fill: color,
        stroke: color,
      };
    }
    if (chartType === "line") {
      return {
        type: "line" as const,
        xKey: labelKey,
        yKey: key,
        yName: keyToLabel(key),
        stroke: color,
        strokeWidth: 2,
        marker: { enabled: false },
      };
    }
    if (chartType === "scatter") {
      return {
        type: "scatter" as const,
        xKey: labelKey,
        yKey: key,
        yName: keyToLabel(key),
        marker: { fill: color, stroke: color, size: 8 },
      };
    }
    // Default to area
    return {
      type: "area" as const,
      xKey: labelKey,
      yKey: key,
      yName: keyToLabel(key),
      fill: color,
      stroke: color,
      fillOpacity: 0.3,
    };
  });

  const chartOptions = {
    data: dataArray,
    ...(config.title && { title: config.title }),
    ...(config.subtitle && { subtitle: config.subtitle }),
    series,
    axes: {
      x: {
        type: "category" as const,
        position: "bottom" as const,
        label: config.xAxis.showLabel ? {} : { enabled: false },
        gridLine: config.xAxis.showGrid ? {} : { enabled: false },
        title: config.xAxis.title,
      },
      y: {
        type: "number" as const,
        position: "left" as const,
        label: config.yAxis.showLabel ? {} : { enabled: false },
        gridLine: config.yAxis.showGrid ? {} : { enabled: false },
        title: config.yAxis.title,
      },
    },
    legend: config.legend,
    animation: config.animation,
    background: config.background,
    ...themeConfig,
  };

  return (
    <PlateElement {...props}>
      <div
        className={cn(
          "relative mb-4 w-full rounded-lg border bg-card p-2 shadow-2xs",
        )}
        style={{
          backgroundColor: "var(--presentation-background)",
          color: "var(--presentation-text)",
          borderColor: "hsl(var(--border))",
        }}
        contentEditable={false}
      >
        <div style={{ width: "100%", minHeight: 256, maxHeight: "40vh" }}>
          <AgCharts options={chartOptions as unknown as AgChartOptions} />
        </div>
      </div>
    </PlateElement>
  );
}
