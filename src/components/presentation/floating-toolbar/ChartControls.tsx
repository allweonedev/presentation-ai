"use client";

import * as React from "react";

import { ChartDataEditorDialog } from "@/components/notebook/presentation/editor/custom-elements/chart-data-editor-dialog";
import {
  BAR_CHART_ELEMENT,
  BOX_PLOT_CHART_ELEMENT,
  CONE_FUNNEL_CHART_ELEMENT,
  FUNNEL_CHART_ELEMENT,
  LINEAR_GAUGE_ELEMENT,
  PYRAMID_CHART_ELEMENT,
  RADIAL_GAUGE_ELEMENT,
  RANGE_BAR_CHART_ELEMENT,
} from "@/components/notebook/presentation/editor/lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/plate/ui/dropdown-menu";
import {
  ToolbarButton,
  ToolbarGroup,
  ToolbarMenuGroup,
} from "@/components/plate/ui/toolbar";
import { Input } from "@/components/ui/input";
import { Settings, Table2 } from "lucide-react";
import { useToolbarContext } from "./ToolbarContext";

export function ChartControls() {
  const [chartDataEditorOpen, setChartDataEditorOpen] = React.useState(false);
  const {
    element,
    elementType,
    isCurrentElementChart,
    isComposedChart,
    selectedOption,
    chartData,
    chartDataType,
    seriesChartTypes,
    handleNodePropertyUpdate,
    handleChartDataUpdate,
    handleSeriesChartTypesUpdate,
    handleOpenChartEditor,
  } = useToolbarContext();

  if (!isCurrentElementChart) {
    return null;
  }

  // Check if this is a gauge chart
  const isGaugeChart =
    elementType === RADIAL_GAUGE_ELEMENT ||
    elementType === LINEAR_GAUGE_ELEMENT;

  // Extract gauge value from data
  const getGaugeValue = (): number => {
    if (typeof chartData === "number") return chartData;
    if (
      typeof chartData === "object" &&
      chartData !== null &&
      "value" in chartData
    ) {
      return (chartData as { value: number }).value;
    }
    if (Array.isArray(chartData) && chartData.length > 0) {
      const firstItem = chartData[0] as Record<string, unknown>;
      const numericKey = Object.keys(firstItem).find(
        (key) => typeof firstItem[key] === "number",
      );
      if (numericKey) return firstItem[numericKey] as number;
    }
    return 50;
  };

  const handleGaugeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!Number.isNaN(newValue)) {
      const clampedValue = Math.min(100, Math.max(0, newValue));
      handleChartDataUpdate([{ value: clampedValue }]);
    }
  };

  const variant = (element as { variant?: string })?.variant ?? "default";
  const scatterShape =
    (element as { scatterShape?: string })?.scatterShape ?? "circle";

  // New property extractions
  const orientation =
    (element as { orientation?: string })?.orientation ?? "vertical";
  const interpolation =
    (element as { interpolation?: string })?.interpolation ?? "smooth";
  const needleEnabled =
    (element as { needle?: { enabled?: boolean } })?.needle?.enabled ?? false;
  const barEnabled =
    (element as { bar?: { enabled?: boolean } })?.bar?.enabled ?? true;

  const supportsVariant =
    elementType === "chart-bar" ||
    elementType === "chart-area" ||
    elementType === "chart-pie" ||
    elementType === "chart-radar";

  const supportsCurveType =
    elementType === "chart-line" || elementType === "chart-area";

  const supportsScatterShape = elementType === "chart-scatter";

  // Charts that support orientation (vertical/horizontal)
  const orientationSupportedCharts: string[] = [
    BAR_CHART_ELEMENT,
    RANGE_BAR_CHART_ELEMENT,
    FUNNEL_CHART_ELEMENT,
    CONE_FUNNEL_CHART_ELEMENT,
    PYRAMID_CHART_ELEMENT,
    LINEAR_GAUGE_ELEMENT,
    BOX_PLOT_CHART_ELEMENT,
  ];
  const supportsChartOrientation =
    orientationSupportedCharts.includes(elementType);

  // Radial gauge specific
  const isRadialGauge = elementType === RADIAL_GAUGE_ELEMENT;

  return (
    <>
      {/* Gauge Chart: Inline Value Input */}
      {isGaugeChart ? (
        <div className="flex items-center gap-1.5 border-r px-1 pr-2">
          <Input
            type="number"
            value={getGaugeValue()}
            onChange={handleGaugeValueChange}
            min={0}
            max={100}
            className="h-7 w-16 [appearance:textfield] text-center text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      ) : (
        /* Other Charts: Edit Data Button */
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => setChartDataEditorOpen(true)}
            tooltip="Edit Chart Data"
            size="sm"
            className="gap-1"
          >
            <Table2 className="h-4 w-4" />
            <span>Edit Data</span>
          </ToolbarButton>
        </ToolbarGroup>
      )}

      {/* Chart Variant Dropdown */}
      {supportsVariant && (
        <ToolbarGroup>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <ToolbarButton tooltip="Chart Variant" size="sm" isDropdown>
                <span className="capitalize">{variant}</span>
              </ToolbarButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="ignore-click-outside/toolbar min-w-0"
              align="start"
            >
              <ToolbarMenuGroup
                value={variant}
                onValueChange={(v) => handleNodePropertyUpdate("variant", v)}
                label="Variant"
              >
                <DropdownMenuRadioItem value="default">
                  Default
                </DropdownMenuRadioItem>
                {elementType === "chart-bar" && (
                  <DropdownMenuRadioItem value="stacked">
                    Stacked
                  </DropdownMenuRadioItem>
                )}
                {elementType === "chart-area" && (
                  <DropdownMenuRadioItem value="stacked">
                    Stacked
                  </DropdownMenuRadioItem>
                )}
                {elementType === "chart-pie" && (
                  <DropdownMenuRadioItem value="donut">
                    Donut
                  </DropdownMenuRadioItem>
                )}
                {elementType === "chart-radar" && (
                  <DropdownMenuRadioItem value="outline">
                    Outline
                  </DropdownMenuRadioItem>
                )}
              </ToolbarMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ToolbarGroup>
      )}

      {/* Chart Interpolation Dropdown (Line/Area) */}
      {supportsCurveType && (
        <ToolbarGroup>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <ToolbarButton tooltip="Interpolation" size="sm" isDropdown>
                <span className="capitalize">{interpolation}</span>
              </ToolbarButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="ignore-click-outside/toolbar min-w-0"
              align="start"
            >
              <ToolbarMenuGroup
                value={interpolation}
                onValueChange={(v) =>
                  handleNodePropertyUpdate("interpolation", v)
                }
                label="Interpolation"
              >
                <DropdownMenuRadioItem value="linear">
                  Linear
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="smooth">
                  Smooth
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="step">Step</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="step-start">
                  Step Start
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="step-end">
                  Step End
                </DropdownMenuRadioItem>
              </ToolbarMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ToolbarGroup>
      )}

      {/* Scatter Shape Dropdown */}
      {supportsScatterShape && (
        <ToolbarGroup>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <ToolbarButton tooltip="Point Shape" size="sm" isDropdown>
                <span className="capitalize">{scatterShape}</span>
              </ToolbarButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="ignore-click-outside/toolbar min-w-0"
              align="start"
            >
              <ToolbarMenuGroup
                value={scatterShape}
                onValueChange={(s) =>
                  handleNodePropertyUpdate("scatterShape", s)
                }
                label="Shape"
              >
                <DropdownMenuRadioItem value="circle">
                  Circle
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="cross">
                  Cross
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="diamond">
                  Diamond
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="heart">
                  Heart
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pin">Pin</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="plus">Plus</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="square">
                  Square
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="star">Star</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="triangle">
                  Triangle
                </DropdownMenuRadioItem>
              </ToolbarMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ToolbarGroup>
      )}

      {/* Chart Orientation Dropdown */}
      {supportsChartOrientation && (
        <ToolbarGroup>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <ToolbarButton tooltip="Orientation" size="sm" isDropdown>
                <span className="capitalize">{orientation}</span>
              </ToolbarButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="ignore-click-outside/toolbar min-w-0"
              align="start"
            >
              <ToolbarMenuGroup
                value={orientation}
                onValueChange={(v) =>
                  handleNodePropertyUpdate("orientation", v)
                }
                label="Orientation"
              >
                <DropdownMenuRadioItem value="vertical">
                  Vertical
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="horizontal">
                  Horizontal
                </DropdownMenuRadioItem>
              </ToolbarMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ToolbarGroup>
      )}

      {/* Radial Gauge Needle/Bar Toggles */}
      {isRadialGauge && (
        <>
          <ToolbarGroup>
            <ToolbarButton
              onClick={() =>
                handleNodePropertyUpdate("needle", { enabled: !needleEnabled })
              }
              tooltip={needleEnabled ? "Hide Needle" : "Show Needle"}
              size="sm"
              pressed={needleEnabled}
            >
              Needle
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarButton
              onClick={() =>
                handleNodePropertyUpdate("bar", { enabled: !barEnabled })
              }
              tooltip={barEnabled ? "Hide Bar" : "Show Bar"}
              size="sm"
              pressed={barEnabled}
            >
              Bar
            </ToolbarButton>
          </ToolbarGroup>
        </>
      )}

      {/* Edit Chart Button - Opens sidebar for all chart settings */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={handleOpenChartEditor}
          tooltip="Edit Chart"
          size="sm"
          className="gap-1"
        >
          <Settings className="h-4 w-4" />
          <span>Edit Chart</span>
        </ToolbarButton>
      </ToolbarGroup>

      {/* Chart Data Editor Dialog */}
      <ChartDataEditorDialog
        open={chartDataEditorOpen}
        onOpenChange={setChartDataEditorOpen}
        data={chartData || []}
        onDataChange={handleChartDataUpdate}
        chartType={chartDataType}
        title={`Edit ${selectedOption} Data`}
        isComposedChart={isComposedChart}
        seriesChartTypes={seriesChartTypes}
        onSeriesChartTypesChange={handleSeriesChartTypesUpdate}
      />
    </>
  );
}
