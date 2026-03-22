import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";

export default function StaircaseStatic(props: SlateElementProps) {
  const { alignment = "center" } = props.element as {
    alignment?: "left" | "center" | "right";
  };

  return (
    <SlateElement {...props}>
      {/* Container for alignment control */}
      <div
        className={cn(
          "my-8 flex w-full",
          // Apply alignment to the container, not the staircase structure
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
      >
        {/* Staircase structure - always full width, vertical flow */}
        <div className="w-full">{props.children}</div>
      </div>
    </SlateElement>
  );
}


