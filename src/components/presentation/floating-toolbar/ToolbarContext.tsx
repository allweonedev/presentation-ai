"use client";

import { BlockSelectionPlugin } from "@platejs/selection/react";
import { type TImageElement } from "platejs";
import { useEditorRef, usePluginOption } from "platejs/react";
import * as React from "react";

import {
  COMPOSED_CHART_ELEMENT,
  getAlignmentOptions,
  getAvailableConversionOptions,
  getChartDataCategory,
  getColumnSizeOptions,
  getOrientationOptions,
  getSidednessOptions,
  isChartType,
  handleLayoutChange as layoutChange,
  handleNodePropertyUpdate as nodePropertyUpdate,
  supportsAlignment,
  supportsColumnSize,
  supportsNumbered,
  supportsOrientation,
  supportsShowLine,
  supportsSidedness,
} from "@/components/notebook/presentation/editor/lib";
import { type MyEditor } from "@/components/plate/editor-kit";
import {
  type ImageEditorMode,
  usePresentationState,
} from "@/states/presentation-state";

import {
  type ChartDataMode,
  type ChartDataType,
  type SeriesChartType,
} from "@/components/notebook/presentation/editor/custom-elements/chart-data-editor-dialog";

export interface ToolbarContextValue {
  editor: MyEditor;
  element: Record<string, unknown> | undefined;
  elementType: string;

  // Current property values
  currentOrientation: string;
  currentSidedness: string;
  currentNumbered: boolean;
  currentShowLine: boolean;
  currentColor: string;
  currentColumnSize: "sm" | "md" | "lg" | "xl";
  currentAlignment: "left" | "center" | "right";

  // Capability checks
  supportsOrientationControl: boolean;
  supportsSidednessControl: boolean;
  supportsNumberedControl: boolean;
  supportsShowLineControl: boolean;
  supportsColumnSizeControl: boolean;
  supportsAlignmentControl: boolean;
  isCurrentElementChart: boolean;
  isComposedChart: boolean;

  // Image-specific
  isImageElement: boolean;
  // Infographic-specific
  isInfographicElement: boolean;
  imageUrl: string | undefined;
  handleOpenImageEditor: (mode: ImageEditorMode) => void;

  // Chart-specific handler
  handleOpenChartEditor: () => void;

  // Infographic-specific handler
  handleOpenInfographicEditor: () => void;

  // Available options
  orientationOptions: readonly string[];
  sidednessOptions: readonly string[];
  columnSizeOptions: readonly string[];
  alignmentOptions: readonly ("left" | "center" | "right")[];
  availableOptionsGrouped: ReturnType<typeof getAvailableConversionOptions>;
  selectedOption: string;

  // Chart-specific
  chartData: ChartDataType;
  chartDataType: ChartDataMode;
  seriesChartTypes: Record<string, SeriesChartType>;

  // Handlers
  handleNodePropertyUpdate: (
    property: string,
    value:
      | string
      | boolean
      | number
      | Record<string, unknown>
      | unknown[]
      | undefined,
  ) => void;
  handleLayoutChange: (
    type: string,
    additionalData?: Record<string, unknown>,
  ) => void;
  handleChartDataUpdate: (newData: ChartDataType) => void;
  handleSeriesChartTypesUpdate: (
    types: Record<string, SeriesChartType>,
  ) => void;
}

const ToolbarContext = React.createContext<ToolbarContextValue | null>(null);

export function useToolbarContext() {
  const context = React.useContext(ToolbarContext);
  if (!context) {
    throw new Error("useToolbarContext must be used within a ToolbarProvider");
  }
  return context;
}

