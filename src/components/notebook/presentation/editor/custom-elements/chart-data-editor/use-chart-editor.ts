import { useCallback, useState } from "react";
import { getLabelKey } from "../chart-utils";
import {
  type ChartDataMode,
  type ChartDataType,
  type MultiSeriesData,
  type SeriesChartType,
  type XYData,
} from "./types";

// Default chart type rotation for new series
const DEFAULT_CHART_TYPES: SeriesChartType[] = ["bar", "line", "area"];

// Default series names for specialized chart types
const OHLC_SERIES_NAMES = ["open", "high", "low", "close"];
const BOX_PLOT_SERIES_NAMES = ["min", "q1", "median", "q3", "max"];

// Default label keys for specialized chart types
const OHLC_LABEL_KEY = "date";
const BOX_PLOT_LABEL_KEY = "category";

// Default data for specialized chart types when no data is provided
const DEFAULT_OHLC_DATA = [
  { date: "2024-01-02", open: 100, high: 105, low: 98, close: 103 },
  { date: "2024-01-03", open: 103, high: 108, low: 101, close: 107 },
  { date: "2024-01-04", open: 107, high: 112, low: 104, close: 106 },
  { date: "2024-01-05", open: 106, high: 110, low: 102, close: 109 },
  { date: "2024-01-08", open: 109, high: 115, low: 107, close: 114 },
];

const DEFAULT_BOX_PLOT_DATA = [
  { category: "Q1 Sales", min: 10, q1: 25, median: 50, q3: 75, max: 95 },
  { category: "Q2 Sales", min: 15, q1: 30, median: 55, q3: 80, max: 100 },
  { category: "Q3 Sales", min: 20, q1: 35, median: 60, q3: 85, max: 105 },
  { category: "Q4 Sales", min: 12, q1: 28, median: 52, q3: 78, max: 98 },
];

// Editor mode types - the data editor only supports two modes
export type EditorMode = "xy" | "multi-series";

/**
 * Maps chart data categories to editor modes for backward compatibility.
 * The data editor only supports two modes: "xy" (coordinate data) and "multi-series" (label/value data).
 * This function maps all 14 chart data categories to one of these two editor modes.
 */
export function getEditorMode(chartDataMode: ChartDataMode): EditorMode {
  switch (chartDataMode) {
    // Coordinate-based charts
    case "xy":
    case "xyz":
      return "xy";

    // All other charts use label-value/multi-series style editing
    case "label-value":
    case "multi-series":
    case "range":
    case "waterfall":
    case "ohlc":
    case "box-plot":
    case "hierarchical":
    case "flow":
    case "funnel":
    case "heatmap":
    case "histogram":
    case "gauge":
    default:
      return "multi-series";
  }
}

/**
 * Get default data for a chart type when no data is provided
 */
function getDefaultDataForChartType(chartType: ChartDataMode): ChartDataType {
  switch (chartType) {
    case "ohlc":
      return DEFAULT_OHLC_DATA;
    case "box-plot":
      return DEFAULT_BOX_PLOT_DATA;
    default:
      return [];
  }
}

/**
 * Get default series names for specialized chart types
 */
function getDefaultSeriesNames(chartType: ChartDataMode): string[] {
  switch (chartType) {
    case "ohlc":
      return OHLC_SERIES_NAMES;
    case "box-plot":
      return BOX_PLOT_SERIES_NAMES;
    default:
      return ["value"];
  }
}

/**
 * Get default label key for specialized chart types
 */
function getDefaultLabelKey(chartType: ChartDataMode): string {
  switch (chartType) {
    case "ohlc":
      return OHLC_LABEL_KEY;
    case "box-plot":
      return BOX_PLOT_LABEL_KEY;
    default:
      return "label";
  }
}

