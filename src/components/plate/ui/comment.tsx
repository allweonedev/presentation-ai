"use client";

import * as React from "react";

import { type CreatePlateEditorOptions } from "platejs/react";

import { getCommentKey, getDraftCommentKey } from "@platejs/comment";
import { CommentPlugin, useCommentId } from "@platejs/comment/react";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
} from "date-fns";
import {
  ArrowUpIcon,
  CheckIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import {
  type NodeEntry,
  type TCommentText,
  type Value,
  KEYS,
  nanoid,
  NodeApi,
} from "platejs";
import {
  Plate,
  useEditorPlugin,
  useEditorRef,
  usePlateEditor,
  usePluginOption,
} from "platejs/react";

import { BasicMarksKit } from "@/components/plate/plugins/basic-marks-kit";
import { type DiscussionUser } from "@/lib/notes/discussions";
import {
  type TDiscussion,
  discussionPlugin,
  updateDiscussionState,
} from "@/components/plate/plugins/discussion-kit";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { Editor, EditorContainer } from "./editor";

export type TComment = {
  id: string;
  contentRich: Value;
  createdAt: Date | string;
  discussionId: string;
  isEdited: boolean;
  updatedAt?: Date | string;
  user?: DiscussionUser;
  userId: string;
};

export function Comment(props: {
  comment: TComment;
  discussionLength: number;
  editingId: string | null;
  index: number;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  documentContent?: string;
  showDocumentContent?: boolean;
  onEditorClick?: () => void;
}) {
  const {
    comment,
    discussionLength,
    documentContent,
    editingId,
    index,
    setEditingId,
    showDocumentContent = false,
    onEditorClick,
  } = props;

  const editor = useEditorRef();
  const userInfo = usePluginOption(discussionPlugin, "user", comment.userId);
  const currentUserId = usePluginOption(discussionPlugin, "currentUserId");
  const resolveDiscussion = async (id: string) => {
    const updatedDiscussions = editor
      .getOption(discussionPlugin, "discussions")
      .map((discussion) => {
        if (discussion.id === id) {
          return { ...discussion, isResolved: true };
        }
        return discussion;
      });
    updateDiscussionState(editor, updatedDiscussions);
  };

  const removeDiscussion = async (id: string) => {
    const updatedDiscussions = editor
      .getOption(discussionPlugin, "discussions")
      .filter((discussion) => discussion.id !== id);
    updateDiscussionState(editor, updatedDiscussions);
  };

  const updateComment = async (input: {
    id: string;
    contentRich: Value;
    discussionId: string;
  }) => {
    const updatedDiscussions = editor
      .getOption(discussionPlugin, "discussions")
      .map((discussion) => {
        if (discussion.id === input.discussionId) {
          const updatedComments = discussion.comments.map((comment) => {
            if (comment.id === input.id) {
              return {
                ...comment,
                contentRich: input.contentRich,
                isEdited: true,
                updatedAt: new Date(),
              };
            }
            return comment;
          });
          return { ...discussion, comments: updatedComments };
        }
        return discussion;
      });
    updateDiscussionState(editor, updatedDiscussions);
  };

  const { tf } = useEditorPlugin(CommentPlugin);

  const isMyComment = currentUserId === comment.userId;

  const initialValue = comment.contentRich;

  const commentEditor = useCommentEditor(
    {
      id: comment.id,
      value: initialValue,
    },
    [initialValue],
  );

  const onCancel = () => {
    setEditingId(null);
    commentEditor.tf.replaceNodes(initialValue, {
      at: [],
      children: true,
    });
  };

  const onSave = () => {
    void updateComment({
      id: comment.id,
      contentRich: commentEditor.children,
      discussionId: comment.discussionId,
    });
    setEditingId(null);
  };

  const onResolveComment = () => {
    void resolveDiscussion(comment.discussionId);
    tf.comment.unsetMark({ id: comment.discussionId });
  };

  const isFirst = index === 0;
  const isLast = index === discussionLength - 1;
  const isEditing = editingId && editingId === comment.id;

  const [hovering, setHovering] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div
      className={cn(
        "group/comment relative rounded-lg px-1 py-1.5 transition-colors",
        isFirst && "pt-0",
      )}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Thread connector */}
      {!isFirst && !isLast && (
        <div className="absolute top-0 left-[17px] h-full w-px bg-border/60" />
      )}
      {!isFirst && isLast && (
        <div className="absolute top-0 left-[17px] h-4 w-px bg-border/60" />
      )}
      {isFirst && !isLast && (
        <div className="absolute top-8 left-[17px] bottom-0 w-px bg-border/60" />
      )}

      {/* Header row */}
      <div className="relative flex items-center gap-2">
        <Avatar className="size-[22px] shrink-0 ring-1 ring-border/50">
          <AvatarImage
            alt={userInfo?.name ?? undefined}
            src={userInfo?.avatarUrl ?? undefined}
          />
          <AvatarFallback className="text-[10px] font-medium">
            {userInfo?.name?.[0]}
          </AvatarFallback>
        </Avatar>

        <span className="text-[13px] leading-none font-semibold text-foreground/90">
          {userInfo?.name}
        </span>

        <span className="text-[11px] leading-none text-muted-foreground/60">
          {formatCommentDate(new Date(comment.createdAt))}
          {comment.isEdited && (
            <span className="ml-1 italic">(edited)</span>
          )}
        </span>

        {/* Hover actions */}
        {isMyComment && (hovering || dropdownOpen) && (
          <div className="absolute -top-0.5 right-0 flex items-center gap-0.5 rounded-md border border-border/50 bg-popover/95 p-0.5 shadow-xs backdrop-blur-xs">
            {index === 0 && (
              <button
                className="flex size-6 items-center justify-center rounded-[5px] text-muted-foreground transition-colors hover:bg-accent hover:text-emerald-500"
                onClick={onResolveComment}
                title="Resolve"
                type="button"
              >
                <CheckIcon className="size-3.5" />
              </button>
            )}

            <CommentMoreDropdown
              onCloseAutoFocus={() => {
                setTimeout(() => {
                  commentEditor.tf.focus({ edge: "endEditor" });
                }, 0);
              }}
              onRemoveComment={() => {
                if (discussionLength === 1) {
                  tf.comment.unsetMark({ id: comment.discussionId });
                  void removeDiscussion(comment.discussionId);
                }
              }}
              comment={comment}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              setEditingId={setEditingId}
            />
          </div>
        )}
      </div>

      {/* Quoted document content */}
      {isFirst && showDocumentContent && documentContent && (
        <div className="mt-1.5 ml-[30px] flex items-center">
          <div className="w-[2px] shrink-0 self-stretch rounded-full bg-highlight/60" />
          <div
            className="min-w-0 truncate pl-2 text-[12px] leading-none text-muted-foreground/70"
            title={documentContent}
          >
            {documentContent}
          </div>
        </div>
      )}

      {/* Comment body */}
      <div className="mt-0.5 ml-[30px]">
        <Plate readOnly={!isEditing} editor={commentEditor}>
          <EditorContainer
            variant="comment"
            className={cn(
              isEditing &&
                "rounded-lg border-border/60 bg-muted/30",
            )}
          >
            <Editor
              variant="comment"
              className="w-auto grow text-foreground/85"
              onClick={() => onEditorClick?.()}
            />

            {isEditing && (
              <div className="ml-auto flex shrink-0 items-end gap-1 pb-0.5">
                <button
                  className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    void onCancel();
                  }}
                >
                  <XIcon className="size-3.5" />
                </button>

                <button
                  className="flex size-6 items-center justify-center rounded-full bg-brand text-background transition-opacity hover:opacity-90"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    void onSave();
                  }}
                >
                  <CheckIcon className="size-3 stroke-[2.5px]" />
                </button>
              </div>
            )}
          </EditorContainer>
        </Plate>
      </div>
    </div>
  );
}

