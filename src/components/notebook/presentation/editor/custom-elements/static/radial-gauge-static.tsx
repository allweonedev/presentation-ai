"use client";

import { cn } from "@/lib/utils";
import { type AgGaugeOptions } from "ag-charts-community";
import { AgGauge } from "ag-charts-react";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { getChartColor } from "../charts/ag-chart-wrapper";

interface RadialGaugeElement {
  data?: unknown;
  color?: string;
  disableAnimation?: boolean;
  needle?: { enabled?: boolean };
  bar?: { enabled?: boolean };
}

export default function RadialGaugeStatic(props: SlateElementProps) {
  const element = props.element as unknown as RadialGaugeElement;
  const primaryColor = element.color ?? getChartColor(0);
  const disableAnimation = element.disableAnimation ?? true;
  const needleEnabled = element.needle?.enabled ?? false;
  const barEnabled = element.bar?.enabled ?? true;

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
    type: "radial-gauge",
    value,
    scale: {
      min: 0,
      max: 100,
    },
    needle: {
      enabled: needleEnabled,
    },
    bar: {
      enabled: barEnabled,
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
        <div style={{ width: "100%", minHeight: 200, maxHeight: "40vh" }}>
          <AgGauge options={gaugeOptions} />
        </div>
      </div>
    </SlateElement>
  );
}


