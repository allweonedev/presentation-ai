import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { getAlignmentClasses } from "../../utils";

export function CompareSideStatic(props: SlateElementProps) {
  const path = props.editor.api.findPath(props.element) ?? [-1];
  const parentPath = PathApi.parent(path);
  const parentElement = NodeApi.get(props.editor, parentPath);

  const { alignment = "center" } = parentElement as {
    alignment?: "left" | "center" | "right";
    color?: string;
  };
  const index = path.at(-1) ?? 0;

  // Calculate grid column position
  // For children: positions 1, 3, 5, 7, etc. (odd positions)
  // For VS elements: positions 2, 4, 6, 8, etc. (even positions)
  const gridColumn = index * 2 + 1;

  return (
    <div
      className={cn("flex w-full flex-col items-center gap-5")}
      style={{ gridColumn }}
    >
      <div
        className={cn(
          "grid w-full rounded-xl border bg-card p-6 shadow-md",
          "border-t-4",
        )}
        style={{
          backgroundColor: "var(--presentation-background)",
          color: "var(--presentation-text)",
          borderColor: "hsl(var(--border))",
          borderTopColor:
            (parentElement?.color as string) || "var(--presentation-primary)",
        }}
      >
        <SlateElement className={cn(getAlignmentClasses(alignment))} {...props}>
          {props.children}
        </SlateElement>
      </div>
    </div>
  );
}


