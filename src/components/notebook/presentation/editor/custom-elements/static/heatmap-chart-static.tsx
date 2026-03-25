"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

interface HeatmapChartElement {
  data?: unknown;
  showLegend?: boolean;
  disableAnimation?: boolean;
}

export default function HeatmapChartStatic(props: SlateElementProps) {
  const element = props.element as unknown as HeatmapChartElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const themeConfig = useChartTheme();

  const showLegend = element.showLegend ?? true;
  const disableAnimation = element.disableAnimation ?? true;

  const xKey = "x";
  const yKey = "y";
  const colorKey = "value";

  const chartOptions = {
    data: dataArray,
    series: [
      {
        type: "heatmap" as const,
        xKey,
        yKey,
        colorKey,
        xName: xKey.charAt(0).toUpperCase() + xKey.slice(1),
        yName: yKey.charAt(0).toUpperCase() + yKey.slice(1),
        colorName: colorKey.charAt(0).toUpperCase() + colorKey.slice(1),
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


