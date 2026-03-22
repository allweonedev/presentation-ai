"use client";

import { SuggestionPlugin } from "@platejs/suggestion/react";
import { PencilLineIcon } from "lucide-react";
import { useEditorPlugin, usePluginOption } from "platejs/react";

import { discussionPlugin } from "@/components/plate/plugins/discussion-kit";
import { cn } from "@/lib/utils";

import { ToolbarButton } from "./toolbar";

export function SuggestionToolbarButton() {
  const { setOption } = useEditorPlugin(SuggestionPlugin);
  const currentUserId = usePluginOption(discussionPlugin, "currentUserId");
  const isSuggesting = usePluginOption(SuggestionPlugin, "isSuggesting");
  const isDisabled = !currentUserId;

  return (
    <ToolbarButton
      className={cn(isSuggesting && "text-brand/80 hover:text-brand/80")}
      disabled={isDisabled}
      onClick={() => {
        if (isDisabled) {
          return;
        }

        setOption("isSuggesting", !isSuggesting);
      }}
      onMouseDown={(e) => e.preventDefault()}
      tooltip={isSuggesting ? "Turn off suggesting" : "Suggestion edits"}
    >
      <PencilLineIcon />
    </ToolbarButton>
  );
}
