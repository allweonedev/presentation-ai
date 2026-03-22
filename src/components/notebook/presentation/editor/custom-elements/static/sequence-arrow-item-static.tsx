import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { type TSequenceArrowGroupElement } from "../../plugins/sequence-arrow-plugin";
import { getAlignmentClasses } from "../../utils";

export function SequenceArrowItemStatic(props: SlateElementProps) {
  const path = props.editor.api.findPath(props.element) ?? [-1];
  const parentPath = PathApi.parent(path);
  const parent = NodeApi.get(
    props.editor,
    parentPath,
  ) as TSequenceArrowGroupElement;
  const index = (path?.at(-1) as number) ?? 0;
  const total = parent?.children?.length ?? 0;
  const isLast = index === total - 1;

  const { orientation = "vertical" } = parent;
  const triangleColor =
    (parent.color as string) ||
    "var(--presentation-card-background, var(--presentation-primary))";

  return (
    <div
      className={cn(
        "relative h-full w-full flex-1",
        orientation === "horizontal" && "flex items-stretch",
      )}
      style={{ pointerEvents: "none" }}
    >
      <div
        className={cn(
          "rounded-xl p-6 shadow-lg",
          orientation === "horizontal" && "flex-1",
        )}
        data-bg-export="true"
        style={{
          backgroundColor: triangleColor,
          color: "var(--presentation-background)",
        }}
      >
        <SlateElement
          {...props}
          className={cn(getAlignmentClasses(parent.alignment))}
        >
          {props.children}
        </SlateElement>
      </div>

      {!isLast && orientation === "vertical" && (
        <div
          className={cn("mx-auto h-0 w-0")}
          style={{
            borderLeft: "13px solid transparent",
            borderRight: "13px solid transparent",
            borderTop: `19px solid ${triangleColor}`,
            filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.08))",
          }}
        />
      )}

      {!isLast && orientation === "horizontal" && (
        <div
          className={cn("my-auto h-0 w-0")}
          style={{
            borderTop: "13px solid transparent",
            borderBottom: "13px solid transparent",
            borderLeft: `19px solid ${triangleColor}`,
            filter: "drop-shadow(6px 0 8px rgba(0,0,0,0.08))",
          }}
        />
      )}
    </div>
  );
}


