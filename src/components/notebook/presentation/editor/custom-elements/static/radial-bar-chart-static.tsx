"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { getLabelKey, getValueKey } from "../chart-utils";
import { getChartColor } from "../charts/ag-chart-wrapper";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

interface RadialBarChartElement {
  data?: unknown;
  showLegend?: boolean;
  disableAnimation?: boolean;
}

export default function RadialBarChartStatic(props: SlateElementProps) {
  const element = props.element as unknown as RadialBarChartElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const labelKey = getLabelKey(dataArray);
  const valueKey = getValueKey(dataArray);
  const themeConfig = useChartTheme();

  const showLegend = element.showLegend ?? true;
  const disableAnimation = element.disableAnimation ?? true;

  const colors = dataArray.map((_, index) => getChartColor(index));

  const chartOptions = {
    data: dataArray,
    axes: [
      { type: "angle-number" as const },
      { type: "radius-category" as const, innerRadiusRatio: 0.3 },
    ],
    series: [
      {
        type: "radial-bar" as const,
        angleKey: valueKey,
        radiusKey: labelKey,
        angleName: valueKey,
        radiusName: labelKey,
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
        <div style={{ width: "100%", minHeight: 256, maxHeight: "40vh" }}>
          <AgCharts options={chartOptions as unknown as AgChartOptions} />
        </div>
      </div>
    </SlateElement>
  );
}


