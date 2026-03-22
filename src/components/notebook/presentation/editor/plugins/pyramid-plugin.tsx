// plugins/pyramid-plugin.ts
import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import Pyramid from "../custom-elements/pyramid";
import { PyramidItem } from "../custom-elements/pyramid-item";
import { PYRAMID_GROUP, PYRAMID_ITEM } from "../lib";

// Create plugin for pyramid group (container)
export const PyramidGroupPlugin = createTPlatePlugin({
  key: PYRAMID_GROUP,
  node: {
    isElement: true,
    component: Pyramid,
  },
  options: {
    totalChildren: 0,
  },
});

// Create plugin for pyramid item
export const PyramidItemPlugin = createTPlatePlugin({
  key: PYRAMID_ITEM,
  node: {
    isElement: true,
    component: PyramidItem,
  },
});

// Type definitions
export interface TPyramidGroupElement extends TElement {
  type: typeof PYRAMID_GROUP;
  totalChildren?: number; // Store the count on the pyramid element
  isFunnel?: boolean;
  alignment?: "left" | "center" | "right";
}

export interface TPyramidItemElement extends TElement {
  type: typeof PYRAMID_ITEM;
  alignment?: "left" | "center" | "right";
}
