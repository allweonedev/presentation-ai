import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import { VisualizationItemElement } from "../../custom-elements/legacy/visualization-item";
import { VisualizationListElement } from "../../custom-elements/legacy/visualization-list";

export const VISUALIZATION_LIST = "visualization-list";
export const VISUALIZATION_LIST_ITEM = "visualization-item";
export const VisualizationListPlugin = createTPlatePlugin({
  key: VISUALIZATION_LIST,
  node: {
    isElement: true,
    type: VISUALIZATION_LIST,
    component: VisualizationListElement,
  },
  options: {
    visualizationType: "arrow",
  },
});

// Create plugin for visualization item
export const VisualizationItemPlugin = createTPlatePlugin({
  key: VISUALIZATION_LIST_ITEM,
  node: {
    isElement: true,
    type: VISUALIZATION_LIST_ITEM,
    component: VisualizationItemElement,
  },
});
export interface TVisualizationListElement extends TElement {
  type: typeof VISUALIZATION_LIST;
  visualizationType: "arrow" | "pyramid" | "timeline";
  totalChildren: number;
}

export interface TVisualizationListItemElement extends TElement {
  type: typeof VISUALIZATION_LIST_ITEM;
}
