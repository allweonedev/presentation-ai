"use client";

import { type InfographicOptions } from "@antv/infographic";
import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import { AntvInfographic } from "../custom-elements/antv-infographic";
import { ANTV_INFOGRAPHIC } from "../lib";

export const AntvInfographicPlugin = createTPlatePlugin({
  key: ANTV_INFOGRAPHIC,
  node: {
    isElement: true,
    isVoid: true,
    type: ANTV_INFOGRAPHIC,
    component: AntvInfographic,
  },
});

export type TAntvInfographicElement = TElement & {
  type: typeof ANTV_INFOGRAPHIC;
  syntax: string;
  isLoading: boolean;
  sourceText?: string;
  generationPrompt?: string;
  data?: Partial<InfographicOptions>;
  width?: number | string;
  align?: "center" | "left" | "right";
};
