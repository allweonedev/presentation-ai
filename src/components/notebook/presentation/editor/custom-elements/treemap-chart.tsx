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

export default function TreemapChartElement(
  props: PlateElementProps<TChartNode>,
) {
  const element = props.element as TChartNode;
  const rawData = element.data as unknown;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const labelKey = getLabelKey(dataArray);
  const valueKey = getValueKey(dataArray);
  const themeConfig = useChartTheme();
  const config = buildChartConfigOptions(element);

  // Generate colors array for fills
  const colors = dataArray.map((_, index) => getChartColor(index));

  // Transform data to treemap format with hierarchical structure
  // AG Charts treemap requires data with children array
  const treemapChildren = dataArray.map((item, index) => ({
    name: String(item[labelKey] ?? `Item ${index + 1}`),
    size: Number(item[valueKey]) || 1,
  }));

  // Wrap in a root node with children
  const treemapData = [
    {
      name: "Root",
      children: treemapChildren,
    },
  ];

  const chartOptions = {
    data: treemapData,
    ...(config.title && { title: config.title }),
    ...(config.subtitle && { subtitle: config.subtitle }),
    series: [
      {
        type: "treemap" as const,
        labelKey: "name",
        sizeKey: "size",
        fills: colors,
        strokes: colors,
      },
    ],
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
