"use client";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { useEffect, useState } from "react";
import {
  ChartDataEditor,
  type ChartDataMode,
  type ChartDataType,
  type SeriesChartType,
} from "./chart-data-editor";

interface ChartDataEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ChartDataType;
  onDataChange: (data: ChartDataType) => void;
  chartType: ChartDataMode;
  title?: string;
  isComposedChart?: boolean;
  seriesChartTypes?: Record<string, SeriesChartType>;
  onSeriesChartTypesChange?: (types: Record<string, SeriesChartType>) => void;
}

export function ChartDataEditorDialog({
  open,
  onOpenChange,
  data,
  onDataChange,
  chartType,
  title = "Edit Chart Data",
  isComposedChart = false,
  seriesChartTypes: initialSeriesChartTypes,
  onSeriesChartTypesChange,
}: ChartDataEditorDialogProps) {
  const [localData, setLocalData] = useState<ChartDataType>(data);
  const [localSeriesChartTypes, setLocalSeriesChartTypes] = useState<
    Record<string, SeriesChartType>
  >(initialSeriesChartTypes ?? {});

  // Sync with external data when dialog opens
  useEffect(() => {
    if (open) {
      setLocalData(data);
      setLocalSeriesChartTypes(initialSeriesChartTypes ?? {});
    }
  }, [open, data, initialSeriesChartTypes]);

  const handleSave = () => {
    onDataChange(localData);
    if (isComposedChart && onSeriesChartTypesChange) {
      onSeriesChartTypesChange(localSeriesChartTypes);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalData(data);
    setLocalSeriesChartTypes(initialSeriesChartTypes ?? {});
    onOpenChange(false);
  };

  const handleDataChange = (newData: ChartDataType) => {
    setLocalData(newData);
  };

  const handleSeriesChartTypesChange = (
    types: Record<string, SeriesChartType>,
  ) => {
    setLocalSeriesChartTypes(types);
  };

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className="ignore-click-outside/toolbar flex h-full max-h-[85dvh] max-w-5xl flex-col overflow-hidden">
        <CredenzaHeader>
          <CredenzaTitle>{title}</CredenzaTitle>
          <CredenzaDescription>
            Edit chart data. Use{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">Tab</kbd> to
            move between cells,{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">Enter</kbd>{" "}
            to add rows, and{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">
              Arrow keys
            </kbd>{" "}
            to navigate.
          </CredenzaDescription>
        </CredenzaHeader>

        <div className="flex-1 overflow-auto">
          <ChartDataEditor
            data={localData}
            chartType={chartType}
            onDataChange={handleDataChange}
            isComposedChart={isComposedChart}
            seriesChartTypes={localSeriesChartTypes}
            onSeriesChartTypesChange={handleSeriesChartTypesChange}
          />
        </div>

        <CredenzaFooter className="border-t pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}

// Re-export types for backward compatibility
export type {
  ChartDataMode,
  ChartDataType,
  LabelValueData,
  MultiSeriesData,
  SeriesChartType,
  XYData,
} from "./chart-data-editor";
