"use client";

import { extractFontsFromEditor } from "@/components/plate/utils/extractFontsFromEditor";
import { type PlateEditor } from "platejs/react";
import { useCallback, useState } from "react";

export function useEditorFonts() {
  const [fontsToLoad, setFontsToLoad] = useState<string[]>([]);

  const onEditorReady = useCallback(
    (editor: PlateEditor, overrides: Array<string | undefined>) => {
      const fonts = extractFontsFromEditor(editor);
      const validOverrides = (overrides.filter(Boolean) as string[]) ?? [];
      setFontsToLoad(Array.from(new Set([...fonts, ...validOverrides])));
    },
    [],
  );

  const updateFontsFromEditor = useCallback((editor: PlateEditor) => {
    const fontsArray = extractFontsFromEditor(editor);
    setFontsToLoad(Array.from(new Set([...fontsArray])));
  }, []);

  return { fontsToLoad, onEditorReady, updateFontsFromEditor };
}
