import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import { CycleElement } from "../custom-elements/cycle-element";
import { CycleItem } from "../custom-elements/cycle-item";
import { CYCLE_GROUP, CYCLE_ITEM } from "../lib";

// Create plugin for cycle
export const CyclePlugin = createTPlatePlugin({
  key: CYCLE_GROUP,
  node: {
    isElement: true,
    component: CycleElement,
  },
});

// Create plugin for cycle item
export const CycleItemPlugin = createTPlatePlugin({
  key: CYCLE_ITEM,
  node: {
    isElement: true,
    component: CycleItem,
  },
});

export type TCycleGroupElement = TElement & {
  type: typeof CYCLE_GROUP;
  totalChildren?: number;
  hasOddItems?: boolean;
  alignment?: "left" | "center" | "right";
};
export type TCycleItemElement = TElement & {
  type: typeof CYCLE_ITEM;
  alignment?: "left" | "center" | "right";
};
