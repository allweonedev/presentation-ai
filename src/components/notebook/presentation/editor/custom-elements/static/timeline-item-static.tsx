import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { type SlateElementProps, SlateElement } from "platejs/static";
import { type TTimelineGroupElement } from "../../plugins/timeline-plugin";
import { getAlignmentClasses } from "../../utils";
import {
  circleVariants,
  containerVariants,
  contentVariants,
  lineVariants,
} from "../timeline-item";

export function TimelineItemStatic(props: SlateElementProps) {
  const parentPath = PathApi.parent(
    props.editor.api.findPath(props.element) ?? [-1],
  );
  const parentElement = NodeApi.get(
    props.editor,
    parentPath,
  ) as TTimelineGroupElement;
  const orientation = parentElement.orientation ?? "vertical";
  const sidedness = parentElement.sidedness ?? "single";
  const showLine = parentElement.showLine ?? true;
  const numbered = parentElement.numbered ?? true;
  const index =
    (props.editor.api.findPath(props.element)?.at(-1) as number) ?? 0;
  const itemNumber = index + 1;
  const isEven = itemNumber % 2 === 0;

  const lineClass = lineVariants({ orientation, sidedness, showLine, isEven });
  const alignment = parentElement.alignment ?? "left";
  return (
    //* Container
    <div
      className={cn(
        containerVariants({
          orientation,
          sidedness,
          isEven,
          showLine,
          alignment,
        }),
        sidedness === "single" &&
          alignment === "left" &&
          orientation === "horizontal" &&
          "flex-col",
        sidedness === "single" &&
          alignment === "right" &&
          orientation === "horizontal" &&
          "flex-col-reverse",
        sidedness === "single" &&
          alignment === "left" &&
          orientation === "vertical" &&
          "flex-row",
        sidedness === "single" &&
          alignment === "right" &&
          orientation === "vertical" &&
          "flex-row-reverse",
      )}
    >
      {/* Circle */}
      <div
        className={cn(
          circleVariants({ orientation, sidedness }),
          lineClass,
          sidedness === "single" && alignment === "right" && "rotate-180",
        )}
        style={
          {
            backgroundColor:
              (parentElement.color as string) ||
              "var(--presentation-smart-layout)",
            color: "var(--presentation-background)",
            "--ring-color":
              (parentElement.color as string) ||
              "var(--presentation-smart-layout)",
            "--before-bg":
              (parentElement.color as string) ||
              "var(--presentation-smart-layout)",
          } as React.CSSProperties & {
            "--ring-color": string;
            "--before-bg": string;
          }
        }
      >
        <span
          className={cn(
            sidedness === "single" && alignment === "right" && "rotate-180",
          )}
        >
          {numbered ? itemNumber : ""}
        </span>
      </div>
      {/* Content */}
      <SlateElement
        className={cn(
          "max-w-full",
          contentVariants({ orientation, sidedness }),
          getAlignmentClasses(alignment),
        )}
        {...props}
      >
        {props.children}
      </SlateElement>
    </div>
  );
}


