// Main visualization item component with withRef pattern
"use client";

import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { type StyledPlateElementProps } from "platejs/react";
import { ARROW_LIST_ITEM, PYRAMID_ITEM, TIMELINE_ITEM } from "../../lib";
import { type TArrowListItemElement } from "../../plugins/arrow-plugin";
import { type TVisualizationListElement } from "../../plugins/legacy/visualization-list-plugin";
import { type TPyramidItemElement } from "../../plugins/pyramid-plugin";
import { ArrowItem } from "../arrow-item";
import { PyramidItem } from "../pyramid-item";
import { TimelineItem } from "../timeline-item";

export const VisualizationItemElement = ({
  element,
  children,
  className,
  ref,
  ...props
}: StyledPlateElementProps<TVisualizationListElement>) => {
  const parentPath = PathApi.parent(props.path);
  const parentElement = NodeApi.get(
    props.editor,
    parentPath,
  ) as TVisualizationListElement;

  const visualizationType = parentElement.visualizationType as
    | "arrow"
    | "pyramid"
    | "timeline";

  switch (visualizationType) {
    case "pyramid":
      const pyramidItemElement = {
        ...element,
        children: element.children,
        type: PYRAMID_ITEM,
      };

      return (
        <PyramidItem
          ref={ref}
          element={pyramidItemElement as TPyramidItemElement}
          className={cn(className)}
          {...props}
        >
          {children}
        </PyramidItem>
      );

    case "arrow":
      const arrowItemElement = {
        ...element,
        children: element.children,
        type: ARROW_LIST_ITEM,
      };

      return (
        <ArrowItem
          ref={ref}
          element={arrowItemElement as TArrowListItemElement}
          {...props}
        >
          {children}
        </ArrowItem>
      );

    case "timeline":
      const timelineItemElement = {
        ...element,
        children: element.children,
        type: TIMELINE_ITEM,
      };

      return (
        <TimelineItem ref={ref} element={timelineItemElement} {...props}>
          {children}
        </TimelineItem>
      );
  }
};
