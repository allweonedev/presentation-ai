import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import { ConsItem } from "../custom-elements/cons-item";
import ProsConsGroup from "../custom-elements/pros-cons";
import { ProsItem } from "../custom-elements/pros-item";
import { CONS_ITEM, PROS_CONS_GROUP, PROS_ITEM } from "../lib";

export const ProsConsGroupPlugin = createTPlatePlugin({
  key: PROS_CONS_GROUP,
  node: {
    isElement: true,
    type: PROS_CONS_GROUP,
    component: ProsConsGroup,
  },
});

export const ProsItemPlugin = createTPlatePlugin({
  key: PROS_ITEM,
  node: {
    isElement: true,
    type: PROS_ITEM,
    component: ProsItem,
  },
});

export const ConsItemPlugin = createTPlatePlugin({
  key: CONS_ITEM,
  node: {
    isElement: true,
    type: CONS_ITEM,
    component: ConsItem,
  },
});

export type TProsConsGroupElement = TElement & {
  type: typeof PROS_CONS_GROUP;
  alignment?: "left" | "center" | "right";
};
export type TProsItemElement = TElement & {
  type: typeof PROS_ITEM;
  alignment?: "left" | "center" | "right";
};
export type TConsItemElement = TElement & {
  type: typeof CONS_ITEM;
  alignment?: "left" | "center" | "right";
};
