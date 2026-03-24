"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { getChartColor } from "../charts/ag-chart-wrapper";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

interface HistogramChartElement {
  data?: unknown;
  showLegend?: boolean;
  showGrid?: boolean;
  showAxisLabels?: boolean;
  color?: string;
  disableAnimation?: boolean;
  options?: { binCount?: number };
}

export default function HistogramChartStatic(props: SlateElementProps) {
  const element = props.element as unknown as HistogramChartElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const themeConfig = useChartTheme();

  const showLegend = element.showLegend ?? false;
  const showGrid = element.showGrid ?? true;
  const showAxisLabels = element.showAxisLabels ?? true;
  const primaryColor = element.color ?? getChartColor(0);
  const disableAnimation = element.disableAnimation ?? true;
  const binCount = element.options?.binCount ?? 10;

  const xKey =
    dataArray.length > 0
      ? (Object.keys(dataArray[0] ?? {}).find(
          (key) => typeof dataArray[0]?.[key] === "number",
        ) ?? "value")
      : "value";

  const chartOptions = {
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