export function ToolbarProvider({ children }: { children: React.ReactNode }) {
  const editor = useEditorRef<MyEditor>();

  // Get current selection
  const selectionIds = usePluginOption(BlockSelectionPlugin, "selectedIds");
  const node = editor.api.nodes({ id: Array.from(selectionIds ?? [])[0] });
  const [element] = node?.[0] ?? [];

  // Get current element type and available options
  const elementType = (element?.type as string) ?? "";
  const availableOptionsGrouped = React.useMemo(
    () => getAvailableConversionOptions(elementType),
    [elementType],
  );

  // Get display name for current element
  const selectedOption = React.useMemo(() => {
    for (const elements of Object.values(availableOptionsGrouped)) {
      const found = elements.find((block) => block.type === elementType);
      if (found) return found.name;
    }
    return "Unknown";
  }, [elementType, availableOptionsGrouped]);

  // Get current properties
  const currentOrientation =
    (element as { orientation?: string })?.orientation ?? "vertical";
  const currentSidedness =
    (element as { sidedness?: string })?.sidedness ?? "single";
  const currentNumbered =
    (element as { numbered?: boolean })?.numbered ?? false;
  const currentShowLine = (element as { showLine?: boolean })?.showLine ?? true;
  const currentColor = (element as { color?: string })?.color ?? "#3b82f6";
  const currentColumnSize =
    (element as { columnSize?: "sm" | "md" | "lg" | "xl" })?.columnSize ?? "md";
  const currentAlignment =
    (element as { alignment?: "left" | "center" | "right" })?.alignment ??
    "center";

  // Check capabilities
  const supportsOrientationControl = supportsOrientation(elementType);
  const supportsSidednessControl = supportsSidedness(elementType);
  const supportsNumberedControl = supportsNumbered(elementType);
  const supportsShowLineControl = supportsShowLine(elementType);
  const supportsColumnSizeControl = supportsColumnSize(elementType);
  const supportsAlignmentControl = supportsAlignment(elementType);

  // Get available options
  const orientationOptions = getOrientationOptions(elementType);
  const sidednessOptions = getSidednessOptions(elementType);
  const columnSizeOptions = getColumnSizeOptions(elementType);
  const alignmentOptions = getAlignmentOptions(elementType);

  // Chart data
  const isCurrentElementChart = isChartType(elementType);
  const chartData = (element as { data?: unknown })?.data as ChartDataType;
  const chartDataType: ChartDataMode =
    (getChartDataCategory(elementType) as ChartDataMode) ?? "multi-series";
  const isComposedChart = elementType === COMPOSED_CHART_ELEMENT;
  const seriesChartTypes =
    (element as { seriesChartTypes?: Record<string, SeriesChartType> })
      ?.seriesChartTypes ?? {};

  // Image-specific
  const isImageElement = elementType === "img";
  // Infographic-specific
  const isInfographicElement = elementType === "antv-infographic";
  const imageUrl = (element as TImageElement | undefined)?.url;
  const openPresentationImageEditor = usePresentationState(
    (s) => s.openPresentationImageEditor,
  );

  const handleOpenImageEditor = React.useCallback(
    (mode: ImageEditorMode) => {
      if (!element?.id) return;
      // Create a bound updateElement function that captures the current editor and element
      const boundUpdateElement = (updateProps: Record<string, unknown>) => {
        editor.tf.setNodes(updateProps as Partial<TImageElement>, {
          at: [],
          match: (n) => n.id === element.id,
        });
      };
      // Open the presentation image editor panel with the bound function
      openPresentationImageEditor(mode, boundUpdateElement);
    },
    [editor, element, openPresentationImageEditor],
  );

  // Chart-specific handler
  const openChartEditor = usePresentationState((s) => s.openChartEditor);

  const handleOpenChartEditor = React.useCallback(() => {
    if (!element?.id) return;

    // Get chart data from element
    const chartElement = element as {
      type?: string;
      data?: unknown;
      variant?: string;
      orientation?: string;
      interpolation?: string;
      [key: string]: unknown;
    };

    // Extract chart options from element
    const {
      type,
      data,
      id: _id,
      children: _children,
      ...chartOptions
    } = chartElement;

    // Create a bound updateElement function that captures the current editor and element
    const boundUpdateElement = (updateProps: Record<string, unknown>) => {
      editor.tf.setNodes(updateProps, {
        at: [],
        match: (n) => n.id === element.id,
      });
    };

    // Open the chart editor panel with the element data and bound function
    openChartEditor(
      {
        chartType: (type as string) ?? "",
        chartData: data,
        chartOptions: chartOptions as Record<string, unknown>,
      },
      boundUpdateElement,
    );
  }, [editor, element, openChartEditor]);

  // Infographic-specific handler
  const openInfographicEditor = usePresentationState(
    (s) => s.openInfographicEditor,
  );

  const handleOpenInfographicEditor = React.useCallback(() => {
    if (!element?.id) return;

    // Create a bound updateElement function that captures the current editor and element
    const boundUpdateElement = (updateProps: Record<string, unknown>) => {
      editor.tf.setNodes(updateProps, {
        at: [],
        match: (n) => n.id === element.id,
      });
    };

    openInfographicEditor(boundUpdateElement);
  }, [editor, element, openInfographicEditor]);

  // Handlers
  const handleNodePropertyUpdate = React.useCallback(
    (
      property: string,
      value:
        | string
        | boolean
        | number
        | Record<string, unknown>
        | unknown[]
        | undefined,
    ) => {
      nodePropertyUpdate(editor, property, value);
    },
    [editor],
  );

  const handleLayoutChange = React.useCallback(
    (type: string, additionalData?: Record<string, unknown>) => {
      layoutChange(editor, type, additionalData);
    },
    [editor],
  );

  const handleChartDataUpdate = React.useCallback(
    (newData: ChartDataType) => {
      if (!element) return;
      editor.tf.setNodes(
        { data: newData },
        { at: editor.api.findPath(element) },
      );
    },
    [editor, element],
  );

  const handleSeriesChartTypesUpdate = React.useCallback(
    (types: Record<string, SeriesChartType>) => {
      if (!element) return;
      editor.tf.setNodes(
        { seriesChartTypes: types },
        { at: editor.api.findPath(element) },
      );
    },
    [editor, element],
  );

  const value: ToolbarContextValue = {
    editor,
    element: element as Record<string, unknown> | undefined,
    elementType,
    currentOrientation,
    currentSidedness,
    currentNumbered,
    currentShowLine,
    currentColor,
    currentColumnSize,
    currentAlignment,
    supportsOrientationControl,
    supportsSidednessControl,
    supportsNumberedControl,
    supportsShowLineControl,
    supportsColumnSizeControl,
    supportsAlignmentControl,
    isCurrentElementChart,
    isComposedChart,
    isImageElement,
    isInfographicElement,
    imageUrl,
    handleOpenImageEditor,
    orientationOptions,
    sidednessOptions,
    columnSizeOptions,
    alignmentOptions,
    availableOptionsGrouped,
    selectedOption,
    chartData,
    chartDataType,
    seriesChartTypes,
    handleNodePropertyUpdate,
    handleLayoutChange,
    handleChartDataUpdate,
    handleSeriesChartTypesUpdate,
    handleOpenChartEditor,
    handleOpenInfographicEditor,
  };

  return (
    <ToolbarContext.Provider value={value}>{children}</ToolbarContext.Provider>
  );
}
