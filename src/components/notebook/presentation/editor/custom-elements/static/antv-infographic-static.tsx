"use client";

import { usePresentationTheme } from "@/components/presentation/providers/PresentationThemeProvider";
import { SparklesCore } from "@/components/ui/sparkles";
import { cn } from "@/lib/utils";
import { Infographic } from "@antv/infographic";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { type TAntvInfographicElement } from "../../plugins/antv-infographic-plugin";
import {
  applyThemeToData,
  applyThemeToSyntax,
} from "../../utils/infographic-utils";

/**
 *
 * Static (read-only) AntV Infographic component for preview/display
 * This component re-renders when element.data changes (unlike the editable version)
 */
export default function AntvInfographicStatic(
  props: PlateElementProps<TAntvInfographicElement>,
) {
  const { element, children } = props;
  const align = element.align ?? "center";

  const alignmentClasses = {
    center: "mx-auto",
    left: "mr-auto",
    right: "ml-auto",
  } as const;

  const containerStyles: React.CSSProperties = {
    width:
      typeof element.width === "string" || typeof element.width === "number"
        ? element.width
        : "100%",
  };

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const infographicRef = useRef<Infographic | null>(null);

  // State
  const [hasError, setHasError] = useState(false);

  // Theme
  const { resolvedTheme } = usePresentationTheme();
  const isDark = resolvedTheme === "dark";

  // Themed syntax
  const themedSyntax = useMemo(() => {
    return applyThemeToSyntax(element.syntax ?? "", isDark);
  }, [element.syntax, isDark]);

  // ============================================================================
  // INFOGRAPHIC INSTANCE LIFECYCLE
  // ============================================================================

  // Create infographic instance once (container is always mounted)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const instance = new Infographic({
      container,
      width: "100%",
      height: "100%",
      editable: false,
    });

    infographicRef.current = instance;

    return () => {
      try {
        instance.destroy();
      } catch {
        // Ignore destruction errors
      }
      infographicRef.current = null;
    };
  }, []);

  // Render content when data/syntax/theme changes
  useEffect(() => {
    const instance = infographicRef.current;
    if (!instance || element.isLoading) {
      return;
    }

    // Prefer data over syntax
    const payload =
      element.data && Object.keys(element.data).length > 0
        ? applyThemeToData(element.data, isDark)
        : themedSyntax;

    if (!payload || (typeof payload === "string" && !payload.trim())) return;

    try {
      instance.render(payload);
      setHasError(false);
    } catch (err) {
      console.error("Failed to render infographic:", err);
      setHasError(true);
    }
  }, [themedSyntax, element.isLoading, element.data]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <PlateElement {...props}>
      <div
        className={cn(
          "relative my-4 min-h-[300px] overflow-hidden rounded-lg",
          alignmentClasses[align],
        )}
        style={{
          ...containerStyles,
          backgroundColor: "var(--presentation-background)",
        }}
        data-slate-void="true"
        data-ppt-ignore="true"
        contentEditable={false}
      >
        {/* Container is always mounted so instance can be created */}
        <div
          ref={containerRef}
          className="min-h-[300px] w-full"
          style={{
            minHeight: "300px",
            display: element.isLoading || hasError ? "none" : "block",
          }}
        />

        {/* Loading state */}
        {element.isLoading && (
          <div className="relative flex h-[300px] w-full items-center justify-center">
            <SparklesCore
              background="transparent"
              minSize={1}
              maxSize={2}
              particleDensity={150}
              particleColor={isDark ? "#22d3ee" : "#0ea5e9"}
              className="absolute inset-0"
            />
          </div>
        )}

        {/* Error state */}
        {hasError && !element.isLoading && (
          <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-950">
            <p className="font-medium">Failed to render diagram</p>
            <p className="mt-1 text-sm text-red-400">
              Please try again with different content
            </p>
          </div>
        )}
      </div>
      {children}
    </PlateElement>
  );
}
