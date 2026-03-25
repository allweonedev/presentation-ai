"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { getLabelKey, getValueKey } from "../chart-utils";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

interface PyramidChartElement {
  data?: unknown;
  orientation?: "vertical" | "horizontal";
  showLegend?: boolean;
  disableAnimation?: boolean;
}

export default function PyramidChartStatic(props: SlateElementProps) {
  const element = props.element as unknown as PyramidChartElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const themeConfig = useChartTheme();

  const stageKey = getLabelKey(dataArray);
  const valueKey = getValueKey(dataArray);

  const isHorizontal = element.orientation === "horizontal";
  const showLegend = element.showLegend ?? false;
  const disableAnimation = element.disableAnimation ?? true;

  const chartOptions = {
    data: dataArray,
    series: [
      {
        type: "pyramid" as const,
        stageKey,
        valueKey,
        direction: isHorizontal
          ? ("horizontal" as const)
          : ("vertical" as const),
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


