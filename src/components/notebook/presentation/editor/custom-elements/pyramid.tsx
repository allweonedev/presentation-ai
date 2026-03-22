// custom-elements/pyramid.tsx
import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TPyramidGroupElement } from "../plugins/pyramid-plugin";

export default function Pyramid(
  props: PlateElementProps<TPyramidGroupElement>,
) {
  const { alignment = "center" } = props.element;

  return (
    <PlateElement {...props}>
      {/* Container for alignment control */}
      <div
        className={cn(
          "my-4 mb-8 flex w-full",
          // Apply alignment to the container, not the grid
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
      >
        {/* Pyramid grid - always full width */}
        <div className="grid w-full grid-flow-row auto-rows-fr overflow-visible">
          {props.children}
        </div>
      </div>
    </PlateElement>
  );
}
