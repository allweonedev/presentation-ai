import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { GridHeader } from "./grid-header";
import { GridRow } from "./grid-row";
import {
  type ChartDataMode,
  type ChartDataType,
  type MultiSeriesData,
  type SeriesChartType,
  type XYData,
} from "./types";

interface GridProps {
  data: ChartDataType;
  chartType: ChartDataMode;
  seriesNames: string[];
  hasZColumn: boolean;
  focusedCell: { row: number; col: number } | null;
  onUpdateCell: (rowIndex: number, field: string, value: string) => void;
  onRemoveRow: (rowIndex: number) => void;
  onRenameSeries: (oldName: string, newName: string) => void;
  onRemoveSeries: (name: string) => void;
  onAddRow: () => void;
  onFocusCell: (row: number, col: number) => void;
  setFocusedCell: (cell: { row: number; col: number } | null) => void;
  seriesChartTypes?: Record<string, SeriesChartType>;
  onSeriesChartTypeChange?: (
    seriesName: string,
    chartType: SeriesChartType,
  ) => void;
  isComposedChart?: boolean;
  labelKey?: string;
}

export function Grid({
  data,
  chartType,
  seriesNames,
  hasZColumn,
  focusedCell,
  onUpdateCell,
  onRemoveRow,
  onRenameSeries,
  onRemoveSeries,
  onAddRow,
  onFocusCell,
  setFocusedCell,
  seriesChartTypes = {},
  onSeriesChartTypeChange,
  isComposedChart = false,
  labelKey = "label",
}: GridProps) {
  const cellRefs = useRef<Map<string, HTMLInputElement>>(new Map());
  const rows = Array.isArray(data)
    ? (data as (XYData | MultiSeriesData)[])
    : [];

  const getTotalColumns = useCallback(() => {
    if (chartType === "xy") {
      return hasZColumn ? 3 : 2;
    }
    return seriesNames.length + 1; // label + series columns
  }, [chartType, seriesNames.length, hasZColumn]);

  const registerCell = useCallback(
    (row: number, col: number, el: HTMLInputElement | null) => {
      const key = `${row}-${col}`;
      if (el) {
        cellRefs.current.set(key, el);
      } else {
        cellRefs.current.delete(key);
      }
    },
    [],
  );

  const focusCellElement = useCallback((row: number, col: number) => {
    const key = `${row}-${col}`;
    const cell = cellRefs.current.get(key);
    if (cell) {
      cell.focus();
      cell.select();
    }
  }, []);

  useEffect(() => {
    if (focusedCell) {
      focusCellElement(focusedCell.row, focusedCell.col);
    }
  }, [focusedCell, focusCellElement]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, row: number, col: number) => {
      const totalCols = getTotalColumns();
      const totalRows = rows.length;

      switch (e.key) {
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) {
            if (col > 0) {
              onFocusCell(row, col - 1);
            } else if (row > 0) {
              onFocusCell(row - 1, totalCols - 1);
            }
          } else {
            if (col < totalCols - 1) {
              onFocusCell(row, col + 1);
            } else if (row < totalRows - 1) {
              onFocusCell(row + 1, 0);
            } else {
              onAddRow();
              setTimeout(() => onFocusCell(totalRows, 0), 50);
            }
          }
          break;

        case "Enter":
          e.preventDefault();
          if (row < totalRows - 1) {
            onFocusCell(row + 1, col);
          } else {
            onAddRow();
            setTimeout(() => onFocusCell(totalRows, col), 50);
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (row > 0) onFocusCell(row - 1, col);
          break;

        case "ArrowDown":
          e.preventDefault();
          if (row < totalRows - 1) onFocusCell(row + 1, col);
          break;

        case "ArrowLeft":
          if (
            e.currentTarget instanceof HTMLInputElement &&
            e.currentTarget.selectionStart === 0
          ) {
            e.preventDefault();
            if (col > 0) onFocusCell(row, col - 1);
          }
          break;

        case "ArrowRight":
          if (
            e.currentTarget instanceof HTMLInputElement &&
            e.currentTarget.selectionStart === e.currentTarget.value.length
          ) {
            e.preventDefault();
            if (col < totalCols - 1) onFocusCell(row, col + 1);
          }
          break;
      }
    },
    [getTotalColumns, rows.length, onFocusCell, onAddRow],
  );

  return (
    <div className="overflow-hidden rounded-md border border-border bg-background">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <GridHeader
            chartType={chartType}
            seriesNames={seriesNames}
            hasZColumn={hasZColumn}
            onRenameSeries={onRenameSeries}
            onRemoveSeries={onRemoveSeries}
            seriesChartTypes={seriesChartTypes}
            onSeriesChartTypeChange={onSeriesChartTypeChange}
            isComposedChart={isComposedChart}
            labelKey={labelKey}
          />
          <tbody>
            {rows.map((row, rowIndex) => (
              <GridRow
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                chartType={chartType}
                seriesNames={seriesNames}
                hasZColumn={hasZColumn}
                focusedCol={
                  focusedCell?.row === rowIndex ? focusedCell.col : null
                }
                canDelete={rows.length > 1}
                onUpdateCell={(field, value) =>
                  onUpdateCell(rowIndex, field, value)
                }
                onRemoveRow={() => onRemoveRow(rowIndex)}
                onKeyDown={(e, col) => handleKeyDown(e, rowIndex, col)}
                onFocus={(col) => setFocusedCell({ row: rowIndex, col })}
                registerCell={(col, el) => registerCell(rowIndex, col, el)}
                labelKey={labelKey}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
