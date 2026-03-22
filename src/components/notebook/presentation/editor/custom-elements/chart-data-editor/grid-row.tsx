import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import type React from "react";
import { GridCell } from "./grid-cell";
import { type ChartDataMode, type MultiSeriesData, type XYData } from "./types";

interface GridRowProps {
  row: XYData | MultiSeriesData;
  rowIndex: number;
  chartType: ChartDataMode;
  seriesNames: string[];
  hasZColumn: boolean;
  focusedCol: number | null;
  canDelete: boolean;
  onUpdateCell: (field: string, value: string) => void;
  onRemoveRow: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, col: number) => void;
  onFocus: (col: number) => void;
  registerCell: (col: number, el: HTMLInputElement | null) => void;
  labelKey?: string;
}

export function GridRow({
  row,
  rowIndex,
  chartType,
  seriesNames,
  hasZColumn,
  focusedCol,
  canDelete,
  onUpdateCell,
  onRemoveRow,
  onKeyDown,
  onFocus,
  registerCell,
  labelKey = "label",
}: GridRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors",
        focusedCol !== null && "bg-primary/5",
        rowIndex % 2 === 1 && focusedCol === null && "bg-muted/30",
      )}
    >
      {/* Row number */}
      <td className="h-8 w-10 border-r border-border bg-muted/40 text-center font-mono text-xs text-muted-foreground select-none">
        {rowIndex + 1}
      </td>

      {chartType === "xy" ? (
        <>
          <td className="border-r border-border p-0">
            <GridCell
              value={(row as XYData).x || 0}
              type="number"
              rowIndex={rowIndex}
              colIndex={0}
              placeholder="0"
              onUpdate={(val) => onUpdateCell("x", val)}
              onKeyDown={(e) => onKeyDown(e, 0)}
              onFocus={() => onFocus(0)}
              registerRef={(el) => registerCell(0, el)}
              isFocused={focusedCol === 0}
            />
          </td>
          <td className="border-r border-border p-0">
            <GridCell
              value={(row as XYData).y || 0}
              type="number"
              rowIndex={rowIndex}
              colIndex={1}
              placeholder="0"
              onUpdate={(val) => onUpdateCell("y", val)}
              onKeyDown={(e) => onKeyDown(e, 1)}
              onFocus={() => onFocus(1)}
              registerRef={(el) => registerCell(1, el)}
              isFocused={focusedCol === 1}
            />
          </td>
          {hasZColumn && (
            <td className="border-r border-border p-0">
              <GridCell
                value={(row as XYData).z ?? 0}
                type="number"
                rowIndex={rowIndex}
                colIndex={2}
                placeholder="0"
                onUpdate={(val) => onUpdateCell("z", val)}
                onKeyDown={(e) => onKeyDown(e, 2)}
                onFocus={() => onFocus(2)}
                registerRef={(el) => registerCell(2, el)}
                isFocused={focusedCol === 2}
              />
            </td>
          )}
        </>
      ) : (
        <>
          <td className="border-r border-border p-0">
            <GridCell
              value={((row as MultiSeriesData)[labelKey] as string) || ""}
              type="text"
              rowIndex={rowIndex}
              colIndex={0}
              placeholder="Label"
              onUpdate={(val) => onUpdateCell(labelKey, val)}
              onKeyDown={(e) => onKeyDown(e, 0)}
              onFocus={() => onFocus(0)}
              registerRef={(el) => registerCell(0, el)}
              isFocused={focusedCol === 0}
            />
          </td>
          {seriesNames.map((name, colIndex) => (
            <td
              key={name}
              className="border-r border-border p-0 last:border-r-0"
            >
              <GridCell
                value={((row as MultiSeriesData)[name] as number) || 0}
                type="number"
                rowIndex={rowIndex}
                colIndex={colIndex + 1}
                placeholder="0"
                onUpdate={(val) => onUpdateCell(name, val)}
                onKeyDown={(e) => onKeyDown(e, colIndex + 1)}
                onFocus={() => onFocus(colIndex + 1)}
                registerRef={(el) => registerCell(colIndex + 1, el)}
                isFocused={focusedCol === colIndex + 1}
              />
            </td>
          ))}
        </>
      )}

      {/* Delete row button */}
      <td className="h-8 w-10 border-l border-border bg-muted/20 text-center">
        <button
          onClick={onRemoveRow}
          disabled={!canDelete}
          className={cn(
            "mx-auto flex h-6 w-6 items-center justify-center rounded",
            "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            "transition-colors",
            !canDelete && "cursor-not-allowed opacity-30",
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </td>
    </tr>
  );
}
