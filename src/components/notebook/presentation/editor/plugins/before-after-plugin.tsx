import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import BeforeAfterGroup from "../custom-elements/before-after";
import { BeforeAfterSide } from "../custom-elements/before-after-side";
import { BEFORE_AFTER_GROUP, BEFORE_AFTER_SIDE } from "../lib";

export const BeforeAfterGroupPlugin = createTPlatePlugin({
  key: BEFORE_AFTER_GROUP,
  node: {
    isElement: true,
    type: BEFORE_AFTER_GROUP,
    component: BeforeAfterGroup,
  },
});

export const BeforeAfterSidePlugin = createTPlatePlugin({
  key: BEFORE_AFTER_SIDE,
  node: {
    isElement: true,
    type: BEFORE_AFTER_SIDE,
    component: BeforeAfterSide,
  },
});

export type TBeforeAfterGroupElement = TElement & {
  type: typeof BEFORE_AFTER_GROUP;
  alignment?: "left" | "center" | "right";
};
export type TBeforeAfterSideElement = TElement & {
  type: typeof BEFORE_AFTER_SIDE;
  alignment?: "left" | "center" | "right";
};
