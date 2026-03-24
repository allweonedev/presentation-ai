"use client";

import { cn } from "@/lib/utils";
import { type AgGaugeOptions } from "ag-charts-community";
import { AgGauge } from "ag-charts-react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TChartNode } from "../plugins/chart-plugin";
import { buildChartConfigOptions } from "./chart-utils";
import { getChartColor } from "./charts/ag-chart-wrapper";
import { useChartTheme } from "./charts/use-chart-theme";

export default function LinearGaugeElement(
  props: PlateElementProps<TChartNode>,
) {
  const element = props.element as TChartNode;
  const config = buildChartConfigOptions(element);
  const primaryColor = element.color ?? getChartColor(0);
  const isHorizontal = element.orientation !== "vertical";

  const themeConfig = useChartTheme();
  // Get value from data or use default
  const rawData = element.data as unknown;
  let value = 50;
  if (Array.isArray(rawData) && rawData.length > 0) {
    const firstItem = rawData[0] as Record<string, unknown>;
    const valueKey = Object.keys(firstItem).find(
      (key) => typeof firstItem[key] === "number",
    );
    if (valueKey) {
      value = firstItem[valueKey] as number;
    }
  } else if (typeof rawData === "number") {
    value = rawData;
  }

  const gaugeOptions: AgGaugeOptions = {
    type: "linear-gauge",
    value,
    direction: isHorizontal ? "horizontal" : "vertical",
    scale: {
      min: 0,
      max: 100,
    },
    bar: {
      fill: primaryColor,
    },
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
        <div
          style={{
            width: "100%",
            minHeight: isHorizontal ? 100 : 200,
            maxHeight: "40vh",
          }}
        >
          <AgGauge options={gaugeOptions} />
        </div>
      </div>
    </PlateElement>
  );
}
