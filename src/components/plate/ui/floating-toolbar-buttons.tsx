"use client";

import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
  WandSparklesIcon,
} from "lucide-react";
import { KEYS } from "platejs";
import { useEditorReadOnly } from "platejs/react";

import { AIToolbarButton } from "./ai-toolbar-button";
import { AlignToolbarButton } from "./align-toolbar-button";
import { CommentToolbarButton } from "./comment-toolbar-button";
import { FontColorPickerToolbarButton } from "./font-color-picker-toolbar-button";
import { FontFamilyToolbarButton } from "./font-family-toolbar-button";
import { FontSizeToolbarButton } from "./font-size-toolbar-button";
import { HighlightToolbarButton } from "./highlight-toolbar-button";
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
  TodoListToolbarButton,
} from "./list-toolbar-button";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { TextCaseToolbarButton } from "./text-case-toolbar-button";
import { TextToDiagramToolbarButton } from "./text-to-diagram-toolbar-button";
import { SuggestionToolbarButton } from "./suggestion-toolbar-button";
import { ToolbarGroup } from "./toolbar";
import { TurnIntoToolbarButton } from "./turn-into-toolbar-button";

export function FloatingToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <>
      {!readOnly && (
        <>
          {/* Font Controls Group */}
          <ToolbarGroup>
            <FontFamilyToolbarButton />
            <TurnIntoToolbarButton />
            <FontSizeToolbarButton />
            <FontColorPickerToolbarButton />
            <TextCaseToolbarButton />
          </ToolbarGroup>

          {/* Text Formatting Group */}
          <ToolbarGroup>
            <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
              <BoldIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
              <ItalicIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={KEYS.underline}
              tooltip="Underline (⌘+U)"
            >
              <UnderlineIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={KEYS.strikethrough}
              tooltip="Strikethrough (⌘+⇧+M)"
            >
              <StrikethroughIcon />
            </MarkToolbarButton>
          </ToolbarGroup>

          {/* Lists & Quote Group */}
          <ToolbarGroup>
            <TodoListToolbarButton />
            <BulletedListToolbarButton />
            <NumberedListToolbarButton />
            <HighlightToolbarButton />
            <AlignToolbarButton />
          </ToolbarGroup>

          {/* AI & Actions Group */}
          <ToolbarGroup>
            <AIToolbarButton tooltip="AI commands">
              <WandSparklesIcon />
            </AIToolbarButton>

            <TextToDiagramToolbarButton />
            <CommentToolbarButton />
            <SuggestionToolbarButton />
          </ToolbarGroup>
        </>
      )}
    </>
  );
}
