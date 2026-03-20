"use client";

import ColorPicker from "@/components/ui/color-picker";
import { KEYS } from "platejs";
import { useEditorRef, useEditorSelector } from "platejs/react";

import { ToolbarButton } from "./toolbar";

export function FontColorPickerToolbarButton() {
  const editor = useEditorRef();

  const color = useEditorSelector(
    (editor) => (editor.api.mark(KEYS.color) as string) ?? "#000000",
    [],
  );

  const handleColorChange = (newColor: string) => {
    if (editor.selection) {
      editor.tf.select(editor.selection);
      editor.tf.focus();
      editor.tf.addMarks({ [KEYS.color]: newColor });
    }
  };

  return (
    <ColorPicker value={color} onChange={handleColorChange}>
      <ToolbarButton tooltip="Font color">
        <div
          className="h-5 w-5 rounded border border-border"
          style={{ backgroundColor: color }}
        />
      </ToolbarButton>
    </ColorPicker>
  );
}
