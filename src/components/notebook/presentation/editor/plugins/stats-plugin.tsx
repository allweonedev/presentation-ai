import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import StatsGroup from "../custom-elements/stats";
import { StatsItem } from "../custom-elements/stats-item";
import { STATS_GROUP, STATS_ITEM } from "../lib";

export const StatsGroupPlugin = createTPlatePlugin({
  key: STATS_GROUP,
  node: {
    isElement: true,
    type: STATS_GROUP,
    component: StatsGroup,
  },
});

export const StatsItemPlugin = createTPlatePlugin({
  key: STATS_ITEM,
  node: {
    isElement: true,
    type: STATS_ITEM,
    component: StatsItem,
  },
});

export type TStatsGroupElement = TElement & {
  type: typeof STATS_GROUP;
  columnSize?: "sm" | "md" | "lg" | "xl";
  statsType?:
    | "plain"
    | "circle"
    | "circle-bold"
    | "star"
    | "bar"
    | "dot-grid"
    | "dot-line";
  color?: string;
  alignment?: "left" | "center" | "right";
};

export type TStatsItemElement = TElement & {
  type: typeof STATS_ITEM;
  stat?: string;
  alignment?: "left" | "center" | "right";
};
