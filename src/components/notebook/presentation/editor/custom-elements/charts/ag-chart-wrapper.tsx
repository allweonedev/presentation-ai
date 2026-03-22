"use client";

import { cn } from "@/lib/utils";
import { type AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";

export interface AgChartWrapperProps {
  options: AgChartOptions;
  className?: string;
  style?: React.CSSProperties;
}

// Default chart colors - vibrant, visible colors that work well on both light and dark backgrounds
// These match the shadcn chart color palette
const CHART_COLORS = [
  "#2563eb", // Blue (chart-1)
  "#16a34a", // Green (chart-2)
  "#ea580c", // Orange (chart-3)
  "#8b5cf6", // Purple (chart-4)
  "#ec4899", // Pink (chart-5)
  "#14b8a6", // Teal
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#84cc16", // Lime
];

/**
 * Get chart color from index (cycles through chart colors)
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length] ?? CHART_COLORS[0]!;
}

/**
 * Get all chart colors array
 */
export function getChartColors(): string[] {
  return CHART_COLORS;
}

/**
 * Wrapper component for AG Charts with shared styling
 * Provides consistent theming that respects presentation CSS variables
 */
export function AgChartWrapper({
  options,
  className,
  style,
}: AgChartWrapperProps) {
  // Merge default theme settings with provided options
  const themedOptions: AgChartOptions = {
    ...options,
    background: {
      visible: false,
    },
    // Apply theme overrides
    theme: {
      baseTheme: "ag-default-dark",
      palette: {
        fills: CHART_COLORS,
        strokes: CHART_COLORS,
      },
      overrides: {
        common: {
          legend: {
            item: {
              label: {
                color: "#e5e5e5",
              },
            },
          },
        },
      },
    },
  };

  return (
    <div
      className={cn("h-full w-full", className)}
      style={{
        backgroundColor: "var(--presentation-background)",
        color: "var(--presentation-text)",
        ...style,
      }}
    >
      <AgCharts options={themedOptions} />
    </div>
  );
}

/**
 * Build base chart options with common settings
 */
export function buildBaseChartOptions(
  dataArray: Record<string, unknown>[],
  options: {
    showLegend?: boolean;
    showGrid?: boolean;
    disableAnimation?: boolean;
    primaryColor?: string;
  } = {},
): Partial<AgChartOptions> {
  const { showLegend = true, disableAnimation = false } = options;

  return {
    data: dataArray,
    legend: {
      enabled: showLegend,
    },
    animation: {
      enabled: !disableAnimation,
    },
  };
}
