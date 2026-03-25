"use client";

// Import CycleItem and constants
import { useForceUpdateChildrenOnLengthChange } from "@/hooks/presentation/useForceUpdateChildrenOnLengthChange";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { PlateElement, type StyledPlateElementProps } from "platejs/react";
import React from "react";
import { type TCycleItemElement } from "../plugins/cycle-plugin";

const generateSegmentPath = (
  index: number,
  totalSegments: number,
  innerRadius: number,
  outerRadius: number,
  centerX: number,
  centerY: number,
) => {
  const anglePerSegment = (2 * Math.PI) / totalSegments;
  const startAngle = index * anglePerSegment;
  const endAngle = (index + 1) * anglePerSegment;

  // Main corner points
  const outerStart = {
    x: centerX + outerRadius * Math.cos(startAngle),
    y: centerY + outerRadius * Math.sin(startAngle),
  };
  const outerEnd = {
    x: centerX + outerRadius * Math.cos(endAngle),
    y: centerY + outerRadius * Math.sin(endAngle),
  };
  const innerStart = {
    x: centerX + innerRadius * Math.cos(startAngle),
    y: centerY + innerRadius * Math.sin(startAngle),
  };
  const innerEnd = {
    x: centerX + innerRadius * Math.cos(endAngle),
    y: centerY + innerRadius * Math.sin(endAngle),
  };

  // Create the arrow notch in the crack
  // The arrow should point perpendicular to the radial line
  const notchDepth = 7; // Further decreased for maximum pointiness
  const notchPosition = 0.5; // Middle of the crack

  // For END crack (right side)
  const endNotchRadius =
    innerRadius + (outerRadius - innerRadius) * notchPosition;
  const endNotchBase = {
    x: centerX + endNotchRadius * Math.cos(endAngle),
    y: centerY + endNotchRadius * Math.sin(endAngle),
  };
  // Perpendicular offset (tangent direction, clockwise)
  const endNotchTip = {
    x: endNotchBase.x + notchDepth * Math.sin(endAngle),
    y: endNotchBase.y - notchDepth * Math.cos(endAngle),
  };

  // For START crack (left side) - same direction (clockwise)
  const startNotchRadius =
    innerRadius + (outerRadius - innerRadius) * notchPosition;
  const startNotchBase = {
    x: centerX + startNotchRadius * Math.cos(startAngle),
    y: centerY + startNotchRadius * Math.sin(startAngle),
  };
  const startNotchTip = {
    x: startNotchBase.x + notchDepth * Math.sin(startAngle),
    y: startNotchBase.y - notchDepth * Math.cos(startAngle),
  };

  const largeArcFlag = anglePerSegment > Math.PI ? 1 : 0;

  // Build path
  let path = `M ${outerStart.x} ${outerStart.y}`;

  // Outer arc
  path += ` A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`;

  // End crack with arrow notch
  path += ` L ${endNotchTip.x} ${endNotchTip.y}`;
  path += ` L ${innerEnd.x} ${innerEnd.y}`;

  // Inner arc
  path += ` A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`;

  // Start crack with arrow notch
  path += ` L ${startNotchTip.x} ${startNotchTip.y}`;
  path += ` L ${outerStart.x} ${outerStart.y}`;

  path += " Z";
  return path;
};

// Dynamic wheel SVG that respects existing styling
export function DynamicWheelSVG({ segments }: { segments: number }) {
  const centerX = 50;
  const centerY = 50;
  const innerRadius = 15;
  const outerRadius = 48;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      style={{
        fill: "var(--presentation-smart-layout, var(--presentation-primary))",
      }}
    >
      {Array.from({ length: segments }).map((_, idx) => (
        <path
          key={idx}
          d={generateSegmentPath(
            idx,
            segments,
            innerRadius,
            outerRadius,
            centerX,
            centerY,
          )}
          fill="currentColor"
          stroke="var(--presentation-background)"
        />
      ))}
    </svg>
  );
}

