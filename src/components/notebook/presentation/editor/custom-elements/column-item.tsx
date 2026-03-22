"use client";

import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";
import {
  type TColumnGroupElement,
  type TColumnItemElement,
} from "../plugins/column-plugin";
import { getAlignmentClasses } from "../utils";

export const ColumnItem = (props: PlateElementProps<TColumnItemElement>) => {
  // Get parent element for alignment information
  const parentPath = PathApi.parent(props.path);
  const parentElement = NodeApi.get(
    props.editor,
    parentPath,
  ) as TColumnGroupElement;

  // Get alignment - use item alignment if set, otherwise inherit from parent
  const itemAlignment = props.element.alignment;
  const parentAlignment = parentElement?.alignment;
  const alignment = itemAlignment ?? parentAlignment ?? "center";
  return (
    <PlateElement {...props}>
      <div
        className={cn(
          "flex h-full flex-col gap-2 p-3",
          getAlignmentClasses(alignment),
          "[&_:is(.presentation-heading)]:[-webkit-background-clip:unset!important;]",
          "[&_:is(.presentation-heading)]:[-webkit-text-fill-color:unset!important;]",
          "[&_:is(.presentation-heading)]:[background-clip:unset!important;]",
          "[&_:is(.presentation-heading)]:[background:none!important;]",
          "[&_:is(.presentation-heading)]:text-primary!",
        )}
      >
        {props.children}
      </div>
    </PlateElement>
  );
};
