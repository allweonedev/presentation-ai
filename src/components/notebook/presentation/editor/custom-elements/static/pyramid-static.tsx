import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";

export default function PyramidStatic(props: SlateElementProps) {
  const { alignment = "center" } = props.element as {
    alignment?: "left" | "center" | "right";
  };

  return (
    <SlateElement {...props}>
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
    </SlateElement>
  );
}


