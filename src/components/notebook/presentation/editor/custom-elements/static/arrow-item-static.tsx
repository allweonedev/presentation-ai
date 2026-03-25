import { NodeApi, PathApi } from "platejs";
import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import {
  type TArrowListElement,
  type TArrowListItemElement,
} from "../../plugins/arrow-plugin";
import { getAlignmentClasses } from "../../utils";
import { ArrowChevron } from "../arrow-item";

export function ArrowItemStatic(
  props: SlateElementProps<TArrowListItemElement>,
) {
  const path = props.editor.api.findPath(props.element) ?? [-1];
  const parentPath = PathApi.parent(path);
  const parentElement = NodeApi.get(props.editor, parentPath);
  const { orientation, svgType, showIcon } = parentElement as TArrowListElement;
  const isHorizontal = orientation === "horizontal";
  const { icon } = props.element as unknown as { icon?: string };

  // Get alignment - use item alignment if set, otherwise inherit from parent
  const itemAlignment = props.element.alignment;
  const parentAlignment = (parentElement as TArrowListElement)?.alignment;
  const alignment = itemAlignment ?? parentAlignment ?? "left";

  const contentRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      className={cn(
        "group/arrow-item relative mb-2 ml-4 flex w-full gap-6",
        isHorizontal && "flex-col",
        alignment === "right" && !isHorizontal && "mr-4 ml-0 flex-row-reverse",
        alignment === "center" && "justify-center",
      )}
    >
      {/* Chevron icon column */}
      <div
        className={cn(
          "relative grid place-items-center",
          isHorizontal ? "h-24 w-full" : "h-full w-24",
        )}
      >
        <ArrowChevron
          className={cn(
            "relative z-50 aspect-square overflow-visible",
            isHorizontal ? "top-4 -left-4" : "-top-4",
          )}
          isHorizontal={isHorizontal}
          sizeTargetRef={contentRef}
          svgType={svgType}
          color={
            (parentElement?.color as string) ||
            "var(--presentation-smart-layout)"
          }
          icon={icon ?? "FaHome"}
          showIcon={!!showIcon}
          disabled={true}
        />
      </div>

      {/* Content column */}
      <div ref={contentRef} className={cn("grid w-full")}>
        <SlateElement
          {...props}
          className={cn("w-full", getAlignmentClasses(alignment))}
        >
          {props.children}
        </SlateElement>
      </div>
    </div>
  );
}


