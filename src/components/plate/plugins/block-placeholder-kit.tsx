"use client";

import { KEYS } from "platejs";
import { BlockPlaceholderPlugin } from "platejs/react";

export const BlockPlaceholderKit = [
  BlockPlaceholderPlugin.configure({
    options: {
      className:
        "before:absolute before:cursor-text before:opacity-30 before:content-[attr(placeholder)]",
      placeholders: {
        [KEYS.p]: "Type something...",
        [KEYS.h1]: "Untitled Card",
        [KEYS.h2]: "Untitled Card",
        [KEYS.h3]: "Untitled Card",
        [KEYS.h4]: "Untitled Card",
        [KEYS.h5]: "Untitled Card",
        [KEYS.h6]: "Untitled Card",
      },
      query: ({ path }) => {
        return path.length === 1;
      },
    },
  }),
];
