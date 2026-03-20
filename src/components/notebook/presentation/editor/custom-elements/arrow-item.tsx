"use client";
import { IconPicker } from "@/components/ui/icon-picker";
import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  type TArrowListElement,
  type TArrowListItemElement,
} from "../plugins/arrow-plugin";
import { getAlignmentClasses } from "../utils";

// ArrowItem component for individual items in the arrow visualization
export const ArrowItem = (props: PlateElementProps<TArrowListItemElement>) => {
  const path = props.editor.api.findPath(props.element) ?? [-1];
  const parentPath = PathApi.parent(path);
  const parentElement = NodeApi.get(props.editor, parentPath);
  const { orientation, svgType, showIcon } = parentElement as TArrowListElement;
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isHorizontal = orientation === "horizontal";
  const { icon } = props.element as unknown as { icon?: string };

  // Get alignment - use item alignment if set, otherwise inherit from parent
  const itemAlignment = props.element.alignment;
  const parentAlignment = (parentElement as TArrowListElement)?.alignment;
  const alignment = itemAlignment ?? parentAlignment ?? "left";

  const handleIconSelect = (iconName: string) => {
    const itemPath = props.editor.api.findPath(props.element);
    if (!itemPath) return;
    props.editor.tf.setNodes({ icon: iconName }, { at: itemPath });
  };

  return (
    <div
      className={cn(
        "group/arrow-item relative mb-2 ml-4 flex w-full gap-6",
        isHorizontal && "flex-col",
        alignment === "right" && !isHorizontal && "mr-4 ml-0 flex-row-reverse",
        alignment === "center" && "justify-center",
      )}
    >
      {/* Chevron icon column */}
      <div
        className={cn(
          "relative grid shrink-0 place-items-center",
          isHorizontal ? "h-24 w-full" : "h-full w-24",
        )}
      >
        <ArrowChevron
          className={cn(
            "relative z-50 aspect-square overflow-visible",
            isHorizontal ? "top-4 -left-4" : "-top-4",
          )}
          isHorizontal={isHorizontal}
          sizeTargetRef={contentRef}
          svgType={svgType}
          color={
            (parentElement?.color as string) ||
            "var(--presentation-smart-layout, var(--presentation-primary))"
          }
          icon={icon ?? "FaHome"}
          showIcon={!!showIcon}
          onIconSelect={handleIconSelect}
        />
      </div>
      {/* Content column */}
      <div ref={contentRef} className={cn("grid w-full")}>
        <PlateElement
          {...props}
          className={cn("w-full", getAlignmentClasses(alignment))}
        >
          {props.children}
        </PlateElement>
      </div>
    </div>
  );
};

// Extracted SVG chevron for reuse and clarity
type ArrowChevronProps = {
  isHorizontal: boolean;
  sizeTargetRef: RefObject<HTMLDivElement | null>;
  svgType: "arrow" | "pill" | "parallelogram";
  color: string;
  icon: string;
  showIcon: boolean;
  className?: string;
  onIconSelect?: (iconName: string) => void;
  disabled?: boolean;
};

export const ArrowChevron = ({
  isHorizontal,
  sizeTargetRef,
  svgType,
  color,
  className,
  icon,
  showIcon,
  onIconSelect,
  disabled,
}: ArrowChevronProps) => {
  const [height, setHeight] = useState(90);
  const [width, setWidth] = useState(90);

  useEffect(() => {
    if (!sizeTargetRef.current) return;

    const updateDimensions = () => {
      const h = sizeTargetRef.current?.offsetHeight ?? 90;
      const w = sizeTargetRef.current?.offsetWidth ?? 90;
      setHeight(Math.max(h, 80));
      setWidth(Math.max(w, 80));
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(sizeTargetRef.current);

    return () => resizeObserver.disconnect();
  }, [sizeTargetRef]);

  const pathD = (() => {
    if (svgType === "pill") return ""; // handled as <rect/>
    if (svgType === "parallelogram") {
      const offset = 18;
      return isHorizontal
        ? `M0,0 L${width},0 L${Math.max(width - offset, 0)},90 L${-offset},90 Z`
        : `M0,${offset} L90,0 L90,${height} L0,${height + offset} Z`;
    }
    // default: arrow
    return isHorizontal
      ? `M${width},0L${width + 18},45L${width},90L0,90L18,45L0,0Z`
      : `M0,${height}L45,${height + 18}L90,${height}L90,0L45,18L0,0Z`;
  })();

  return (
    <>
      <svg
        className={cn(className, "h-max w-max")}
        preserveAspectRatio="none"
        data-shape={svgType}
        data-orientation={isHorizontal ? "horizontal" : "vertical"}
        data-fill-color={color}
      >
        {svgType === "pill" ? (
          isHorizontal ? (
            <rect
              x={0}
              y={0}
              width={width}
              height={90}
              rx={45}
              ry={45}
              style={{ fill: color }}
            />
          ) : (
            <rect
              x={0}
              y={0}
              width={80}
              height={Math.max(height, 100)}
              rx={40}
              ry={40}
              style={{ fill: color }}
            />
          )
        ) : (
          <path d={pathD} style={{ fill: color }}></path>
        )}
      </svg>

      {showIcon ? (
        <div
          className={cn(
            "pointer-events-auto absolute inset-0 z-50 grid place-items-center",
          )}
        >
          <div
            className={cn(
              "relative",
              isHorizontal ? "top-3 -left-5" : "-top-4 -left-2",
            )}
          >
            <IconPicker
              disabled={disabled}
              defaultIcon={icon}
              onIconSelect={(name) => onIconSelect?.(name)}
              className="shadow-none disabled:opacity-100"
              size="md"
              style={{
                backgroundColor: color,
                borderColor: "transparent",
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

// cleanup: removed unused/incomplete stubs
