import { cn } from "@/lib/utils";
import { SlateElement, type SlateElementProps } from "platejs/static";

export default function ProsConsGroupStatic(props: SlateElementProps) {
  const { alignment = "center" } = props.element as {
    alignment?: "left" | "center" | "right";
  };

  return (
    <SlateElement {...props}>
      <div
        className={cn(
          "mb-4 grid items-stretch gap-6 md:grid-cols-2",
          // Only apply horizontal alignment, don't break the grid layout
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
      >
        {props.children}
      </div>
    </SlateElement>
  );
}


