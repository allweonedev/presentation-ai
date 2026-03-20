import { cn } from "@/lib/utils";
import { SlateElement, type SlateElementProps } from "platejs/static";

export default function SequenceArrowStatic(props: SlateElementProps) {
  const { orientation, alignment = "center" } = props.element as {
    orientation?: "horizontal" | "vertical";
    alignment?: "left" | "center" | "right";
  };
  return (
    <SlateElement {...props} className="my-4">
      {/* Container for alignment control */}
      <div
        className={cn(
          "flex w-full",
          // Apply alignment to the container, not the sequence arrow structure
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
      >
        {/* Sequence arrow structure - always full width */}
        <div
          className={cn(
            "grid w-full gap-1",
            orientation === "horizontal"
              ? "auto-cols-fr grid-flow-col"
              : "grid-flow-row",
            "[&_:is(.presentation-heading)]:[-webkit-background-clip:unset!important;]",
            "[&_:is(.presentation-heading)]:[-webkit-text-fill-color:unset!important;]",
            "[&_:is(.presentation-heading)]:[background-clip:unset!important;]",
            "[&_:is(.presentation-heading)]:[background:none!important;]",
            "[&_:is(.presentation-heading)]:text-primary!",
          )}
        >
          {props.children}
        </div>
      </div>
    </SlateElement>
  );
}


