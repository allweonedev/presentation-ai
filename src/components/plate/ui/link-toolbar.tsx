"use client";

import * as React from "react";

import { type NodeEntry, type TLinkElement } from "platejs";

import {
  type UseVirtualFloatingOptions,
  flip,
  offset,
} from "@platejs/floating";
import { getLinkAttributes } from "@platejs/link";
import {
  type LinkFloatingToolbarState,
  FloatingLinkUrlInput,
  useFloatingLinkEdit,
  useFloatingLinkEditState,
  useFloatingLinkInsert,
  useFloatingLinkInsertState,
} from "@platejs/link/react";
import { cva } from "class-variance-authority";
import { ExternalLink, Link, Text, Unlink } from "lucide-react";
import { KEYS } from "platejs";
import {
  useEditorRef,
  useEditorSelection,
  useFormInputProps,
  usePluginOption,
} from "platejs/react";

import { buttonVariants } from "@/components/plate/ui/button";
import { Separator } from "@/components/plate/ui/separator";

const popoverVariants = cva(
  "z-50 w-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden",
);

const inputVariants = cva(
  "flex h-[28px] w-full rounded-md border-none bg-transparent px-1.5 py-1 text-base placeholder:text-muted-foreground focus-visible:ring-transparent focus-visible:outline-hidden md:text-sm",
);

type FloatingStyle = React.CSSProperties & {
  WebkitUserSelect?: string;
};

const sanitizeFloatingStyle = (style?: FloatingStyle) => {
  if (!style) return undefined;

  const sanitizedStyle = { ...style };
  const userSelect = sanitizedStyle.WebkitUserSelect as unknown;
  if (typeof userSelect === "string" && userSelect === "-moz-none") {
    delete sanitizedStyle.WebkitUserSelect;
  }

  return sanitizedStyle;
};

export function LinkFloatingToolbar({
  state,
}: {
  state?: LinkFloatingToolbarState;
}) {
  const activeCommentId = usePluginOption({ key: KEYS.comment }, "activeId");
  const activeSuggestionId = usePluginOption(
    { key: KEYS.suggestion },
    "activeId",
  );

  const floatingOptions: UseVirtualFloatingOptions = React.useMemo(
    () => ({
      middleware: [
        offset(8),
        flip({
          fallbackPlacements: ["bottom-end", "top-start", "top-end"],
          padding: 12,
        }),
      ],
      placement:
        activeSuggestionId || activeCommentId ? "top-start" : "bottom-start",
    }),
    [activeCommentId, activeSuggestionId],
  );

  const insertState = useFloatingLinkInsertState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });
  const {
    hidden,
    props: insertProps,
    ref: insertRef,
    textInputProps,
  } = useFloatingLinkInsert(insertState);

  const editState = useFloatingLinkEditState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });
  const {
    editButtonProps,
    props: editProps,
    ref: editRef,
    unlinkButtonProps,
  } = useFloatingLinkEdit(editState);
  const inputProps = useFormInputProps({
    preventDefaultOnEnterKeydown: true,
  });

  const { style: insertStyle, ...insertRestProps } = insertProps;
  const { style: editStyle, ...editRestProps } = editProps;

  const sanitizedInsertStyle = sanitizeFloatingStyle(
    insertStyle as FloatingStyle | undefined,
  );
  const sanitizedEditStyle = sanitizeFloatingStyle(
    editStyle as FloatingStyle | undefined,
  );

  if (hidden) return null;

  const input = (
    <div className="flex w-[330px] flex-col" {...inputProps}>
      <div className="flex items-center">
        <div className="flex items-center pr-1 pl-2 text-muted-foreground">
          <Link className="size-4" />
        </div>

        <FloatingLinkUrlInput
          className={inputVariants()}
          placeholder="Paste link"
          data-plate-focus
        />
      </div>
      <Separator className="my-1" />
      <div className="flex items-center">
        <div className="flex items-center pr-1 pl-2 text-muted-foreground">
          <Text className="size-4" />
        </div>
        <input
          className={inputVariants()}
          placeholder="Text to display"
          data-plate-focus
          {...textInputProps}
        />
      </div>
    </div>
  );

  const editContent = editState.isEditing ? (
    input
  ) : (
    <div className="box-content flex items-center">
      <button
        className={buttonVariants({ size: "sm", variant: "ghost" })}
        type="button"
        {...editButtonProps}
      >
        Edit link
      </button>

      <Separator orientation="vertical" />

      <LinkOpenButton />

      <Separator orientation="vertical" />

      <button
        className={buttonVariants({
          size: "sm",
          variant: "ghost",
        })}
        type="button"
        {...unlinkButtonProps}
      >
        <Unlink width={18} />
      </button>
    </div>
  );

  return (
    <>
      <div
        ref={insertRef as unknown as React.RefObject<HTMLDivElement | null>}
        className={popoverVariants()}
        {...insertRestProps}
        style={sanitizedInsertStyle}
      >
        {input}
      </div>

      <div
        ref={editRef as unknown as React.RefObject<HTMLDivElement | null>}
        className={popoverVariants()}
        {...editRestProps}
        style={sanitizedEditStyle}
      >
        {editContent}
      </div>
    </>
  );
}

function LinkOpenButton() {
  const editor = useEditorRef();
  const selection = useEditorSelection();

  const attributes = React.useMemo(() => {
    const entry = editor.api.node({
      match: { type: editor.getType(KEYS.link) },
    }) as NodeEntry<TLinkElement> | undefined;
    if (!entry) {
      return {};
    }
    const [element] = entry;
    return getLinkAttributes(editor, element);
  }, [editor, selection]);

  return (
    <a
      {...attributes}
      className={buttonVariants({
        size: "sm",
        variant: "ghost",
      })}
      onMouseOver={(e) => {
        e.stopPropagation();
      }}
      aria-label="Open link in a new tab"
      target="_blank"
    >
      <ExternalLink width={18} />
    </a>
  );
}