export function useChartEditor(
  initialData: ChartDataType,
  chartType: ChartDataMode,
  initialSeriesChartTypes?: Record<string, SeriesChartType>,
) {
  // Use default data if initialData is empty for specialized chart types
  const effectiveInitialData =
    !Array.isArray(initialData) || initialData.length === 0
      ? getDefaultDataForChartType(chartType)
      : initialData;

  const [data, setData] = useState<ChartDataType>(effectiveInitialData);

  // Detect label key from initial data (e.g. "label" or "name") or use chart-type default
  const [labelKey] = useState<string>(() => {
    if (
      Array.isArray(effectiveInitialData) &&
      effectiveInitialData.length > 0
    ) {
      return getLabelKey(effectiveInitialData);
    }
    return getDefaultLabelKey(chartType);
  });

  // Get editor mode for backward compatibility (maps all 14 categories to xy or multi-series)
  const editorMode = getEditorMode(chartType);

  const [seriesNames, setSeriesNames] = useState<string[]>(() => {
    if (
      editorMode === "multi-series" &&
      Array.isArray(effectiveInitialData) &&
      effectiveInitialData.length > 0
    ) {
      const sample = effectiveInitialData[0] as MultiSeriesData;
      const keys = Object.keys(sample).filter(
        (key) => key !== labelKey && typeof sample[key] === "number",
      );
      return keys.length > 0 ? keys : getDefaultSeriesNames(chartType);
    }
    return getDefaultSeriesNames(chartType);
  });

  // Initialize series chart types from props or with defaults
  const [seriesChartTypes, setSeriesChartTypes] = useState<
    Record<string, SeriesChartType>
  >(() => {
    if (
      initialSeriesChartTypes &&
      Object.keys(initialSeriesChartTypes).length > 0
    ) {
      return initialSeriesChartTypes;
    }
    // Default: rotate through bar, line, area for each series
    const result: Record<string, SeriesChartType> = {};
    if (
      editorMode === "multi-series" &&
      Array.isArray(effectiveInitialData) &&
      effectiveInitialData.length > 0
    ) {
      const sample = effectiveInitialData[0] as MultiSeriesData;
      const keys = Object.keys(sample).filter(
        (key) => key !== labelKey && typeof sample[key] === "number",
      );
      keys.forEach((key, index) => {
        result[key] =
          DEFAULT_CHART_TYPES[index % DEFAULT_CHART_TYPES.length] ?? "bar";
      });
    }
    return result;
  });

  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const updateCell = useCallback(
    (rowIndex: number, field: string, value: string | number) => {
      if (editorMode === "xy") {
        const newData = [...(data as XYData[])];
        newData[rowIndex] = {
          ...newData[rowIndex],
          [field]: Number(value) || 0,
        } as XYData;
        setData(newData);
      } else {
        const newData = [...(data as MultiSeriesData[])];
        newData[rowIndex] = {
          ...newData[rowIndex],
          [field]: field === labelKey ? String(value) : Number(value) || 0,
        } as MultiSeriesData;
        setData(newData);
      }
    },
    [editorMode, data, labelKey],
  );

  const addRow = useCallback(() => {
    if (editorMode === "xy") {
      const hasZ = (data as XYData[]).some((d) => d.z !== undefined);
      const newRow: XYData = { x: 0, y: 0 };
      if (hasZ) newRow.z = 0;
      setData([...(data as XYData[]), newRow]);
    } else {
      const newRow: MultiSeriesData = { [labelKey]: "" };
      seriesNames.forEach((name) => {
        newRow[name] = 0;
      });
      setData([...(data as MultiSeriesData[]), newRow]);
    }
  }, [editorMode, data, seriesNames, labelKey]);

  const removeRow = useCallback(
    (index: number) => {
      const newData = [...(data as (XYData | MultiSeriesData)[])];
      newData.splice(index, 1);
      setData(newData as ChartDataType);
    },
    [data],
  );

  const addSeries = useCallback(() => {
    const newSeriesName = `Series ${seriesNames.length + 1}`;
    setSeriesNames([...seriesNames, newSeriesName]);
    const newData = (data as MultiSeriesData[]).map((row) => ({
      ...row,
      [newSeriesName]: 0,
    }));
    setData(newData as ChartDataType);
    // Set default chart type for new series (rotate through defaults)
    setSeriesChartTypes((prev) => ({
      ...prev,
      [newSeriesName]:
        DEFAULT_CHART_TYPES[seriesNames.length % DEFAULT_CHART_TYPES.length] ??
        "bar",
    }));
  }, [seriesNames, data]);

  const removeSeries = useCallback(
    (seriesName: string) => {
      if (seriesNames.length <= 1) return;
      setSeriesNames(seriesNames.filter((s) => s !== seriesName));
      const newData = (data as MultiSeriesData[]).map((row) => {
        const { [seriesName]: _, ...rest } = row;
        return rest as MultiSeriesData;
      });
      setData(newData as ChartDataType);
      // Remove chart type for deleted series
      setSeriesChartTypes((prev) => {
        const { [seriesName]: _, ...rest } = prev;
        return rest;
      });
    },
    [seriesNames, data],
  );

  const renameSeries = useCallback(
    (oldName: string, newName: string) => {
      if (!newName.trim() || newName === oldName) return;
      // Check for duplicate names
      if (seriesNames.includes(newName)) return;

      setSeriesNames(seriesNames.map((s) => (s === oldName ? newName : s)));
      const newData = (data as MultiSeriesData[]).map((row) => {
        const { [oldName]: value, ...rest } = row;
        return { ...rest, [newName]: value } as MultiSeriesData;
      });
      setData(newData as ChartDataType);
      // Preserve chart type under new name
      setSeriesChartTypes((prev) => {
        const { [oldName]: chartTypeForSeries, ...rest } = prev;
        return { ...rest, [newName]: chartTypeForSeries ?? "bar" };
      });
    },
    [seriesNames, data],
  );

  const updateSeriesChartType = useCallback(
    (seriesName: string, newChartType: SeriesChartType) => {
      setSeriesChartTypes((prev) => ({
        ...prev,
        [seriesName]: newChartType,
      }));
    },
    [],
  );

  const addZColumn = useCallback(() => {
    const newData = (data as XYData[]).map((row) => ({
      ...row,
      z: row.z ?? 10,
    }));
    setData(newData);
  }, [data]);

  const removeZColumn = useCallback(() => {
    const newData = (data as XYData[]).map((row) => {
      const { z: _, ...rest } = row;
      return rest as XYData;
    });
    setData(newData);
  }, [data]);

  const hasZColumn =
    editorMode === "xy" && (data as XYData[]).some((d) => d.z !== undefined);

  return {
    data,
    seriesNames,
    seriesChartTypes,
    focusedCell,
    setFocusedCell,
    updateCell,
    addRow,
    removeRow,
    addSeries,
    removeSeries,
    renameSeries,
    updateSeriesChartType,
    addZColumn,
    removeZColumn,
    hasZColumn,
    labelKey,
  };
}