function CommentMoreDropdown(props: {
  comment: TComment;
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  onCloseAutoFocus?: () => void;
  onRemoveComment?: () => void;
}) {
  const {
    comment,
    dropdownOpen,
    setDropdownOpen,
    setEditingId,
    onCloseAutoFocus,
    onRemoveComment,
  } = props;

  const editor = useEditorRef();

  const selectedEditCommentRef = React.useRef<boolean>(false);

  const onDeleteComment = React.useCallback(() => {
    if (!comment.id)
      return alert("You are operating too quickly, please try again later.");

    const updatedDiscussions = editor
      .getOption(discussionPlugin, "discussions")
      .map((discussion) => {
        if (discussion.id !== comment.discussionId) {
          return discussion;
        }

        const commentIndex = discussion.comments.findIndex(
          (c) => c.id === comment.id,
        );
        if (commentIndex === -1) {
          return discussion;
        }

        return {
          ...discussion,
          comments: [
            ...discussion.comments.slice(0, commentIndex),
            ...discussion.comments.slice(commentIndex + 1),
          ],
        };
      });

    updateDiscussionState(editor, updatedDiscussions);
    onRemoveComment?.();
  }, [comment.discussionId, comment.id, editor, onRemoveComment]);

  const onEditComment = React.useCallback(() => {
    selectedEditCommentRef.current = true;

    if (!comment.id)
      return alert("You are operating too quickly, please try again later.");

    setEditingId(comment.id);
  }, [comment.id, setEditingId]);

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button className="flex size-6 items-center justify-center rounded-[5px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <MoreHorizontalIcon className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40 rounded-lg"
        onCloseAutoFocus={(e) => {
          if (selectedEditCommentRef.current) {
            onCloseAutoFocus?.();
            selectedEditCommentRef.current = false;
          }

          return e.preventDefault();
        }}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onEditComment}>
            <PencilIcon className="size-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={onDeleteComment}
          >
            <TrashIcon className="size-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const useCommentEditor = (
  options: Omit<CreatePlateEditorOptions, "plugins"> = {},
  deps: React.DependencyList = [],
) => {
  const commentEditor = usePlateEditor(
    {
      id: "comment",
      plugins: BasicMarksKit,
      value: [],
      ...options,
    },
    deps,
  );

  return commentEditor;
};

