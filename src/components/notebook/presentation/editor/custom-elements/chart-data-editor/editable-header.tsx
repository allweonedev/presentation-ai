import { X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { ChartTypePicker } from "./chart-type-picker";
import { type SeriesChartType } from "./types";

interface EditableHeaderProps {
  value: string;
  onRename: (newName: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  colorIndex?: number;
  chartType?: SeriesChartType;
  onChartTypeChange?: (type: SeriesChartType) => void;
  showChartTypePicker?: boolean;
}

export function EditableHeader({
  value,
  onRename,
  onRemove,
  canRemove,
  colorIndex = 0,
  chartType = "bar",
  onChartTypeChange,
  showChartTypePicker = false,
}: EditableHeaderProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue.trim() && localValue !== value) {
      onRename(localValue);
    } else if (!localValue.trim()) {
      setLocalValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="group flex items-center gap-1">
      <div
        className="h-4 w-2 shrink-0 rounded-sm"
        style={{ backgroundColor: `hsl(var(--chart-${(colorIndex % 5) + 1}))` }}
      />
      {showChartTypePicker && onChartTypeChange && (
        <ChartTypePicker value={chartType} onChange={onChartTypeChange} />
      )}
      <input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onFocus={() => setIsEditing(true)}
        onKeyDown={handleKeyDown}
        className={`h-6 min-w-0 flex-1 border-0 bg-transparent px-1 text-xs font-semibold outline-hidden ${isEditing ? "bg-background ring-1 ring-primary" : ""} truncate focus:bg-background focus:ring-1 focus:ring-primary`}
        placeholder="Series"
      />
      {canRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
