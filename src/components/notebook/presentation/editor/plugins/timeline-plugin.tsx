import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import Timeline from "../custom-elements/timeline";
import { TimelineItem } from "../custom-elements/timeline-item";
import { TIMELINE_GROUP, TIMELINE_ITEM } from "../lib";

export const TimelinePlugin = createTPlatePlugin({
  key: TIMELINE_GROUP,
  node: {
    component: Timeline,
    type: TIMELINE_GROUP,
    isElement: true,
    isContainer: true,
  },
  options: {
    orientation: "vertical",
    sidedness: "single",
    numbered: true,
    showLine: true,
  },
});
export const TimelineItemPlugin = createTPlatePlugin({
  key: TIMELINE_ITEM,
  node: {
    component: TimelineItem,
    type: TIMELINE_ITEM,
    isElement: true,
    isContainer: true,
  },
});
export interface TTimelineGroupElement extends TElement {
  type: typeof TIMELINE_GROUP;
  orientation: "vertical" | "horizontal";
  sidedness: "single" | "double";
  numbered: boolean;
  showLine: boolean;
  alignment?: "left" | "center" | "right";
}

export interface TTimelineItemElement extends TElement {
  type: typeof TIMELINE_ITEM;
  alignment?: "left" | "center" | "right";
}
