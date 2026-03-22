import { cn } from "@/lib/utils";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { columnSizeVariant } from "../../utils";

export default function StatsGroupStatic(props: SlateElementProps) {
  const { columnSize = "sm" } = props.element as {
    columnSize?: "sm" | "md" | "lg" | "xl";
    alignment?: "left" | "center" | "right";
  };

  return (
    <SlateElement {...props} className="mb-4">
      <div className={cn("max-w-full", columnSizeVariant({ columnSize }))}>
        {props.children}
      </div>
    </SlateElement>
  );
}


