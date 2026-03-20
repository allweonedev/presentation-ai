"use client";

import { type TElement } from "platejs";
import { createTPlatePlugin } from "platejs/react";
import { QuoteElement } from "../custom-elements/quote";
import { QUOTE_ELEMENT } from "../lib";

// Create plugin for quote
export const QuotePlugin = createTPlatePlugin({
  key: QUOTE_ELEMENT,
  node: {
    isElement: true,
    type: QUOTE_ELEMENT,
    component: QuoteElement,
  },
});

export type TQuoteElement = TElement & {
  type: typeof QUOTE_ELEMENT;
  variant: "large" | "sidequote-icon" | "sidequote";
  author?: string;
};