export function CommentCreateForm({
  autoFocus = false,
  className,
  discussionId: discussionIdProp,
  focusOnMount = false,
  variant = "inline",
}: {
  autoFocus?: boolean;
  className?: string;
  discussionId?: string;
  focusOnMount?: boolean;
  variant?: "inline" | "popover";
}) {
  const discussions = usePluginOption(discussionPlugin, "discussions");

  const editor = useEditorRef();
  const commentId = useCommentId();
  const discussionId = discussionIdProp ?? commentId;

  const currentUser = usePluginOption(discussionPlugin, "currentUser");
  const currentUserId = usePluginOption(discussionPlugin, "currentUserId");
  const [commentValue, setCommentValue] = React.useState<Value | undefined>();
  const commentContent = React.useMemo(
    () =>
      commentValue
        ? NodeApi.string({ children: commentValue, type: KEYS.p })
        : "",
    [commentValue],
  );
  const commentEditor = useCommentEditor();

  React.useEffect(() => {
    if (commentEditor && focusOnMount) {
      commentEditor.tf.focus();
    }
  }, [commentEditor, focusOnMount]);

  const onAddComment = React.useCallback(async () => {
    if (!commentValue || !currentUserId) return;

    commentEditor.tf.reset();

    if (discussionId) {
      const discussion = discussions.find((d) => d.id === discussionId);
      if (!discussion) {
        const newDiscussion: TDiscussion = {
          id: discussionId,
          comments: [
            {
              id: nanoid(),
              contentRich: commentValue,
              createdAt: new Date(),
              discussionId,
              isEdited: false,
              user: currentUser,
              userId: currentUserId,
            },
          ],
          createdAt: new Date(),
          isResolved: false,
          user: currentUser,
          userId: currentUserId,
        };

        updateDiscussionState(editor, [
          ...discussions,
          newDiscussion,
        ]);
        return;
      }

      const comment: TComment = {
        id: nanoid(),
        contentRich: commentValue,
        createdAt: new Date(),
        discussionId,
        isEdited: false,
        user: currentUser,
        userId: currentUserId,
      };

      const updatedDiscussion = {
        ...discussion,
        comments: [...discussion.comments, comment],
      };

      const updatedDiscussions = discussions
        .filter((d) => d.id !== discussionId)
        .concat(updatedDiscussion);

      updateDiscussionState(editor, updatedDiscussions);

      return;
    }

    const commentsNodeEntry = editor
      .getApi(CommentPlugin)
      .comment.nodes({ at: [], isDraft: true });

    if (commentsNodeEntry.length === 0) return;

    const documentContent = commentsNodeEntry
      .map(([node, _path]: NodeEntry<TCommentText>) => node.text)
      .join("");

    const _discussionId = nanoid();
    const newDiscussion: TDiscussion = {
      id: _discussionId,
      comments: [
        {
          id: nanoid(),
          contentRich: commentValue,
          createdAt: new Date(),
          discussionId: _discussionId,
          isEdited: false,
          user: currentUser,
          userId: currentUserId,
        },
      ],
      createdAt: new Date(),
      documentContent,
      isResolved: false,
      user: currentUser,
      userId: currentUserId,
    };

    updateDiscussionState(editor, [
      ...discussions,
      newDiscussion,
    ]);

    const id = newDiscussion.id;

    commentsNodeEntry.forEach(([, path]: NodeEntry<TCommentText>) => {
      editor.tf.setNodes(
        {
          [getCommentKey(id)]: true,
        },
        { at: path, split: true },
      );
      editor.tf.unsetNodes([getDraftCommentKey()], { at: path });
    });
  }, [
    commentValue,
    commentEditor.tf,
    currentUser,
    currentUserId,
    discussionId,
    editor,
    discussions,
  ]);

  const hasContent = commentContent.trim().length > 0;

  return (
    <div
      className={cn(
        "w-full",
        variant === "popover" && "space-y-3",
        className,
      )}
    >
      {variant === "popover" && (
        <div className="space-y-2.5">
          <div className="text-[11px] font-semibold tracking-widest text-muted-foreground/70 uppercase">
            Add comment
          </div>
        </div>
      )}

      <div className="flex w-full items-start gap-2">
        <div
          className={cn(
            "shrink-0",
            variant === "popover" ? "mt-1.5" : "mt-1",
          )}
        >
          <Avatar className="size-[22px] ring-1 ring-border/50">
            <AvatarImage
              alt={currentUser?.name ?? undefined}
              src={currentUser?.avatarUrl ?? undefined}
            />
            <AvatarFallback className="text-[10px] font-medium">
              {currentUser?.name?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="relative flex min-w-0 grow">
          <Plate
            onChange={({ value }) => {
              setCommentValue(value);
            }}
            editor={commentEditor}
          >
            <EditorContainer
              variant="comment"
              className={cn(
                variant === "popover" &&
                  "rounded-lg border-border/60 bg-muted/20 shadow-xs transition-colors focus-within:bg-muted/30",
              )}
            >
              <Editor
                variant="comment"
                className={cn(
                  "grow",
                  variant === "popover"
                    ? "min-h-[36px] pr-9 pt-1.5"
                    : "min-h-[24px] pr-7 pt-0.5",
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onAddComment();
                  }
                }}
                placeholder={
                  variant === "popover"
                    ? "Write a comment..."
                    : "Reply..."
                }
                autoComplete="off"
                autoFocus={autoFocus}
              />

              <button
                className={cn(
                  "absolute top-1/2 right-1 flex size-6 -translate-y-1/2 items-center justify-center rounded-full transition-all",
                  hasContent && currentUserId
                    ? "bg-brand text-background shadow-xs hover:opacity-90"
                    : "text-muted-foreground/40",
                )}
                disabled={!currentUserId || !hasContent}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddComment();
                }}
              >
                <ArrowUpIcon className="size-3.5 stroke-[2.5px]" />
              </button>
            </EditorContainer>
          </Plate>
        </div>
      </div>
    </div>
  );
}

export const formatCommentDate = (date: Date) => {
  const now = new Date();
  const diffMinutes = differenceInMinutes(now, date);
  const diffHours = differenceInHours(now, date);
  const diffDays = differenceInDays(now, date);

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  if (diffDays < 2) {
    return `${diffDays}d`;
  }

  return format(date, "MM/dd/yyyy");
};
