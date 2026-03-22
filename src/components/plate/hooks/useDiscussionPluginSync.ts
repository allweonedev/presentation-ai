"use client";

import {
  type DiscussionUsersMap,
  parseStoredDiscussions,
  type StoredDiscussion,
} from "@/lib/notes/discussions";
import { discussionPlugin } from "@/components/plate/plugins/discussion-kit";
import { suggestionPlugin } from "@/components/plate/plugins/suggestion-kit";
import { useEffect } from "react";
import { type PlateEditor } from "platejs/react";

type UseDiscussionPluginSyncParams = {
  currentUserId?: string;
  discussions?: StoredDiscussion[];
  editor: PlateEditor;
  onDiscussionsChange?: (discussions: StoredDiscussion[]) => void;
  users?: DiscussionUsersMap;
};

export function useDiscussionPluginSync({
  currentUserId,
  discussions,
  editor,
  onDiscussionsChange,
  users,
}: UseDiscussionPluginSyncParams) {
  useEffect(() => {
    editor.setOption(discussionPlugin, "currentUserId", currentUserId ?? "");
    editor.setOption(
      discussionPlugin,
      "discussions",
      parseStoredDiscussions(discussions ?? []),
    );
    editor.setOption(discussionPlugin, "onDiscussionsChange", onDiscussionsChange);
    editor.setOption(discussionPlugin, "users", users ?? {});
    editor.setOption(suggestionPlugin, "currentUserId", currentUserId ?? "");
  }, [currentUserId, discussions, editor, onDiscussionsChange, users]);
}
