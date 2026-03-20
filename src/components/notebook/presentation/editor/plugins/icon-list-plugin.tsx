import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import { IconList } from "../custom-elements/icon-list";
import { IconListElement } from "../custom-elements/icon-list-item";
import { ICON_LIST, ICON_LIST_ITEM } from "../lib";

export const IconListPlugin = createTPlatePlugin({
  key: ICON_LIST,
  node: {
    isElement: true,
    type: ICON_LIST,
    component: IconList,
  },
});

export const IconListItemPlugin = createTPlatePlugin({
  key: ICON_LIST_ITEM,
  node: {
    isElement: true,
    type: ICON_LIST_ITEM,
    component: IconListElement,
  },
});

export interface TIconListItemElement extends TElement {
  type: typeof ICON_LIST_ITEM;
  alignment?: "left" | "center" | "right";
  icon?: string;
}
export interface TIconListElement extends TElement {
  type: typeof ICON_LIST;
  alignment?: "left" | "center" | "right";
  columnSize?: "sm" | "md" | "lg" | "xl";
}
