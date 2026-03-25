import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import CompareGroup from "../custom-elements/compare";
import { CompareSide } from "../custom-elements/compare-side";
import { COMPARE_GROUP, COMPARE_SIDE } from "../lib";

export const CompareGroupPlugin = createTPlatePlugin({
  key: COMPARE_GROUP,
  node: {
    isElement: true,
    type: COMPARE_GROUP,
    component: CompareGroup,
  },
});

export const CompareSidePlugin = createTPlatePlugin({
  key: COMPARE_SIDE,
  node: {
    isElement: true,
    type: COMPARE_SIDE,
    component: CompareSide,
  },
});

export type TCompareGroupElement = TElement & {
  type: typeof COMPARE_GROUP;
  alignment?: "left" | "center" | "right";
};
export type TCompareSideElement = TElement & {
  type: typeof COMPARE_SIDE;
  alignment?: "left" | "center" | "right";
};
