"use client";

import { type Value, TrailingBlockPlugin } from "platejs";
import { type TPlateEditor, useEditorRef } from "platejs/react";

import { AntvInfographicPluginNotes } from "@/components/notebook/notes/editor/plugins/antv-infographic-plugin-notes";
import { AIKit } from "@/components/plate/plugins/ai-kit";
import { AlignKit } from "@/components/plate/plugins/align-kit";
import { AutoformatKit } from "@/components/plate/plugins/autoformat-kit";
import { BasicBlocksKit } from "@/components/plate/plugins/basic-blocks-kit";
import { BasicMarksKit } from "@/components/plate/plugins/basic-marks-kit";
import { BlockMenuKit } from "@/components/plate/plugins/block-menu-kit";
import { BlockPlaceholderKit } from "@/components/plate/plugins/block-placeholder-kit";
import { CalloutKit } from "@/components/plate/plugins/callout-kit";
import { CodeBlockKit } from "@/components/plate/plugins/code-block-kit";
import { ColumnKit } from "@/components/plate/plugins/column-kit";
import { CommentKit } from "@/components/plate/plugins/comment-kit";
import { NoteBlockPlaceholderKit } from "@/components/plate/plugins/note-block-placeholder-kit";
// import { CopilotKit } from "@/components/plate/plugins/copilot-kit";
import { CursorOverlayKit } from "@/components/plate/plugins/cursor-overlay-kit";
import { DateKit } from "@/components/plate/plugins/date-kit";
import { DiscussionKit } from "@/components/plate/plugins/discussion-kit";
import { DndKit } from "@/components/plate/plugins/dnd-kit";
import { DocFixedToolbarKit } from "@/components/plate/plugins/doc-fixed-toolbar-kit";
import { DocxKit } from "@/components/plate/plugins/docx-kit";
import { EmojiKit } from "@/components/plate/plugins/emoji-kit";
import { ExitBreakKit } from "@/components/plate/plugins/exit-break-kit";
import { FixedToolbarKit } from "@/components/plate/plugins/fixed-toolbar-kit";
import { FloatingToolbarKit } from "@/components/plate/plugins/floating-toolbar-kit";
import { FontKit } from "@/components/plate/plugins/font-kit";
import { LineHeightKit } from "@/components/plate/plugins/line-height-kit";
import { LinkKit } from "@/components/plate/plugins/link-kit";
import { ListKit } from "@/components/plate/plugins/list-kit";
import { MarkdownKit } from "@/components/plate/plugins/markdown-kit";
import { MathKit } from "@/components/plate/plugins/math-kit";
import { MediaKit } from "@/components/plate/plugins/media-kit";
import { MentionKit } from "@/components/plate/plugins/mention-kit";
import { NoteBasicBlocksKit } from "@/components/plate/plugins/note-basic-blocks-kit";
import { SlashKit } from "@/components/plate/plugins/slash-kit";
import { SuggestionKit } from "@/components/plate/plugins/suggestion-kit";
import { TableKit } from "@/components/plate/plugins/table-kit";
import { TocKit } from "@/components/plate/plugins/toc-kit";
import { ToggleKit } from "@/components/plate/plugins/toggle-kit";

export const EditorKit = [
  // ...CopilotKit,
  ...AIKit,

  // Elements
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...ToggleKit,
  ...TocKit,
  ...MediaKit,
  ...CalloutKit,
  ...ColumnKit,
  ...MathKit,
  ...DateKit,
  ...LinkKit,
  ...MentionKit,

  // Marks
  ...BasicMarksKit,
  ...FontKit,

  // Block Style
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,

  // Collaboration
  ...DiscussionKit,
  ...CommentKit,
  ...SuggestionKit,

  // Editing
  ...SlashKit,
  ...AutoformatKit,
  ...CursorOverlayKit,
  ...BlockMenuKit,
  ...DndKit,
  ...EmojiKit,
  ...ExitBreakKit,
  TrailingBlockPlugin,

  // Parsers
  ...DocxKit,
  ...MarkdownKit,

  // UI
  ...BlockPlaceholderKit,
  ...FixedToolbarKit,
  ...FloatingToolbarKit,

  // AntV Infographic
  ...AntvInfographicPluginNotes,
];

/**
 * NoteEditorKit: Notion-style notes editor.
 * No fixed toolbar — editing via floating toolbar only.
 */
export const NoteEditorKit = [
  // ...CopilotKit,
  ...AIKit,

  // Elements
  ...NoteBasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...ToggleKit,
  ...TocKit,
  ...MediaKit,
  ...CalloutKit,
  ...ColumnKit,
  ...MathKit,
  ...DateKit,
  ...LinkKit,
  ...MentionKit,

  // Marks
  ...BasicMarksKit,
  ...FontKit,

  // Block Style
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,

  // Collaboration
  ...DiscussionKit,
  ...CommentKit,
  ...SuggestionKit,

  // Editing
  ...SlashKit,
  ...AutoformatKit,
  ...CursorOverlayKit,
  ...BlockMenuKit,
  ...DndKit,
  ...EmojiKit,
  ...ExitBreakKit,
  TrailingBlockPlugin,

  // Parsers
  ...DocxKit,
  ...MarkdownKit,

  // UI — floating toolbar only, no fixed toolbar
  ...NoteBlockPlaceholderKit,
  ...FloatingToolbarKit,

  // AntV Infographic
  ...AntvInfographicPluginNotes,
];

/**
 * DocEditorKit: Google Docs-style doc editor.
 * Uses the grouped DocFixedToolbar and also keeps floating toolbar
 * for inline selection-based formatting.
 */
export const DocEditorKit = [
  // ...CopilotKit,
  ...AIKit,

  // Elements
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...ToggleKit,
  ...TocKit,
  ...MediaKit,
  ...CalloutKit,
  ...ColumnKit,
  ...MathKit,
  ...DateKit,
  ...LinkKit,
  ...MentionKit,

  // Marks
  ...BasicMarksKit,
  ...FontKit,

  // Block Style
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,

  // Collaboration
  ...DiscussionKit,
  ...CommentKit,
  ...SuggestionKit,

  // Editing
  ...SlashKit,
  ...AutoformatKit,
  ...CursorOverlayKit,
  ...BlockMenuKit,
  ...DndKit,
  ...EmojiKit,
  ...ExitBreakKit,
  TrailingBlockPlugin,

  // Parsers
  ...DocxKit,
  ...MarkdownKit,

  // UI — doc-style grouped fixed toolbar + floating toolbar
  ...BlockPlaceholderKit,
  ...DocFixedToolbarKit,
  ...FloatingToolbarKit,

  // AntV Infographic
  ...AntvInfographicPluginNotes,
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
