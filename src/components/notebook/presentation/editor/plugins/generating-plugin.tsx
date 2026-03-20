import { createTPlatePlugin } from "platejs/react";
import { GeneratingLeaf } from "../custom-elements/generating-leaf";

/** Enables support for bold formatting */
export const GeneratingPlugin = createTPlatePlugin({
  key: "generating",
  node: { isLeaf: true, component: GeneratingLeaf },
});
