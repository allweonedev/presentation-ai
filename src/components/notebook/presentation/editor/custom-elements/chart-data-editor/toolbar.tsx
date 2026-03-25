import { Plus, X } from "lucide-react";
import { type ChartDataMode } from "./types";

interface ToolbarProps {
  chartType: ChartDataMode;
  rowCount: number;
  seriesCount: number;
  hasZColumn: boolean;
  onAddRow: () => void;
  onAddSeries: () => void;
  onAddZColumn: () => void;
  onRemoveZColumn: () => void;
}

export function Toolbar({
  chartType,
  rowCount,
  seriesCount,
  hasZColumn,
  onAddRow,
  onAddSeries,
  onAddZColumn,
  onRemoveZColumn,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="tabular-nums">{rowCount} rows</span>
        {chartType === "multi-series" && (
          <>
            <span className="text-border">•</span>
            <span className="tabular-nums">{seriesCount} series</span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {chartType === "xy" && (
          <button
            onClick={hasZColumn ? onRemoveZColumn : onAddZColumn}
            className="flex h-7 items-center gap-1.5 rounded px-2.5 text-xs font-medium transition-colors hover:bg-accent"
          >
            {hasZColumn ? (
              <>
                <X className="h-3.5 w-3.5" />
                <span>Remove Z</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Add Z (Size)</span>
              </>
            )}
          </button>
        )}

        {chartType === "multi-series" && (
          <button
            onClick={onAddSeries}
            className="flex h-7 items-center gap-1.5 rounded px-2.5 text-xs font-medium transition-colors hover:bg-accent"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Series</span>
          </button>
        )}

        <div className="mx-1 h-4 w-px bg-border" />

        <button
          onClick={onAddRow}
          className="flex h-7 items-center gap-1.5 rounded bg-primary/10 px-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Row</span>
        </button>
      </div>
    </div>
  );
}
