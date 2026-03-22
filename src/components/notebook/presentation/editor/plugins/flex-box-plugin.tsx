import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import FlexBox from "../custom-elements/flex-box";
import { FLEX_BOX } from "../lib";

export const FlexBoxPlugin = createTPlatePlugin({
  key: FLEX_BOX,
  node: {
    isElement: true,
    type: FLEX_BOX,
    component: FlexBox,
  },
});

export type TFlexBoxElement = TElement & {
  type: typeof FLEX_BOX;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: "sm" | "md" | "lg" | "xl" | "none";
};
