"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

interface SunburstChartElement {
  data?: unknown;
  showLegend?: boolean;
  disableAnimation?: boolean;
}

export default function SunburstChartStatic(props: SlateElementProps) {
  const element = props.element as unknown as SunburstChartElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const themeConfig = useChartTheme();

  const showLegend = element.showLegend ?? false;
  const disableAnimation = element.disableAnimation ?? true;

  const chartOptions = {
    data: dataArray,
    series: [
      {
        type: "sunburst" as const,
        labelKey: "name",
        sizeKey: "value",
        childrenKey: "children",
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
        <div style={{ width: "100%", minHeight: 300, maxHeight: "40vh" }}>
          <AgCharts options={chartOptions as unknown as AgChartOptions} />
        </div>
      </div>
    </SlateElement>
  );
}


