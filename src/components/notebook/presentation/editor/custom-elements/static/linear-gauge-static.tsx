"use client";

import { cn } from "@/lib/utils";
import { type AgGaugeOptions } from "ag-charts-community";
import { AgGauge } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { getChartColor } from "../charts/ag-chart-wrapper";

interface LinearGaugeElement {
  data?: unknown;
  color?: string;
  orientation?: "vertical" | "horizontal";
  disableAnimation?: boolean;
}

export default function LinearGaugeStatic(props: SlateElementProps) {
  const element = props.element as unknown as LinearGaugeElement;
  const primaryColor = element.color ?? getChartColor(0);
  const disableAnimation = element.disableAnimation ?? true;
  const isHorizontal = element.orientation !== "vertical";

  const rawData = element.data;
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
    animation: { enabled: !disableAnimation },
    background: { visible: false },
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
    </SlateElement>
  );
}


