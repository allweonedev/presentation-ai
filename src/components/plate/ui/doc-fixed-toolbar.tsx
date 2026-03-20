"use client";

import "platejs";

import {
  ArrowUpToLineIcon,
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  ItalicIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  UnderlineIcon,
  WandSparklesIcon,
} from "lucide-react";
import { KEYS } from "platejs";
import { useEditorReadOnly } from "platejs/react";

import { cn } from "@/lib/utils";
import { useNotesState } from "@/states/notes-state";
import { useState } from "react";
import { AIToolbarButton } from "./ai-toolbar-button";
import { AlignToolbarButton } from "./align-toolbar-button";
import { CommentToolbarButton } from "./comment-toolbar-button";
import { EmojiToolbarButton } from "./emoji-toolbar-button";
import { ExportToolbarButton } from "./export-toolbar-button";
import { FontColorToolbarButton } from "./font-color-toolbar-button";
import { FontSizeToolbarButton } from "./font-size-toolbar-button";
import { RedoToolbarButton, UndoToolbarButton } from "./history-toolbar-button";
import { ImportToolbarButton } from "./import-toolbar-button";
import {
  IndentToolbarButton,
  OutdentToolbarButton,
} from "./indent-toolbar-button";
import { InsertToolbarButton } from "./insert-toolbar-button";
import { LineHeightToolbarButton } from "./line-height-toolbar-button";
import { LinkToolbarButton } from "./link-toolbar-button";
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
  TodoListToolbarButton,
} from "./list-toolbar-button";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { MediaToolbarButton } from "./media-toolbar-button";
import { ModeToolbarButton } from "./mode-toolbar-button";
import { MoreToolbarButton } from "./more-toolbar-button";
import { TableToolbarButton } from "./table-toolbar-button";
import { TextToDiagramToolbarButton } from "./text-to-diagram-toolbar-button";
import { ToggleToolbarButton } from "./toggle-toolbar-button";
import { SuggestionToolbarButton } from "./suggestion-toolbar-button";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "./toolbar";
import { TurnIntoToolbarButton } from "./turn-into-toolbar-button";

type DocTab = "Home" | "Insert" | "Format" | "View";

const DOC_TABS: DocTab[] = ["Home", "Insert", "Format", "View"];

/**
 * Google Docs-style fixed toolbar for the doc editor.
 *
 * **Row 1**: Clickable tab labels (File, Home, Insert, Format, Review, View).
 * The underlined/active tab controls which icon row is visible.
 *
 * **Row 2**: Context-dependent icon row based on the selected tab.
 */
