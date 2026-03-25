"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TChartNode } from "../plugins/chart-plugin";
import { buildChartConfigOptions } from "./chart-utils";
import { useChartTheme } from "./charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

export default function OhlcChartElement(props: PlateElementProps<TChartNode>) {
  const element = props.element as TChartNode;
  const rawData = element.data as unknown;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const themeConfig = useChartTheme();

  const config = buildChartConfigOptions(element);

  const xKey = "date";
  const openKey = "open";
  const highKey = "high";
  const lowKey = "low";
  const closeKey = "close";

  const chartOptions = {
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
