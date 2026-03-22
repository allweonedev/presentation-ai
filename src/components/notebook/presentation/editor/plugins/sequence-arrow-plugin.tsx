import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import SequenceArrow from "../custom-elements/sequence-arrow";
import { SequenceArrowItem } from "../custom-elements/sequence-arrow-item";
import { SEQUENCE_ARROW_GROUP, SEQUENCE_ARROW_ITEM } from "../lib";

export const SequenceArrowGroupPlugin = createTPlatePlugin({
  key: SEQUENCE_ARROW_GROUP,
  node: {
    isElement: true,
    type: SEQUENCE_ARROW_GROUP,
    component: SequenceArrow,
  },
});

export const SequenceArrowItemPlugin = createTPlatePlugin({
  key: SEQUENCE_ARROW_ITEM,
  node: {
    isElement: true,
    type: SEQUENCE_ARROW_ITEM,
    component: SequenceArrowItem,
  },
});

export type TSequenceArrowGroupElement = TElement & {
  type: typeof SEQUENCE_ARROW_GROUP;
  orientation: "vertical" | "horizontal";
  alignment?: "left" | "center" | "right";
};
export type TSequenceArrowItemElement = TElement & {
  type: typeof SEQUENCE_ARROW_ITEM;
  alignment?: "left" | "center" | "right";
};
