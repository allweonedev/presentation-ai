"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { getChartColor } from "../charts/ag-chart-wrapper";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

interface WaterfallChartElement {
  data?: unknown;
  orientation?: "vertical" | "horizontal";
  showLegend?: boolean;
  showGrid?: boolean;
  showAxisLabels?: boolean;
  color?: string;
  disableAnimation?: boolean;
}

export default function WaterfallChartStatic(props: SlateElementProps) {
  const element = props.element as unknown as WaterfallChartElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const themeConfig = useChartTheme();

  const isHorizontal = element.orientation === "horizontal";
  const showLegend = element.showLegend ?? false;
  const showGrid = element.showGrid ?? true;
  const showAxisLabels = element.showAxisLabels ?? true;
  const primaryColor = element.color ?? getChartColor(0);
  const disableAnimation = element.disableAnimation ?? true;

  const xKey = "category";
  const yKey = "amount";

  const chartOptions = {
    data: dataArray,
    series: [
      {
        type: "waterfall" as const,
        xKey,
        yKey,
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
        label: showAxisLabels ? {} : { enabled: false },
      },
      {
        type: "number" as const,
        position: (isHorizontal ? "bottom" : "left") as "left" | "bottom",
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


