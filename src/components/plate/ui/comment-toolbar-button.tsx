"use client";

import { MessageSquareTextIcon } from "lucide-react";
import { useEditorRef, usePluginOption } from "platejs/react";

import { commentPlugin } from "@/components/plate/plugins/comment-kit";
import { discussionPlugin } from "@/components/plate/plugins/discussion-kit";

import { ToolbarButton } from "./toolbar";

export function CommentToolbarButton() {
  const editor = useEditorRef();
  const currentUserId = usePluginOption(discussionPlugin, "currentUserId");
  const isDisabled = !currentUserId;

  return (
    <ToolbarButton
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        if (isDisabled) {
          return;
        }

        editor.getTransforms(commentPlugin).comment.setDraft();
      }}
      data-plate-prevent-overlay
      disabled={isDisabled}
      tooltip="Comment"
    >
      <MessageSquareTextIcon />
    </ToolbarButton>
  );
}
