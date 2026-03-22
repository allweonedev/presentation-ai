import { cn } from "@/lib/utils";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { type TArrowListElement } from "../../plugins/arrow-plugin";
import { arrowItemVariants } from "../arrow-list";

export default function ArrowListStatic(
  props: SlateElementProps<TArrowListElement>,
) {
  const { element } = props;
  const { orientation, alignment = "center" } = element;

  return (
    <SlateElement {...props}>
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
    </SlateElement>
  );
}


