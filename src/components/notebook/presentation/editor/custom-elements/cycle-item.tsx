"use client";

import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { PlateElement, type StyledPlateElementProps } from "platejs/react";
import { type TCycleItemElement } from "../plugins/cycle-plugin";

// CycleItem component for individual items in the cycle
// Grid positioning is now handled by the parent CycleElement
export const CycleItem = (
  props: StyledPlateElementProps<TCycleItemElement>,
) => {
  const index = props.path.at(-1) as number;

  // Get layoutType from the slides state using the editor's id
  const slides = usePresentationState((s) => s.slides);
  const currentSlide = slides.find((s) => s.id === props.editor.id);
  const layoutType = currentSlide?.layoutType;

  console.log(layoutType);
  // Determine if we should use multi-column layout (only for 'vertical' or no layout)
  const isSingleColumn = layoutType !== "vertical";

  // Calculate item color based on index
  const getItemColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-indigo-500",
      "bg-pink-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="group/cycle-item relative mb-6 h-full">
      {/* Drop target indicator lines */}
      {/* Content container with heading */}
      <div
        data-bg-export="true"
        className={cn(
          "h-full rounded-md border bg-(--presentation-card-background) p-6",
          // Use flex-row for multi-column (vertical) layout
          isSingleColumn && "flex flex-row items-start gap-4",
        )}
      >
        {/* Heading with number */}
        <div
          data-decor="true"
          className={cn("flex items-center", !isSingleColumn && "mb-3")}
        >
          <div
            className={cn(
              "text-(presentation-body) flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-semibold",
              !isSingleColumn && "mr-3",
              getItemColor(),
            )}
          >
            {index + 1}
          </div>
        </div>

        {/* Content area */}
        <PlateElement
          className={cn(!isSingleColumn && "mt-2", "flex-1")}
          {...props}
        >
          {props.children}
        </PlateElement>
      </div>
    </div>
  );
};
