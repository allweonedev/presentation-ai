import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TArrowListElement } from "../plugins/arrow-plugin";

export const arrowItemVariants = cva("my-4 mb-8 grid w-full overflow-visible", {
  variants: {
    orientation: {
      vertical: "",
      horizontal: "grid w-full grid-flow-col overflow-visible",
    },
  },
});

export default function ArrowList(props: PlateElementProps<TArrowListElement>) {
  const { element } = props;
  const { orientation, alignment = "center" } = element;

  return (
    <PlateElement {...props}>
      {/* Container for alignment control */}
      <div
        className={cn(
          "flex w-full",
          // Apply alignment to the container, not the arrow list structure
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
      >
        {/* Arrow list structure - always full width */}
        <div
          className={cn(
            arrowItemVariants({
              orientation: orientation,
            }),
            "w-full", // Ensure full width
          )}
        >
          {props.children}
        </div>
      </div>
    </PlateElement>
  );
}
