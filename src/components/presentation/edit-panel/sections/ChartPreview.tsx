"use client";

import { ChartRenderer } from "@/components/notebook/presentation/editor/custom-elements/charts/ChartRenderer";
import { useLayoutEffect, useRef, useState } from "react";

// Base dimensions for chart rendering (rendered at this size, then scaled down)
const BASE_WIDTH = 400;
const BASE_HEIGHT = 300;

// Sample data for chart previews - matches the format used by ChartRenderer
const sampleData = [
  { label: "A", value: 400 },
  { label: "B", value: 300 },
  { label: "C", value: 500 },
  { label: "D", value: 280 },
];

// Scatter/Bubble data format
const scatterData = [
  { x: 10, y: 30, z: 15 },
  { x: 25, y: 45, z: 22 },
  { x: 35, y: 20, z: 18 },
  { x: 45, y: 55, z: 28 },
];

// OHLC data format
const ohlcData = [
  { date: "Mon", open: 100, high: 105, low: 98, close: 103 },
  { date: "Tue", open: 103, high: 108, low: 101, close: 107 },
  { date: "Wed", open: 107, high: 112, low: 104, close: 106 },
];

// Box plot data format
const boxPlotData = [
  { category: "A", min: 10, q1: 25, median: 50, q3: 75, max: 95 },
  { category: "B", min: 15, q1: 30, median: 55, q3: 80, max: 100 },
];

// Range data format
const rangeData = [
  { category: "A", low: 20, high: 80 },
  { category: "B", low: 30, high: 70 },
  { category: "C", low: 40, high: 90 },
];

// Flow data format (Sankey, Chord)
const flowData = [
  { from: "A", to: "B", size: 10 },
  { from: "A", to: "C", size: 5 },
  { from: "B", to: "C", size: 15 },
];

// Hierarchical data format (Treemap, Sunburst)
const hierarchicalData = [
  {
    name: "Root",
    children: [
      { name: "A", value: 400 },
      { name: "B", value: 300 },
      { name: "C", value: 200 },
    ],
  },
];

// Heatmap data format
const heatmapData = [
  { x: "A", y: "1", value: 10 },
  { x: "B", y: "1", value: 20 },
  { x: "A", y: "2", value: 30 },
  { x: "B", y: "2", value: 15 },
];

// Histogram data format
const histogramData = [
  { value: 10 },
  { value: 20 },
  { value: 25 },
  { value: 30 },
  { value: 35 },
  { value: 40 },
];

// Waterfall data format
const waterfallData = [
  { category: "Start", amount: 100 },
  { category: "Add", amount: 50 },
  { category: "Sub", amount: -30 },
  { category: "Total", amount: 120 },
];

// Get appropriate sample data based on chart type
function getSampleDataForChart(chartType: string): unknown {
  switch (chartType) {
    case "chart-scatter":
    case "chart-bubble":
      return scatterData;
    case "chart-candlestick":
    case "chart-ohlc":
      return ohlcData;
    case "chart-box-plot":
      return boxPlotData;
    case "chart-range-bar":
    case "chart-range-area":
      return rangeData;
    case "chart-sankey":
    case "chart-chord":
      return flowData;
    case "chart-treemap":
    case "chart-sunburst":
      return hierarchicalData;
    case "chart-heatmap":
      return heatmapData;
    case "chart-histogram":
      return histogramData;
    case "chart-waterfall":
      return waterfallData;
    case "chart-radial-gauge":
    case "chart-linear-gauge":
      return 75; // Single value for gauges
    default:
      return sampleData;
  }
}

interface ChartPreviewProps {
  chartType: string;
  className?: string;
  variantOptions?: Record<string, unknown>;
}

export function ChartPreview({
  chartType,
  className,
  variantOptions = {},
}: ChartPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.3);

  const chartData = getSampleDataForChart(chartType);

  // Preview-specific options to hide axes, labels, legends for clean thumbnails
  const previewOptions: Record<string, unknown> = {
    ...variantOptions,
    // Disable all UI chrome for preview thumbnails
    showLegend: false,
    showGrid: false,
    showAxisLabels: false,
    disableAnimation: true,
  };

  // Calculate scale based on container width (like ChartPanel)
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const newScale = rect.width > 0 ? rect.width / BASE_WIDTH : 0.3;
      setScale(newScale);
    };

    updateScale();

    const ro = new ResizeObserver(updateScale);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height: BASE_HEIGHT * scale,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Transparent overlay to block chart interactions */}
      <div className="absolute inset-0 z-50" />
      <div
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <ChartRenderer
          chartType={chartType}
          chartData={chartData}
          chartOptions={previewOptions}
          className="pointer-events-none h-full w-full border-0 p-1 shadow-none"
        />
      </div>
    </div>
  );
}
