"use client";

import { useEditorRef } from "platejs/react";
import * as React from "react";

import {
  BLOCKS,
  PARENT_CHILD_RELATIONSHIP,
  getAvailableConversionOptions,
  handleLayoutChange,
} from "@/components/notebook/presentation/editor/lib";
import StaticPresentationEditor from "@/components/notebook/presentation/editor/presentation-editor-static";
import { type MyEditor } from "@/components/plate/editor-kit";
import { slideWith } from "@/components/presentation/edit-panel/sections/elements";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { type TElement } from "platejs";

interface LayoutPreviewSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentElement: Record<string, unknown> | undefined;
}

interface LayoutVariation {
  type: string;
  name: string;
  children: TElement[];
  color?: unknown;
  orientation?: string;
  sidedness?: string;
  numbered?: unknown;
  showLine?: unknown;
  variant?: string;
  key?: string;
}

/**
 * Scaled preview component with 20% scale and ResizeObserver for height
 */
function ScaledPreview({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = React.useState(0);
  const SCALE = 0.2; // Fixed 20% scale

  React.useLayoutEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const updateHeight = () => {
      if (contentRef.current) {
        const height =
          contentRef.current.scrollHeight ||
          contentRef.current.offsetHeight ||
          0;
        setContentHeight(height);
      }
    };

    const ro = new ResizeObserver(updateHeight);
    ro.observe(contentRef.current);
    updateHeight(); // Initial measurement

    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{
        height: contentHeight > 0 ? `${contentHeight * SCALE}px` : "auto",
        overflow: "hidden",
      }}
    >
      <div
        ref={contentRef}
        style={{
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
          width: `${100 / SCALE}%`,
          height: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Editor wrapper with delayed mounting to avoid Suspense issues
 */
function EditorWrapper({ elementNode }: { elementNode: TElement }) {
  const [showEditor, setShowEditor] = React.useState(false);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setShowEditor(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!showEditor) {
    return (
      <div className="w-full">
        <Skeleton className="aspect-video w-full" />
      </div>
    );
  }

  return (
    <ScaledPreview>
      <StaticPresentationEditor
        initialContent={slideWith([elementNode])}
        id={`preview-${elementNode.type}-${Math.random().toString(36).slice(2)}`}
        className="h-auto min-h-0!"
      />
    </ScaledPreview>
  );
}

/**
 * Component to render actual static previews using PresentationEditorStaticView
 */
function ElementPreview({
  variation,
  isVisible,
}: {
  variation: LayoutVariation;
  isVisible: boolean;
}) {
  if (!isVisible) {
    return (
      <div className="rounded-sm border bg-card">
        <Skeleton className="aspect-video w-full" />
      </div>
    );
  }

  const elementNode = {
    type: variation.type,
    children: variation.children,
    color: variation.color,
    orientation: variation.orientation,
    sidedness: variation.sidedness,
    numbered: variation.numbered,
    showLine: variation.showLine,
  } as TElement;

  return <EditorWrapper elementNode={elementNode} />;
}

function generatePreviewData(
  elementType: string,
  currentElement: TElement,
  variant?: string,
  variantKey?: string,
): LayoutVariation[] {
  const blockName =
    BLOCKS.find((b) => b.type === elementType)?.name || elementType;

  const previewElement: Record<string, unknown> = {
    ...currentElement,
    type: elementType,
    children: currentElement.children.map((child) => ({
      ...child,
      type: PARENT_CHILD_RELATIONSHIP[elementType]?.child || child.type,
    })),
  };

  if (variant && variantKey) {
    if (variantKey === "isFunnel") {
      previewElement.isFunnel = variant === "funnel";
    } else {
      previewElement[variantKey] = variant;
    }
  }

  if (!variant && variantKey === "orientation") {
    return [
      {
        type: elementType,
        name: `${blockName} - Vertical`,
        children: previewElement.children as TElement[],
        color: currentElement.color,
        orientation: "vertical",
        sidedness: previewElement.sidedness as string | undefined,
        numbered: previewElement.numbered,
        showLine: previewElement.showLine,
        variant: "vertical",
        key: "orientation",
      },
      {
        type: elementType,
        name: `${blockName} - Horizontal`,
        children: previewElement.children as TElement[],
        color: currentElement.color,
        orientation: "horizontal",
        sidedness: previewElement.sidedness as string | undefined,
        numbered: previewElement.numbered,
        showLine: previewElement.showLine,
        variant: "horizontal",
        key: "orientation",
      },
    ];
  }

  return [
    {
      type: elementType,
      name: blockName,
      children: previewElement.children as TElement[],
      color: currentElement.color,
      orientation: previewElement.orientation as string | undefined,
      sidedness: previewElement.sidedness as string | undefined,
      numbered: previewElement.numbered,
      showLine: previewElement.showLine,
      ...(variant && variantKey && { [variantKey]: variant }),
    },
  ];
}

export function LayoutPreviewSheet({
  open = false,
  onOpenChange,
  currentElement,
}: LayoutPreviewSheetProps) {
  const editor = useEditorRef<MyEditor>();
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isOpen = open || internalOpen;
  const handleOpenChange = onOpenChange || setInternalOpen;

  const currentElementType =
    (currentElement?.type as string) ?? BLOCKS[0]?.type ?? "";
  const availableOptions = React.useMemo(
    () => getAvailableConversionOptions(currentElementType),
    [currentElementType],
  );

  const currentElementAsTElement =
    (currentElement as TElement) ||
    ({
      type: currentElementType,
      children: [],
    } as TElement);

  const currentVariations = React.useMemo(
    () => generatePreviewData(currentElementType, currentElementAsTElement),
    [currentElementType, currentElementAsTElement],
  );

  const otherVariations = React.useMemo(() => {
    return Object.values(availableOptions)
      .flat()
      .flatMap((option) => {
        if (option.supportsOrientation) {
          return generatePreviewData(
            option.type,
            currentElementAsTElement,
            undefined,
            "orientation",
          );
        }
        return generatePreviewData(
          option.type,
          currentElementAsTElement,
          option.variant,
          option.key,
        );
      });
  }, [availableOptions, currentElementAsTElement]);

  const handleConvert = (
    type: string,
    variant?: string,
    variantKey?: string,
  ) => {
    if (variant && variantKey) {
      const variantData = { [variantKey]: variant };
      handleLayoutChange(editor, type, variantData);
    } else {
      handleLayoutChange(editor, type);
    }
    handleOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="ignore-click-outside/toolbar px-0 py-4"
      >
        <SheetHeader className="px-4">
          <SheetTitle>Change Layout</SheetTitle>
        </SheetHeader>

        <div className="mt-6 scrollbar-thin max-h-[calc(100vh-100px)] space-y-6 overflow-y-auto px-4 scrollbar-thumb-primary scrollbar-track-transparent">
          {/* Current Element Variations */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Current: {BLOCKS.find((b) => b.type === currentElementType)?.name}
            </h3>
            <div className="flex flex-col gap-4">
              {currentVariations.map((variation, index) => (
                <div
                  key={`current-${index}`}
                  className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  onClick={() =>
                    handleConvert(
                      variation.type,
                      variation.variant,
                      variation.key,
                    )
                  }
                >
                  <div className="mb-2">
                    <span className="text-sm font-medium">
                      {variation.name}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      {variation.orientation &&
                        `Orientation: ${variation.orientation}`}
                      {variation.sidedness &&
                        ` • Sidedness: ${variation.sidedness}`}
                    </div>
                  </div>
                  <ElementPreview variation={variation} isVisible={isOpen} />
                </div>
              ))}
            </div>
          </div>

          {/* Other Layout Types */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Other Layouts
            </h3>
            <div className="flex flex-col gap-4">
              {otherVariations.map((variation, index) => (
                <div
                  key={`other-${index}`}
                  className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  onClick={() =>
                    handleConvert(
                      variation.type,
                      variation.variant,
                      variation.key,
                    )
                  }
                >
                  <div className="mb-2">
                    <span className="text-sm font-medium">
                      {variation.name}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      {variation.orientation &&
                        `Orientation: ${variation.orientation}`}
                      {variation.sidedness &&
                        ` • Sidedness: ${variation.sidedness}`}
                    </div>
                  </div>
                  <ElementPreview variation={variation} isVisible={isOpen} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
