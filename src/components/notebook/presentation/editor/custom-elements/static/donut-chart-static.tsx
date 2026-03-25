"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { getLabelKey, getValueKey } from "../chart-utils";
import { getChartColor } from "../charts/ag-chart-wrapper";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

type InnerLabelConfig = {
  text: string;
  fontWeight?: "normal" | "bold";
  fontSize?: number;
  color?: string;
  spacing?: number;
};

interface DonutChartElement {
  data?: unknown;
  showLegend?: boolean;
  innerRadius?: number;
  innerRadiusRatio?: number;
  colors?: string[];
  disableAnimation?: boolean;
  innerLabels?: InnerLabelConfig[];
  innerCircle?: { fill?: string };
}

export default function DonutChartStatic(props: SlateElementProps) {
  const element = props.element as unknown as DonutChartElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const labelKey = getLabelKey(dataArray);
  const valueKey = getValueKey(dataArray);
  const themeConfig = useChartTheme();

  const showLegend = element.showLegend ?? true;
  const customColors = element.colors;
  const disableAnimation = element.disableAnimation ?? true;
  const innerLabels = element.innerLabels ?? [];
  const innerCircle = element.innerCircle;
  const innerRadiusRatio = element.innerRadiusRatio ?? 0.7;

  const colors = dataArray.map(
    (_, index) => customColors?.[index] ?? getChartColor(index),
  );

  const chartOptions = {
    data: dataArray,
    series: [
      {
        type: "donut" as const,
        calloutLabelKey: labelKey,
        angleKey: valueKey,
        innerRadiusRatio,
        fills: colors,
        strokes: colors,
        ...(innerLabels.length > 0 && { innerLabels }),
        ...(innerCircle && { innerCircle }),
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


