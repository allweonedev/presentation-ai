import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import ColumnGroup from "../custom-elements/column";
import { ColumnItem } from "../custom-elements/column-item";
import { COLUMN_GROUP, COLUMN_ITEM } from "../lib";

export const ColumnGroupPlugin = createTPlatePlugin({
  key: COLUMN_GROUP,
  node: {
    isElement: true,
    type: COLUMN_GROUP,
    component: ColumnGroup,
  },
});

export const ColumnItemPlugin = createTPlatePlugin({
  key: COLUMN_ITEM,
  node: {
    isElement: true,
    type: COLUMN_ITEM,
    component: ColumnItem,
  },
});

export type TColumnGroupElement = TElement & {
  type: typeof COLUMN_GROUP;
  columnSize: "sm" | "md" | "lg" | "xl";
  columnType: "outline" | "solid" | "transparent";
  numbered: boolean;
  alignment?: "left" | "center" | "right";
};

export type TColumnItemElement = TElement & {
  type: typeof COLUMN_ITEM;
  alignment?: "left" | "center" | "right";
};
