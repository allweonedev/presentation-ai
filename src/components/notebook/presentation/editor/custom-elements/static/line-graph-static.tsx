"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { type TChartNode } from "../../plugins/chart-plugin";
import {
  buildChartConfigOptions,
  getInterpolationConfig,
  getLabelKey,
  getValueKeys,
  keyToLabel,
} from "../chart-utils";
import { getChartColor } from "../charts/ag-chart-wrapper";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

interface LineGraphElement {
  data?: unknown;
  color?: string;
  disableAnimation?: boolean;
  interpolation?: string;
  xAxis?: unknown;
  yAxis?: unknown;
  legend?: unknown;
  animation?: unknown;
  background?: unknown;
  showLegend?: boolean;
  showGrid?: boolean;
  showAxisLabels?: boolean;
}

export default function LineGraphStatic(props: SlateElementProps) {
  const element = props.element as unknown as LineGraphElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const labelKey = getLabelKey(dataArray);
  const valueKeys = getValueKeys(dataArray);
  const themeConfig = useChartTheme();

  const config = buildChartConfigOptions(element as unknown as TChartNode);
  const primaryColor = element.color ?? getChartColor(0);
  const interpolationValue = element.interpolation ?? "smooth";

  const chartOptions = {
    data: dataArray,
    series: valueKeys.map((key, index) => ({
      type: "line" as const,
      xKey: labelKey,
      yKey: key,
      yName: keyToLabel(key),
      stroke: index === 0 ? primaryColor : getChartColor(index),
      strokeWidth: 2,
      interpolation: getInterpolationConfig(interpolationValue),
      marker: {
        enabled: true,
        size: 6,
        fill: index === 0 ? primaryColor : getChartColor(index),
      },
    })),
    axes: [
      {
        type: "category" as const,
        position: "bottom" as const,
        label: config.xAxis.showLabel ? {} : { enabled: false },
        gridLine: config.xAxis.showGrid ? {} : { enabled: false },
        title: config.xAxis.title,
      },
      {
        type: "number" as const,
        position: "left" as const,
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
        <div style={{ width: "100%", minHeight: 300, maxHeight: "40vh" }}>
          <AgCharts options={chartOptions as unknown as AgChartOptions} />
        </div>
      </div>
    </SlateElement>
  );
}


