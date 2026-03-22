import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import { Icon } from "../custom-elements/icon";
import { ICON_ELEMENT } from "../lib";

// Create plugin for d item
export const IconPlugin = createTPlatePlugin({
  key: ICON_ELEMENT,
  node: {
    isElement: true,
    component: Icon,
  },
  options: {
    query: "",
    name: "",
  },
});

export interface TIconElement extends TElement {
  type: typeof ICON_ELEMENT;
  alignment?: "left" | "center" | "right";
  query: string;
  name: string;
}
