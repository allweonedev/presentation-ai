"use client";

import {
  BoldPlugin,
  CodePlugin,
  HighlightPlugin,
  ItalicPlugin,
  KbdPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";

import { CodeLeaf } from "@/components/plate/ui/code-node";
import { HighlightLeaf } from "@/components/plate/ui/highlight-node";
import { KbdLeaf } from "@/components/plate/ui/kbd-node";
import { PresentationLeafElement } from "../custom-elements/presentation-leaf-element";
export const BasicMarksKit = [
  BoldPlugin.withComponent(PresentationLeafElement),
  ItalicPlugin.withComponent(PresentationLeafElement),
  UnderlinePlugin.withComponent(PresentationLeafElement),
  CodePlugin.configure({
    node: { component: CodeLeaf },
    shortcuts: { toggle: { keys: "mod+e" } },
  }),
  StrikethroughPlugin.configure({
    render: { node: PresentationLeafElement },
    shortcuts: { toggle: { keys: "mod+shift+x" } },
  }),
  SubscriptPlugin.configure({
    shortcuts: { toggle: { keys: "mod+comma" } },
  }),
  SuperscriptPlugin.configure({
    shortcuts: { toggle: { keys: "mod+period" } },
  }),
  HighlightPlugin.configure({
    node: { component: HighlightLeaf },
    shortcuts: { toggle: { keys: "mod+shift+h" } },
  }),
  KbdPlugin.withComponent(KbdLeaf),
];
