"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { getLabelKey, getValueKey } from "../chart-utils";
import { getChartColor } from "../charts/ag-chart-wrapper";
import { useChartTheme } from "../charts/use-chart-theme";

type AnyRecord = Record<string, unknown>;

interface RadialColumnChartElement {
  data?: unknown;
  showLegend?: boolean;
  color?: string;
  disableAnimation?: boolean;
}

export default function RadialColumnChartStatic(props: SlateElementProps) {
  const element = props.element as unknown as RadialColumnChartElement;
  const rawData = element.data;
  const dataArray = Array.isArray(rawData) ? (rawData as AnyRecord[]) : [];
  const themeConfig = useChartTheme();

  const angleKey = getLabelKey(dataArray);
  const radiusKey = getValueKey(dataArray);

  const showLegend = element.showLegend ?? true;
  const primaryColor = element.color ?? getChartColor(0);
  const disableAnimation = element.disableAnimation ?? true;

  const chartOptions = {
    data: dataArray,
    series: [
      {
        type: "radial-column" as const,
        angleKey,
        radiusKey,
        fill: primaryColor,
        stroke: primaryColor,
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


