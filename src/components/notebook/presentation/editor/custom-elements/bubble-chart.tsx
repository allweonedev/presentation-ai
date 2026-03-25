"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TChartNode } from "../plugins/chart-plugin";
import {
  buildChartConfigOptions,
  getXKey,
  getYKey,
  getZKey,
} from "./chart-utils";
import { getChartColor } from "./charts/ag-chart-wrapper";
import { useChartTheme } from "./charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

export default function BubbleChartElement(
  props: PlateElementProps<TChartNode>,
) {
  const element = props.element as TChartNode;
  const rawData = element.data as unknown;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const xKey = getXKey(dataArray);
  const yKey = getYKey(dataArray);
  const zKey = getZKey(dataArray);
  const themeConfig = useChartTheme();

  const config = buildChartConfigOptions(element);
  const primaryColor = element.color ?? getChartColor(0);

  const chartOptions = {
    data: dataArray,
    ...(config.title && { title: config.title }),
    ...(config.subtitle && { subtitle: config.subtitle }),
    series: [
      {
        type: "bubble" as const,
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
    axes: {
      x: {
        type: "number" as const,
        position: "bottom" as const,
        title:
          config.xAxis.title ??
          (config.xAxis.showLabel ? { text: "X" } : undefined),
        label: config.xAxis.showLabel ? {} : { enabled: false },
        gridLine: config.xAxis.showGrid ? {} : { enabled: false },
      },
      y: {
        type: "number" as const,
        position: "left" as const,
        title:
          config.yAxis.title ??
          (config.yAxis.showLabel ? { text: "Y" } : undefined),
        label: config.yAxis.showLabel ? {} : { enabled: false },
        gridLine: config.yAxis.showGrid ? {} : { enabled: false },
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
        <div style={{ width: "100%", minHeight: 320, maxHeight: "40vh" }}>
          <AgCharts options={chartOptions as unknown as AgChartOptions} />
        </div>
      </div>
    </PlateElement>
  );
}
