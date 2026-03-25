"use client";

import { createPlatePlugin } from "platejs/react";

import {
  LayoutFloatingToolbar,
  LayoutFloatingToolbarButtons,
} from "@/components/presentation/floating-toolbar";

export const LayoutFloatingToolbarKit = [
  createPlatePlugin({
    key: "layout-floating-toolbar",
    render: {
      afterEditable: () => (
        <LayoutFloatingToolbar>
          <LayoutFloatingToolbarButtons />
        </LayoutFloatingToolbar>
      ),
    },
  }),
];
