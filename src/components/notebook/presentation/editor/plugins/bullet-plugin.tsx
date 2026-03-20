import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import { BulletsElement } from "../custom-elements/bullet";
import { BulletItem } from "../custom-elements/bullet-item";
import { BULLET_GROUP, BULLET_ITEM } from "../lib";

// Create plugin for bullets
export const BulletGroupPlugin = createTPlatePlugin({
  key: BULLET_GROUP,
  node: {
    isElement: true,
    type: BULLET_GROUP,
    component: BulletsElement,
  },
});

// Create plugin for bullet item
export const BulletItemPlugin = createTPlatePlugin({
  key: BULLET_ITEM,
  node: {
    isElement: true,
    type: BULLET_ITEM,
    component: BulletItem,
  },
});

export type TBulletGroupElement = TElement & {
  type: typeof BULLET_GROUP;
  columnSize: "sm" | "md" | "lg" | "xl";
  bulletType?: "numbered" | "basic" | "arrow";
  alignment?: "left" | "center" | "right";
};
export type TBulletItemElement = TElement & {
  type: typeof BULLET_ITEM;
  alignment?: "left" | "center" | "right";
};
