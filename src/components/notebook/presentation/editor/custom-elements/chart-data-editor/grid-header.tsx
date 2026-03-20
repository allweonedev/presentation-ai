import { keyToLabel } from "../chart-utils";
import { EditableHeader } from "./editable-header";
import { type ChartDataMode, type SeriesChartType } from "./types";

interface GridHeaderProps {
  chartType: ChartDataMode;
  seriesNames: string[];
  hasZColumn: boolean;
  onRenameSeries: (oldName: string, newName: string) => void;
  onRemoveSeries: (name: string) => void;
  seriesChartTypes?: Record<string, SeriesChartType>;
  onSeriesChartTypeChange?: (
    seriesName: string,
    chartType: SeriesChartType,
  ) => void;
  isComposedChart?: boolean;
  labelKey?: string;
}

export function GridHeader({
  chartType,
  seriesNames,
  hasZColumn,
  onRenameSeries,
  onRemoveSeries,
  seriesChartTypes = {},
  onSeriesChartTypeChange,
  isComposedChart = false,
  labelKey = "label",
}: GridHeaderProps) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="border-b-2 border-border bg-muted/60">
        {/* Row number header */}
        <th className="h-8 w-10 border-r border-border bg-muted/80 text-center text-xs font-semibold text-muted-foreground">
          #
        </th>

        {chartType === "xy" ? (
          <>
            <th className="h-8 w-28 border-r border-border px-2 text-left text-xs font-semibold">
              X
            </th>
            <th className="h-8 w-28 border-r border-border px-2 text-left text-xs font-semibold">
              Y
            </th>
            {hasZColumn && (
              <th className="h-8 w-28 border-r border-border px-2 text-left text-xs font-semibold">
                Z (Size)
              </th>
            )}
          </>
        ) : (
          <>
            <th className="h-8 w-36 border-r border-border px-2 text-left text-xs font-semibold">
              {keyToLabel(labelKey)}
            </th>
            {seriesNames.map((name, idx) => (
              <th
                key={name}
                className="h-8 min-w-[120px] border-r border-border px-2 last:border-r-0"
              >
                <EditableHeader
                  value={name}
                  onRename={(newName) => onRenameSeries(name, newName)}
                  onRemove={() => onRemoveSeries(name)}
                  canRemove={seriesNames.length > 1}
                  colorIndex={idx}
                  chartType={seriesChartTypes[name] ?? "bar"}
                  onChartTypeChange={
                    onSeriesChartTypeChange
                      ? (type) => onSeriesChartTypeChange(name, type)
                      : undefined
                  }
                  showChartTypePicker={isComposedChart}
                />
              </th>
            ))}
          </>
        )}
        {/* Delete column header */}
        <th className="h-8 w-10 border-l border-border bg-muted/80"></th>
      </tr>
    </thead>
  );
}
