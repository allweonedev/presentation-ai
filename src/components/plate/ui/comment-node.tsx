"use client";

import { type TCommentText } from "platejs";
import { type PlateLeafProps } from "platejs/react";

import { getCommentCount } from "@platejs/comment";
import {
  PlateLeaf,
  useEditorPlugin,
  useEditorRef,
  useEditorReadOnly,
  usePluginOption,
} from "platejs/react";

import { commentPlugin } from "@/components/plate/plugins/comment-kit";
import { suggestionPlugin } from "@/components/plate/plugins/suggestion-kit";
import { cn } from "@/lib/utils";

export function CommentLeaf(props: PlateLeafProps<TCommentText>) {
  const { children, leaf } = props;

  const editor = useEditorRef();
  const { api, setOption } = useEditorPlugin(commentPlugin);
  const readOnly = useEditorReadOnly();
  const hoverId = usePluginOption(commentPlugin, "hoverId");
  const activeId = usePluginOption(commentPlugin, "activeId");

  const isOverlapping = getCommentCount(leaf) > 1;
  const currentId = api.comment.nodeId(leaf);
  const isActive = activeId === currentId;
  const isHover = hoverId === currentId;

  return (
    <PlateLeaf
      {...props}
      className={cn(
        "rounded-[3px] bg-amber-200/30 text-inherit no-underline transition-colors duration-200",
        !readOnly && "bg-amber-200/45",
        !readOnly && (isHover || isActive) && "bg-amber-200/65",
        isOverlapping && "outline-solid outline-1 outline-amber-300/50",
        !readOnly && isOverlapping && "bg-amber-200/55 outline-amber-300/70",
        (isHover || isActive) &&
          !readOnly &&
          isOverlapping &&
          "bg-amber-200/75 outline-amber-300",
        !readOnly && currentId && "cursor-pointer",
      )}
      attributes={{
        ...props.attributes,
        onClick: () => {
          if (readOnly || !currentId) {
            return;
          }

          setOption("activeId", currentId);
          setOption("commentingBlock", null);
          editor.setOption(suggestionPlugin, "activeId", null);
        },
        onMouseEnter: () => {
          if (readOnly) {
            return;
          }

          setOption("hoverId", currentId ?? null);
        },
        onMouseLeave: () => setOption("hoverId", null),
      }}
    >
      {children}
    </PlateLeaf>
  );
}
