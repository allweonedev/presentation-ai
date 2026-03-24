"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { getLabelKey, getValueKey } from "../chart-utils";
import { getChartColor } from "../charts/ag-chart-wrapper";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

interface PieChartElement {
  data?: unknown;
  variant?: string;
  showLegend?: boolean;
  innerRadius?: number;
  colors?: string[];
  disableAnimation?: boolean;
}

export default function PieChartStatic(props: SlateElementProps) {
  const element = props.element as unknown as PieChartElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const labelKey = getLabelKey(dataArray);
  const valueKey = getValueKey(dataArray);
  const themeConfig = useChartTheme();

  const variant = element.variant ?? "default";
  const showLegend = element.showLegend ?? true;
  const innerRadius = variant === "donut" ? (element.innerRadius ?? 60) : 0;
  const customColors = element.colors;
  const disableAnimation = element.disableAnimation ?? true;

  const colors = dataArray.map(
    (_, index) => customColors?.[index] ?? getChartColor(index),
  );

  const chartOptions = {
    data: dataArray,
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
        <div style={{ width: "100%", minHeight: 304, maxHeight: "40vh" }}>
          <AgCharts options={chartOptions as unknown as AgChartOptions} />
        </div>
      </div>
    </SlateElement>
  );
}


