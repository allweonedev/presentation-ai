import { cn } from "@/lib/utils";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { columnSizeVariant } from "../../utils";

export default function BoxGroupStatic(props: SlateElementProps) {
  const { columnSize = "sm", boxType = "solid" } = props.element as {
    columnSize?: "sm" | "md" | "lg" | "xl";
    boxType?: string;
    alignment?: "left" | "center" | "right";
  };

  return (
    <SlateElement {...props} className="mb-4">
      <div
        className={cn(
          "max-w-full",
          columnSizeVariant({ columnSize }),
          boxType === "joined" ? "" : "gap-4",
        )}
      >
        {props.children}
      </div>
    </SlateElement>
  );
}


