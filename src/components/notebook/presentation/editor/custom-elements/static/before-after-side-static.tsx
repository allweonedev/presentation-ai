import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { getAlignmentClasses } from "../../utils";

export function BeforeAfterSideStatic(props: SlateElementProps) {
  const path = props.editor.api.findPath(props.element) ?? [-1];
  const parentPath = PathApi.parent(path);
  const parentElement = NodeApi.get(props.editor, parentPath);

  const { alignment = "center" } = parentElement as {
    alignment?: "left" | "center" | "right";
    color?: string;
  };
  const index = path.at(-1) ?? 0;

  // First child (index 0) goes to column 1, second child (index 1) goes to column 3
  const gridColumn = index === 0 ? 1 : 3;

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


