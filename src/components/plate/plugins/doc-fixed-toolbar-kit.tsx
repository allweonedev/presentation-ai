"use client";

import { createPlatePlugin } from "platejs/react";

import { DocFixedToolbar } from "@/components/plate/ui/doc-fixed-toolbar";

export const DocFixedToolbarKit = [
  createPlatePlugin({
    key: "doc-fixed-toolbar",
    render: {
      beforeContainer: () => <DocFixedToolbar />,
    },
  }),
];
