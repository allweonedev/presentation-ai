import { createPlatePlugin } from "platejs/react";
import { ARROW_LIST, ARROW_LIST_ITEM } from "../lib";

import { type TElement } from "platejs";
import { ArrowItem } from "../custom-elements/arrow-item";
import ArrowList from "../custom-elements/arrow-list";
// Create plugin for visualization item
export const ArrowListPlugin = createPlatePlugin({
  key: ARROW_LIST,
  node: {
    isElement: true,
    component: ArrowList,
  },
});

// Create plugin for visualization list
export const ArrowListItemPlugin = createPlatePlugin({
  key: ARROW_LIST_ITEM,
  node: {
    isElement: true,
    component: ArrowItem,
  },
  options: {
    visualizationType: "arrow",
  },
});

export type TArrowListElement = TElement & {
  type: typeof ARROW_LIST;
  orientation: "vertical" | "horizontal";
  columns: number;
  svgType: "arrow" | "pill" | "parallelogram";
  showIcon: boolean;
  alignment?: "left" | "center" | "right";
};

export type TArrowListItemElement = TElement & {
  type: typeof ARROW_LIST_ITEM;
  icon?: string;
  alignment?: "left" | "center" | "right";
};
