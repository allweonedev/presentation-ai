"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { getLabelKey, getValueKeys, keyToLabel } from "../chart-utils";
import { getChartColor } from "../charts/ag-chart-wrapper";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;
type SeriesChartType = "bar" | "line" | "area" | "scatter";

interface ComposedChartElement {
  data?: unknown;
  showLegend?: boolean;
  showGrid?: boolean;
  showAxisLabels?: boolean;
  seriesChartTypes?: Record<string, SeriesChartType>;
  disableAnimation?: boolean;
}

const DEFAULT_CHART_TYPES: SeriesChartType[] = ["bar", "line", "area"];

export default function ComposedChartStatic(props: SlateElementProps) {
  const element = props.element as unknown as ComposedChartElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const labelKey = getLabelKey(dataArray);
  const valueKeys = getValueKeys(dataArray);
  const themeConfig = useChartTheme();

  const showLegend = element.showLegend ?? true;
  const showGrid = element.showGrid ?? true;
  const showAxisLabels = element.showAxisLabels ?? true;
  const seriesChartTypes = element.seriesChartTypes ?? {};
  const disableAnimation = element.disableAnimation ?? true;

  const getChartType = (key: string, index: number): SeriesChartType => {
    if (seriesChartTypes[key]) return seriesChartTypes[key];
    return DEFAULT_CHART_TYPES[index % DEFAULT_CHART_TYPES.length] ?? "bar";
  };

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
    series,
    axes: [
      {
        type: "category" as const,
        position: "bottom" as const,
        label: showAxisLabels ? {} : { enabled: false },
      },
      {
        type: "number" as const,
        position: "left" as const,
        label: showAxisLabels ? {} : { enabled: false },
        gridLine: showGrid ? {} : { enabled: false },
      },
    ],
    legend: { enabled: showLegend },
    animation: { enabled: !disableAnimation },
    background: { visible: false },
    ...themeConfig,
  };

  return (
    <SlateElement {...props}>
      <div
        className={cn(
          "relative mb-4 w-full rounded-lg border bg-card p-2 shadow-2xs",
        )}
        style={{
          backgroundColor: "var(--presentation-background)",
          color: "var(--presentation-text)",
          borderColor: "hsl(var(--border))",
        }}
      >
        <div style={{ width: "100%", minHeight: 256, maxHeight: "40vh" }}>
          <AgCharts options={chartOptions as unknown as AgChartOptions} />
        </div>
      </div>
    </SlateElement>
  );
}


