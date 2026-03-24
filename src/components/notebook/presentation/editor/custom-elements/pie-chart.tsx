"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TChartNode } from "../plugins/chart-plugin";
import {
  buildChartConfigOptions,
  getLabelKey,
  getValueKey,
} from "./chart-utils";
import { getChartColor } from "./charts/ag-chart-wrapper";
import { useChartTheme } from "./charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

export default function PieChartElement(props: PlateElementProps<TChartNode>) {
  const element = props.element as TChartNode;
  const rawData = element.data as unknown;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const labelKey = getLabelKey(dataArray);
  const valueKey = getValueKey(dataArray);
  const themeConfig = useChartTheme();

  const config = buildChartConfigOptions(element);
  const variant = element.variant ?? "default";
  const innerRadius = variant === "donut" ? (element.innerRadius ?? 60) : 0;
  const customColors = element.colors;

  // Generate colors for each data point
  const colors = dataArray.map(
    (_, index) => customColors?.[index] ?? getChartColor(index),
  );

  const chartOptions = {
    data: dataArray,
    ...(config.title && { title: config.title }),
    ...(config.subtitle && { subtitle: config.subtitle }),
    series: [
      {
        type: "pie" as const,
        angleKey: valueKey,
        legendItemKey: labelKey,
        innerRadiusRatio: innerRadius > 0 ? innerRadius / 110 : 0,
        fills: colors,
        strokes: colors,
      },
    ],
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
        <div style={{ width: "100%", minHeight: 304, maxHeight: "40vh" }}>
          <AgCharts options={chartOptions as unknown as AgChartOptions} />
        </div>
      </div>
    </PlateElement>
  );
}
