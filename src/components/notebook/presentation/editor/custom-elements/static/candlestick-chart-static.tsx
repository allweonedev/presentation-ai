"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

interface CandlestickChartElement {
  data?: unknown;
  showLegend?: boolean;
  showGrid?: boolean;
  showAxisLabels?: boolean;
  disableAnimation?: boolean;
}

export default function CandlestickChartStatic(props: SlateElementProps) {
  const element = props.element as unknown as CandlestickChartElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const themeConfig = useChartTheme();

  const showLegend = element.showLegend ?? false;
  const showGrid = element.showGrid ?? true;
  const showAxisLabels = element.showAxisLabels ?? true;
  const disableAnimation = element.disableAnimation ?? true;

  const xKey = "date";
  const openKey = "open";
  const highKey = "high";
  const lowKey = "low";
  const closeKey = "close";

  const chartOptions = {
    data: dataArray,
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