export function DocFixedToolbar() {
  const readOnly = useEditorReadOnly();
  const isGenerating = useNotesState((state) => state.isGenerating);
  const [activeTab, setActiveTab] = useState<DocTab>("Home");
  const shouldHideToolbarActions = readOnly && !isGenerating;
  const isToolbarInteractionDisabled = isGenerating;

  return (
    <div
      className={cn(
        "fixed-toolbar sticky top-0 left-0 z-50 flex w-full flex-col border-b border-border",
        "bg-background/95 backdrop-blur-xs supports-backdrop-blur:bg-background/60",
      )}
    >
      {/* Row 1 — Menu tabs */}
      <div
        aria-disabled={isToolbarInteractionDisabled}
        className={cn(
          "flex items-center gap-0.5 border-b border-border/50 px-3",
          isToolbarInteractionDisabled && "pointer-events-none opacity-50",
        )}
      >
        {DOC_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "cursor-pointer rounded-t-sm px-3 py-1.5 text-xs font-medium transition-colors",
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Row 2 — Tab-specific toolbar icons */}
      {!shouldHideToolbarActions && (
        <Toolbar
          aria-disabled={isToolbarInteractionDisabled}
          className={cn(
            "scrollbar-hide flex items-center overflow-x-auto px-2 py-0.5",
            isToolbarInteractionDisabled && "pointer-events-none opacity-50",
          )}
        >
          {activeTab === "Home" && (
            <>
              {/* Undo / Redo */}
              <ToolbarGroup className="gap-0">
                <UndoToolbarButton />
                <RedoToolbarButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              {/* Text marks */}
              <ToolbarGroup className="gap-0">
                <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
                  <BoldIcon />
                </MarkToolbarButton>
                <MarkToolbarButton
                  nodeType={KEYS.italic}
                  tooltip="Italic (⌘+I)"
                >
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
                <MarkToolbarButton nodeType={KEYS.code} tooltip="Code (⌘+E)">
                  <Code2Icon />
                </MarkToolbarButton>
                <LinkToolbarButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              {/* Font color */}
              <ToolbarGroup className="gap-0">
                <FontColorToolbarButton
                  nodeType={KEYS.color}
                  tooltip="Text color"
                >
                  <BaselineIcon />
                </FontColorToolbarButton>
                <FontColorToolbarButton
                  nodeType={KEYS.backgroundColor}
                  tooltip="Background color"
                >
                  <PaintBucketIcon />
                </FontColorToolbarButton>
              </ToolbarGroup>

              <ToolbarSeparator />

              {/* Heading / Font size */}
              <ToolbarGroup className="gap-0">
                <TurnIntoToolbarButton />
                <FontSizeToolbarButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              {/* Alignment */}
              <ToolbarGroup className="gap-0">
                <AlignToolbarButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              {/* Lists */}
              <ToolbarGroup className="gap-0">
                <NumberedListToolbarButton />
                <BulletedListToolbarButton />
                <TodoListToolbarButton />
                <ToggleToolbarButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              {/* Indent */}
              <ToolbarGroup className="gap-0">
                <OutdentToolbarButton />
                <IndentToolbarButton />
                <LineHeightToolbarButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup className="gap-0">
                <CommentToolbarButton />
                <SuggestionToolbarButton />
              </ToolbarGroup>
            </>
          )}

          {activeTab === "Insert" && (
            <>
              <ToolbarGroup className="gap-0">
                <InsertToolbarButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup className="gap-0">
                <TableToolbarButton />
                <EmojiToolbarButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup className="gap-0">
                <MediaToolbarButton nodeType={KEYS.img} />
                <MediaToolbarButton nodeType={KEYS.video} />
                <MediaToolbarButton nodeType={KEYS.audio} />
                <MediaToolbarButton nodeType={KEYS.file} />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup className="gap-0">
                <LinkToolbarButton />
              </ToolbarGroup>
            </>
          )}

          {activeTab === "Format" && (
            <>
              <ToolbarGroup className="gap-0">
                <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
                  <BoldIcon />
                </MarkToolbarButton>
                <MarkToolbarButton
                  nodeType={KEYS.italic}
                  tooltip="Italic (⌘+I)"
                >
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
                <MarkToolbarButton nodeType={KEYS.code} tooltip="Code (⌘+E)">
                  <Code2Icon />
                </MarkToolbarButton>
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup className="gap-0">
                <FontColorToolbarButton
                  nodeType={KEYS.color}
                  tooltip="Text color"
                >
                  <BaselineIcon />
                </FontColorToolbarButton>
                <FontColorToolbarButton
                  nodeType={KEYS.backgroundColor}
                  tooltip="Background color"
                >
                  <PaintBucketIcon />
                </FontColorToolbarButton>
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup className="gap-0">
                <AlignToolbarButton />
                <LineHeightToolbarButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup className="gap-0">
                <NumberedListToolbarButton />
                <BulletedListToolbarButton />
                <TodoListToolbarButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup className="gap-0">
                <OutdentToolbarButton />
                <IndentToolbarButton />
              </ToolbarGroup>
            </>
          )}

          {activeTab === "View" && (
            <>
              <ToolbarGroup className="gap-0">
                <ModeToolbarButton />
              </ToolbarGroup>

              <ToolbarSeparator />

              <ToolbarGroup className="gap-0">
                <MoreToolbarButton />
              </ToolbarGroup>
            </>
          )}

          <ToolbarGroup className="gap-0">
            <AIToolbarButton tooltip="AI commands">
              <WandSparklesIcon />
            </AIToolbarButton>
            <TextToDiagramToolbarButton />
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup className="gap-0">
            <ExportToolbarButton>
              <ArrowUpToLineIcon />
            </ExportToolbarButton>
            <ImportToolbarButton />
          </ToolbarGroup>
        </Toolbar>
      )}
    </div>
  );
}