// Helper to calculate grid position for a cycle item
function getCycleItemGridPosition(
  index: number,
  totalChildren: number,
  isMultiColumn: boolean,
): React.CSSProperties {
  if (!isMultiColumn) {
    return {}; // No grid positioning for single column
  }

  const hasOddItems = totalChildren % 2 !== 0;

  if (hasOddItems && index === 0) {
    // First item in odd-count goes to column 2, row 1
    return { gridColumn: 2, gridRow: 1 };
  }

  // For odd-count: adjust index since first item is special
  // For even-count: use index directly
  const adjustedIndex = hasOddItems ? index - 1 : index;

  // Alternate between column 1 and column 3
  const gridColumn = adjustedIndex % 2 === 0 ? 1 : 3;

  // Calculate row: pairs of items share a row
  // For odd-count: rows start at 2 (row 1 has the first special item)
  // For even-count: rows start at 1
  const rowOffset = hasOddItems ? 2 : 1;
  const gridRow = Math.floor(adjustedIndex / 2) + rowOffset;

  return { gridColumn, gridRow };
}

// Main cycle component with withRef pattern
export const CycleElement = ({
  className,
  ref,
  element,
  ...props
}: StyledPlateElementProps<TCycleItemElement>) => {
  const { alignment = "center" } = element;
  const totalChildren = element.children?.length ?? 0;
  const hasOddItems = totalChildren % 2 !== 0;
  const maxRows = Math.ceil(totalChildren / 2);

  // Get layoutType from the slides state using the editor's id
  const slides = usePresentationState((s) => s.slides);
  const currentSlide = slides.find((s) => s.id === props.editor.id);
  const layoutType = currentSlide?.layoutType;

  // Determine if we should use multi-column layout (only for 'vertical' or no layout)
  const isMultiColumn = layoutType === "vertical" || !layoutType;

  useForceUpdateChildrenOnLengthChange(props.editor, element);

  // Wrap each child with positioned div
  const positionedChildren = React.Children.map(
    props.children,
    (child, index) => {
      const gridStyles = getCycleItemGridPosition(
        index,
        totalChildren,
        isMultiColumn,
      );
      return (
        <div style={gridStyles} className="col-span-1 h-full shrink-0">
          {child}
        </div>
      );
    },
  );

  return (
    <PlateElement
      ref={ref}
      className={cn("relative my-8", className)}
      element={element}
      {...props}
    >
      {/* Container for alignment control */}
      <div
        className={cn(
          "flex w-full",
          // Apply alignment to the container, not the cycle structure
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
      >
        {/* Three-column grid layout for content - always full width */}
        <div
          className={cn(
            "mx-auto grid h-full w-full items-end",
            // Apply multi-column or single-column based on layoutType
            isMultiColumn ? "grid-cols-3 gap-4" : "grid-cols-1 gap-1",
            // Reset grid-rows when single column

            !isMultiColumn && "grid-rows-none!",
          )}
          style={{
            gridTemplateRows: isMultiColumn
              ? `repeat(${maxRows}, minmax(0, min-content))`
              : undefined,
          }}
        >
          {/* Central SVG wheel */}
          <div
            className={cn(
              "relative place-self-center",
              // Size: larger for multi-column, smaller for single column
              isMultiColumn ? "size-70" : "size-50",
              // Apply column start only for multi-column layout
              isMultiColumn && "col-start-2",
              // Apply row positioning only for multi-column layout
              isMultiColumn &&
                (!hasOddItems ? "row-start-1 -row-end-1" : "row-start-2"),
              isMultiColumn && totalChildren >= 5 && "-row-end-1",
            )}
          >
            {(() => {
              const totalSegments = totalChildren;
              const segments = totalSegments > 0 ? totalSegments : 6;
              return <DynamicWheelSVG segments={segments} />;
            })()}
          </div>

          {positionedChildren}
        </div>
      </div>
    </PlateElement>
  );
};
