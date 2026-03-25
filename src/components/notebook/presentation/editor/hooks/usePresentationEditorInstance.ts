"use client";

import { usePlateEditor } from "@/components/plate/hooks/usePlateEditor";
import { type Value } from "platejs";
import { type PlateEditor } from "platejs/react";
import { presentationPlugins } from "../plugins";

interface UsePresentationEditorInstanceArgs {
  initialValue: Value | undefined;
  onReady?: (args: { editor: PlateEditor }) => void;
  id?: string;
}

export function usePresentationEditorInstance({
  initialValue,
  onReady,
  id,
}: UsePresentationEditorInstanceArgs) {
  const editor = usePlateEditor({
    plugins: presentationPlugins,
    value: (initialValue ?? ({} as Value)) as Value,
    onReady,
    override: {
      enabled: {
        history: false,
      },
    },
    id,
  });

  return editor as PlateEditor;
}
