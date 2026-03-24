"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { type TChartNode } from "../../plugins/chart-plugin";
import { buildChartConfigOptions, getXKey, getYKey } from "../chart-utils";
import { getChartColor } from "../charts/ag-chart-wrapper";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

interface ScatterPlotElement {
  data?: unknown;
  color?: string;
  xAxis?: unknown;
  yAxis?: unknown;
  legend?: unknown;
  animation?: unknown;
  background?: unknown;
  showLegend?: boolean;
  showGrid?: boolean;
  showAxisLabels?: boolean;
  disableAnimation?: boolean;
}

export default function ScatterPlotStatic(props: SlateElementProps) {
  const element = props.element as unknown as ScatterPlotElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const xKey = getXKey(dataArray);
  const yKey = getYKey(dataArray);
  const themeConfig = useChartTheme();

  const config = buildChartConfigOptions(element as unknown as TChartNode);
  const primaryColor = element.color ?? getChartColor(0);

  const chartOptions = {
    data: dataArray,
    series: [
      {
        type: "scatter" as const,
        xKey: xKey,
        yKey: yKey,
        xName: "X",
        yName: "Y",
        marker: { fill: primaryColor, stroke: primaryColor, size: 10 },
      },
    ],
    axes: [
      {
        type: "number" as const,
        position: "bottom" as const,
        title: config.xAxis.title ?? { text: "X" },
        label: config.xAxis.showLabel ? {} : { enabled: false },
        gridLine: config.xAxis.showGrid ? {} : { enabled: false },
      },
      {
        type: "number" as const,
        position: "left" as const,
        title: config.yAxis.title ?? { text: "Y" },
        label: config.yAxis.showLabel ? {} : { enabled: false },
        gridLine: config.yAxis.showGrid ? {} : { enabled: false },
      },
    ],
    legend: config.legend,
    animation: config.animation,
    background: config.background,
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
        <div style={{ width: "100%", minHeight: 320, maxHeight: "40vh" }}>
          <AgCharts options={chartOptions as unknown as AgChartOptions} />
        </div>
      </div>
    </SlateElement>
  );
}


