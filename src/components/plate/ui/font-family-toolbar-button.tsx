"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { FontFamilyPlugin } from "@platejs/basic-styles/react";
import dynamic from "next/dynamic";
import { KEYS } from "platejs";
import { useEditorRef, useEditorSelector } from "platejs/react";

// Dynamically import FontPicker with a skeleton loader
const FontPicker = dynamic(
  () => import("@/components/ui/font-picker").then((mod) => mod.FontPicker),
  {
    loading: () => <Skeleton className="h-8 w-full" />,
    ssr: false,
  },
);

// Define a default font to fall back to if no mark is present.
const DEFAULT_FONT_FAMILY = "Open Sans";

export function FontFamilyToolbarButton() {
  const editor = useEditorRef();

  // 1. Get the current font family from the editor's marks.
  //    Provides a default value to ensure it's never undefined.
  const fontFamily = useEditorSelector(
    (editor) =>
      (editor.api.marks()?.[KEYS.fontFamily] as string) ?? DEFAULT_FONT_FAMILY,
    [],
  );

  // 2. Define the function to handle font changes from the picker.
  const handleFontChange = (font: string) => {
    if (!editor || !font) return;

    // Ensure there is a selection to apply the mark to.
    if (!editor.selection) {
      editor.tf.select({
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      });
    }

    // Focus the editor and add the font family mark.
    editor.tf.focus();
    editor.tf.addMark(FontFamilyPlugin.key, font);
  };

  return (
    <div className="min-w-[150px]">
      <FontPicker
        value={handleFontChange}
        defaultValue={fontFamily}
        autoLoad={true}
        selectClassName="border-0 h-9! py-0 bg-transparent shadow-none hover:bg-accent hover:text-accent-foreground"
      />
    </div>
  );
}
