"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TChartNode } from "../plugins/chart-plugin";
import {
  buildChartConfigOptions,
  getInterpolationConfig,
  getLabelKey,
  getValueKeys,
  keyToLabel,
} from "./chart-utils";
import { getChartColor } from "./charts/ag-chart-wrapper";
import { useChartTheme } from "./charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

export default function AreaChartElement(props: PlateElementProps<TChartNode>) {
  const element = props.element as TChartNode;
  const rawData = element.data as unknown;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const labelKey = getLabelKey(dataArray);
  const valueKeys = getValueKeys(dataArray);
  const themeConfig = useChartTheme();

  const config = buildChartConfigOptions(element);
  const variant = element.variant ?? "default";
  const isStacked = variant === "stacked";
  const primaryColor = element.color ?? getChartColor(0);
  const interpolationValue = element.interpolation ?? "smooth";

  const chartOptions = {
    data: dataArray,
    ...(config.title && { title: config.title }),
    ...(config.subtitle && { subtitle: config.subtitle }),
    series: valueKeys.map((key, index) => ({
      type: "area" as const,
      xKey: labelKey,
      yKey: key,
      yName: keyToLabel(key),
      fill: index === 0 ? primaryColor : getChartColor(index),
      stroke: index === 0 ? primaryColor : getChartColor(index),
      fillOpacity: 0.4,
      stacked: isStacked,
      interpolation: getInterpolationConfig(interpolationValue),
      marker: { enabled: false },
    })),
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
