import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";
import { columnSizeVariant } from "../../utils";

export function IconListStatic(props: SlateElementProps) {
  const { columnSize } = props.element as {
    columnSize?: "sm" | "md" | "lg" | "xl";
    alignment?: "left" | "center" | "right";
  };

  return (
    <SlateElement {...props} className={cn("my-6", props.className)}>
      <div
        className={cn(
          "max-w-full",
          columnSizeVariant({ columnSize: columnSize ?? "md" }),
          "gap-6",
        )}
      >
        {props.children}
      </div>
    </SlateElement>
  );
}


