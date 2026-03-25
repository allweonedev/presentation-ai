"use client";

import { useEffect } from "react";
import { Grid } from "./grid";
import { Toolbar } from "./toolbar";
import {
  type ChartDataMode,
  type ChartDataType,
  type SeriesChartType,
} from "./types";
import { useChartEditor } from "./use-chart-editor";

interface ChartDataEditorProps {
  data: ChartDataType;
  chartType: ChartDataMode;
  onDataChange: (data: ChartDataType) => void;
  isComposedChart?: boolean;
  seriesChartTypes?: Record<string, SeriesChartType>;
  onSeriesChartTypesChange?: (types: Record<string, SeriesChartType>) => void;
}

export function ChartDataEditor({
  data: initialData,
  chartType,
  onDataChange,
  isComposedChart = false,
  seriesChartTypes: initialSeriesChartTypes,
  onSeriesChartTypesChange,
}: ChartDataEditorProps) {
  const {
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
  } = useChartEditor(initialData, chartType, initialSeriesChartTypes);

  // Auto-save on data change (non-blocking)
  useEffect(() => {
    onDataChange(data);
  }, [data, onDataChange]);

  // Auto-save on series chart types change
  useEffect(() => {
    if (isComposedChart && onSeriesChartTypesChange) {
      onSeriesChartTypesChange(seriesChartTypes);
    }
  }, [seriesChartTypes, isComposedChart, onSeriesChartTypesChange]);

  const handleFocusCell = (row: number, col: number) => {
    setFocusedCell({ row, col });
  };

  return (
    <div className="flex flex-col gap-3">
      <Toolbar
        chartType={chartType}
        rowCount={(data as unknown[]).length}
        seriesCount={seriesNames.length}
        hasZColumn={hasZColumn}
        onAddRow={addRow}
        onAddSeries={addSeries}
        onAddZColumn={addZColumn}
        onRemoveZColumn={removeZColumn}
      />

      <Grid
        data={data}
        chartType={chartType}
        seriesNames={seriesNames}
        hasZColumn={hasZColumn}
        focusedCell={focusedCell}
        onUpdateCell={updateCell}
        onRemoveRow={removeRow}
        onRenameSeries={renameSeries}
        onRemoveSeries={removeSeries}
        onAddRow={addRow}
        onFocusCell={handleFocusCell}
        setFocusedCell={setFocusedCell}
        seriesChartTypes={seriesChartTypes}
        onSeriesChartTypeChange={updateSeriesChartType}
        isComposedChart={isComposedChart}
        labelKey={labelKey}
      />

      {(data as unknown[]).length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">No data points yet</p>
          <p className="mt-1 text-xs">
            Click{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              Add Row
            </kbd>{" "}
            or press{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>{" "}
            to get started
          </p>
        </div>
      )}
    </div>
  );
}

export * from "./types";
