"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { type TChartNode } from "../../plugins/chart-plugin";
import {
  buildChartConfigOptions,
  getLabelKey,
  getValueKey,
  keyToLabel,
} from "../chart-utils";
import { getChartColor } from "../charts/ag-chart-wrapper";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

export default function BarGraphStatic(props: SlateElementProps<TChartNode>) {
  const element = props.element;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const labelKey = getLabelKey(dataArray);
  const valueKey = getValueKey(dataArray);
  const themeConfig = useChartTheme();

  const config = buildChartConfigOptions(element);
  const isHorizontal = element.orientation === "horizontal";
  const primaryColor = element.color ?? getChartColor(0);

  const baseHeight = isHorizontal ? Math.max(256, dataArray.length * 50) : 256;

  const chartOptions = {
    data: dataArray,
    series: [
      {
        type: "bar" as const,
        xKey: labelKey,
        yKey: valueKey,
        yName: keyToLabel(valueKey),
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
        gridLine: config.xAxis.showGrid ? {} : { enabled: false },
        title: config.xAxis.title,
      },
      {
        type: "number" as const,
        position: (isHorizontal ? "bottom" : "left") as "left" | "bottom",
        label: config.yAxis.showLabel ? {} : { enabled: false },
        gridLine: config.yAxis.showGrid ? {} : { enabled: false },
        title: config.yAxis.title,
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
        <div
          style={{ width: "100%", minHeight: baseHeight, maxHeight: "40vh" }}
        >
          <AgCharts options={chartOptions as unknown as AgChartOptions} />
        </div>
      </div>
    </SlateElement>
  );
}


