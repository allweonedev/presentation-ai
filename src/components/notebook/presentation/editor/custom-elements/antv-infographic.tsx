"use client";

import {
  mediaResizeHandleVariants,
  Resizable,
} from "@/components/plate/ui/resize-handle";
import { SparklesCore } from "@/components/ui/sparkles";
import { useAntvInfographicActions } from "@/hooks/presentation/infographic/useAntvInfographicActions";
import { useAntvInfographicGeneration } from "@/hooks/presentation/infographic/useAntvInfographicGeneration";
import { useAntvInfographicInstance } from "@/hooks/presentation/infographic/useAntvInfographicInstance";
import { useAntvInfographicMutationSync } from "@/hooks/presentation/infographic/useAntvInfographicMutationSync";
import { useAntvInfographicRendering } from "@/hooks/presentation/infographic/useAntvInfographicRendering";
import { useAntvInfographicTheme } from "@/hooks/presentation/infographic/useAntvInfographicTheme";
import { useSyncedAntvElementRef } from "@/hooks/presentation/infographic/useSyncedAntvElementRef";
import { cn } from "@/lib/utils";
import { ResizableProvider, ResizeHandle } from "@platejs/resizable";
import { type PlateElementProps, useReadOnly, withHOC } from "platejs/react";
import { memo, useRef, useState } from "react";
import { type TAntvInfographicElement } from "../plugins/antv-infographic-plugin";
import { EventBoundary } from "./event-boundary";

/**
 * Editable AntV Infographic component for the Plate editor
 */
const AntvInfographicBase = memo(function AntvInfographic(
  props: PlateElementProps<TAntvInfographicElement>,
) {
  const { element, attributes, editor } = props;
  const readOnly = useReadOnly();
  const containerRef = useRef<HTMLDivElement>(null);
  const editBarContainerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const elementRef = useSyncedAntvElementRef(element);
  const infographicRef = useAntvInfographicInstance(
    containerRef,
    editBarContainerRef,
  );
  const { isDark, themedSyntax } = useAntvInfographicTheme(element.syntax);
  const align = element.align ?? "center";

  const { syntax } = useAntvInfographicGeneration({
    editor,
    element,
    setHasError,
  });

  useAntvInfographicRendering({
    infographicRef,
    element,
    elementRef,
    themedSyntax,
    isDark,
    syntax,
    setHasError,
  });

  useAntvInfographicMutationSync({
    infographicRef,
    editor,
    elementRef,
    syntax: element.syntax,
  });

  const { handleDelete } = useAntvInfographicActions({ editor, elementRef });

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <EventBoundary
      {...attributes}
      className="slate-editable-void slate-selectable relative my-4 w-full"
      style={{ backgroundColor: "var(--presentation-background)" }}
      data-slate-void="true"
      // data-ppt-ignore="true"
      contentEditable={false}
    >
      <style>{`
        .infographic-edit-popover:last-child {
          display: none;
        }
      `}</style>

      <Resizable
        align={align}
        options={{
          align,
          readOnly,
        }}
        className={cn("flex", !element.width && "w-full")}
      >
        <ResizeHandle
          className={mediaResizeHandleVariants({ direction: "left" })}
          options={{ direction: "left" }}
        />

        <div
          ref={editBarContainerRef}
          className="relative min-h-[300px] w-full overflow-hidden rounded-lg"
        >
          {hasError ? (
            <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-950">
              <p className="font-medium">Failed to generate diagram</p>
              <p className="mt-1 text-sm text-red-400">
                Please try again with different text
              </p>
              <button
                type="button"
                onClick={handleDelete}
                className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              {/* Container is always mounted for stable instance */}
              <div
                ref={containerRef}
                className="min-h-[300px] w-full"
                style={{
                  minHeight: "300px",
                  opacity: element.isLoading ? 0.35 : 1,
                }}
              />

              {element.isLoading && (
                <SparklesCore
                  background="transparent"
                  minSize={1}
                  maxSize={2}
                  particleDensity={150}
                  particleColor={isDark ? "#22d3ee" : "#0ea5e9"}
                  className="pointer-events-none absolute inset-0 z-10"
                />
              )}
            </>
          )}
        </div>

        <ResizeHandle
          className={mediaResizeHandleVariants({ direction: "right" })}
          options={{ direction: "right" }}
        />
      </Resizable>
    </EventBoundary>
  );
}, areEqualInfographicProps);

export const AntvInfographic = withHOC(ResizableProvider, AntvInfographicBase);

/**
 * Custom equality check - ignores data changes to prevent re-renders while editing
 */
function areEqualInfographicProps(
  prev: PlateElementProps<TAntvInfographicElement>,
  next: PlateElementProps<TAntvInfographicElement>,
): boolean {
  if (prev.editor !== next.editor) return false;
  if (prev.attributes !== next.attributes) return false;

  return (
    prev.element.id === next.element.id &&
    prev.element.syntax === next.element.syntax &&
    prev.element.isLoading === next.element.isLoading &&
    prev.element.sourceText === next.element.sourceText &&
    prev.element.generationPrompt === next.element.generationPrompt
  );
}
