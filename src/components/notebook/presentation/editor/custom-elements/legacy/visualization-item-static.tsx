import type * as React from "react";

import { type TElement, NodeApi, PathApi } from "platejs";
import { type SlateElementProps } from "platejs/static";

import { ARROW_LIST_ITEM, PYRAMID_ITEM, TIMELINE_ITEM } from "../../lib";
import { type TArrowListItemElement } from "../../plugins/arrow-plugin";
import { ArrowItemStatic } from "../static/arrow-item-static";
import { PyramidItemStatic } from "../static/pyramid-item-static";
import { TimelineItemStatic } from "../static/timeline-item-static";
export default function VisualizationItemElementStatic({
  element,
  ...props
}: SlateElementProps) {
  const parentPath = PathApi.parent(props.path);
  const parentElement = NodeApi.get(props.editor, parentPath);

  const visualizationType = parentElement?.visualizationType as
    | "arrow"
    | "pyramid"
    | "timeline";

  switch (visualizationType) {
    case "pyramid": {
      const pyramidItemElement = {
        ...element,
        children: element.children,
        type: PYRAMID_ITEM,
      };
      return (
        <PyramidItemStatic element={pyramidItemElement as TElement} {...props}>
          {props.children as React.ReactNode}
        </PyramidItemStatic>
      );
    }
    case "arrow": {
      const arrowItemElement = {
        ...element,
        children: element.children,
        type: ARROW_LIST_ITEM,
      };
      return (
        <ArrowItemStatic
          element={arrowItemElement as TArrowListItemElement}
          {...props}
        >
          {props.children as React.ReactNode}
        </ArrowItemStatic>
      );
    }
    case "timeline": {
      const timelineItemElement = {
        ...element,
        children: element.children,
        type: TIMELINE_ITEM,
      };
      return (
        <TimelineItemStatic
          element={timelineItemElement as TElement}
          {...props}
        >
          {props.children as React.ReactNode}
        </TimelineItemStatic>
      );
    }
  }
}


