"use client";

import * as React from "react";

import { AILoadingLabel } from "@/components/ui/ai-loading-label";
import {
  AIChatPlugin,
  AIPlugin,
  useEditorChat,
  useLastAssistantMessage,
} from "@platejs/ai/react";
import { BlockSelectionPlugin, useIsSelecting } from "@platejs/selection/react";
import { getTransientSuggestionKey } from "@platejs/suggestion";
import { Command as CommandPrimitive } from "cmdk";
import {
  Album,
  BadgeHelp,
  BookOpenCheck,
  Check,
  CornerUpLeft,
  FeatherIcon,
  ListEnd,
  ListMinus,
  ListPlus,
  PauseIcon,
  PenLine,
  SmileIcon,
  Wand,
  X,
} from "lucide-react";
import {
  KEYS,
  NodeApi,
  type NodeEntry,
  type SlateEditor,
  isHotkey,
} from "platejs";
import {
  type PlateEditor,
  useEditorPlugin,
  useEditorRef,
  useHotkeys,
  usePluginOption,
} from "platejs/react";

import { Button } from "@/components/plate/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/plate/ui/command";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/plate/ui/popover";
import { cn } from "@/lib/utils";

import { AIChatEditor } from "./ai-chat-editor";

type EditorChatState =
  | "cursorCommand"
  | "cursorSuggestion"
  | "selectionCommand"
  | "selectionSuggestion";

type AIMenuItemSelectArgs = {
  aiEditor: SlateEditor;
  editor: PlateEditor;
  input: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function AIMenu() {
  const { api, editor } = useEditorPlugin(AIChatPlugin);
  const open = usePluginOption(AIChatPlugin, "open");
  const mode = usePluginOption(AIChatPlugin, "mode");
  const toolName = usePluginOption(AIChatPlugin, "toolName");
  const streaming = usePluginOption(AIChatPlugin, "streaming");
  const isSelecting = useIsSelecting();

  const [value, setValue] = React.useState("");
  const [input, setInput] = React.useState("");

  const chat = usePluginOption(AIChatPlugin, "chat");
  const { messages, status } = chat;
  const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(
    null,
  );

  const content = useLastAssistantMessage()?.parts.find(
    (part) => part.type === "text",
  )?.text;

  React.useEffect(() => {
    if (!streaming) {
      return;
    }

    const anchor = api.aiChat.node({ anchor: true });
    if (!anchor?.[0]) {
      setAnchorElement(null);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      try {
        const anchorDom = editor.api.toDOMNode(anchor[0]);
        setAnchorElement(anchorDom ?? null);
      } catch {
        setAnchorElement(null);
      }
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [api.aiChat, editor, streaming]);

  const setPopoverOpen = (nextOpen: boolean) => {
    if (nextOpen) {
      api.aiChat.show();
      return;
    }

    api.aiChat.hide();
  };

  const show = React.useCallback(
    (nextAnchorElement: HTMLElement) => {
      setAnchorElement(nextAnchorElement);
      setPopoverOpen(true);
    },
    [api.aiChat],
  );

  useEditorChat({
    onOpenBlockSelection: (blocks: NodeEntry[]) => {
      const lastBlock = blocks.at(-1);
      if (!lastBlock?.[0]) {
        return;
      }

      const domNode = editor.api.toDOMNode(lastBlock[0]);
      if (!domNode) {
        return;
      }

      show(domNode);
    },
    onOpenChange: (nextOpen) => {
      if (!nextOpen) {
        setAnchorElement(null);
        setInput("");
      }
    },
    onOpenCursor: () => {
      const ancestorEntry = editor.api.block({ highest: true });
      if (!ancestorEntry) {
        return;
      }

      const [ancestor] = ancestorEntry;

      if (!editor.api.isAt({ end: true }) && !editor.api.isEmpty(ancestor)) {
        editor
          .getApi(BlockSelectionPlugin)
          .blockSelection.set(ancestor.id as string);
      }

      const domNode = editor.api.toDOMNode(ancestor);
      if (!domNode) {
        return;
      }

      show(domNode);
    },
    onOpenSelection: () => {
      const lastBlock = editor.api.blocks().at(-1);
      if (!lastBlock?.[0]) {
        return;
      }

      const domNode = editor.api.toDOMNode(lastBlock[0]);
      if (!domNode) {
        return;
      }

      show(domNode);
    },
  });

  useHotkeys("esc", () => {
    api.aiChat.stop();
  });

  const isLoading = status === "streaming" || status === "submitted";

  React.useEffect(() => {
    if (toolName !== "edit" || mode !== "chat" || isLoading) {
      return;
    }

    let anchorNode = editor.api.node({
      at: [],
      reverse: true,
      match: (node) =>
        isRecord(node) &&
        Boolean(node[KEYS.suggestion]) &&
        Boolean(node[getTransientSuggestionKey()]),
    });

    if (!anchorNode) {
      anchorNode = editor
        .getApi(BlockSelectionPlugin)
        .blockSelection.getNodes({ selectionFallback: true, sort: true })
        .at(-1);
    }

    if (!anchorNode) {
      return;
    }

    const block = editor.api.block({ at: anchorNode[1] });
    if (!block?.[0]) {
      return;
    }

    const domNode = editor.api.toDOMNode(block[0]);
    if (!domNode) {
      return;
    }

    setAnchorElement(domNode);
  }, [editor, isLoading, mode, toolName]);

  if (isLoading && mode === "insert") {
    return null;
  }

  if (toolName === "edit" && mode === "chat" && isLoading) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setPopoverOpen} modal={false}>
      {anchorElement ? (
        <PopoverAnchor virtualRef={{ current: anchorElement }} />
      ) : null}

      <PopoverContent
        className="border-none bg-transparent p-0 shadow-none"
        style={{
          width: anchorElement?.offsetWidth,
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          api.aiChat.hide();
        }}
        align="center"
        side="bottom"
      >
        <Command
          className="w-full rounded-lg border shadow-md"
          value={value}
          onValueChange={setValue}
        >
          {mode === "chat" &&
            isSelecting &&
            content &&
            toolName === "generate" && <AIChatEditor content={content} />}

          {isLoading ? (
            <div className="flex grow p-2 select-none">
              <AILoadingLabel
                label={messages.length > 1 ? "Editing..." : "Thinking..."}
              />
            </div>
          ) : (
            <CommandPrimitive.Input
              className={cn(
                "flex h-9 w-full min-w-0 border-input bg-transparent px-3 py-1 text-base outline-hidden transition-[color,box-shadow] placeholder:text-muted-foreground md:text-sm dark:bg-input/30",
                "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
                "border-b focus-visible:ring-transparent",
              )}
              value={input}
              onKeyDown={(event) => {
                if (isHotkey("backspace")(event) && input.length === 0) {
                  event.preventDefault();
                  api.aiChat.hide();
                }

                if (isHotkey("enter")(event) && !event.shiftKey && !value) {
                  event.preventDefault();
                  void api.aiChat.submit(input);
                  setInput("");
                }
              }}
              onValueChange={setInput}
              placeholder="Ask AI anything..."
              data-plate-focus
              autoFocus
            />
          )}

          {!isLoading && (
            <CommandList>
              <AIMenuItems
                input={input}
                setInput={setInput}
                setValue={setValue}
              />
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const aiChatItems = {
  accept: {
    icon: <Check />,
    label: "Accept",
    value: "accept",
    onSelect: ({ aiEditor, editor }: AIMenuItemSelectArgs) => {
      const { mode, toolName } = editor.getOptions(AIChatPlugin);

      if (mode === "chat" && toolName === "generate") {
        void editor
          .getTransforms(AIChatPlugin)
          .aiChat.replaceSelection(aiEditor);
        return;
      }

      editor.getTransforms(AIChatPlugin).aiChat.accept();
      editor.tf.focus({ edge: "end" });
    },
  },
  continueWrite: {
    icon: <PenLine />,
    label: "Continue writing",
    value: "continueWrite",
    onSelect: ({ editor, input }: AIMenuItemSelectArgs) => {
      const ancestorNode = editor.api.block({ highest: true });

      if (!ancestorNode) {
        return;
      }

      const isEmpty = NodeApi.string(ancestorNode[0]).trim().length === 0;

      void editor.getApi(AIChatPlugin).aiChat.submit(input, {
        mode: "insert",
        prompt: isEmpty
          ? `<Document>
{editor}
</Document>
Start writing a new paragraph AFTER <Document> ONLY ONE SENTENCE`
          : "Continue writing AFTER <Block> ONLY ONE SENTENCE. DONT REPEAT THE TEXT.",
        toolName: "generate",
      });
    },
  },
  discard: {
    icon: <X />,
    label: "Discard",
    shortcut: "Escape",
    value: "discard",
    onSelect: ({ editor }: AIMenuItemSelectArgs) => {
      editor.getTransforms(AIPlugin)?.ai?.undo();
      editor.getApi(AIChatPlugin).aiChat.hide();
    },
  },
  emojify: {
    icon: <SmileIcon />,
    label: "Emojify",
    value: "emojify",
    onSelect: ({ editor, input }: AIMenuItemSelectArgs) => {
      void editor.getApi(AIChatPlugin).aiChat.submit(input, {
        prompt:
          "Add a small number of contextually relevant emojis within each block only. Do not rewrite the meaning or modify markdown structure.",
        toolName: "edit",
      });
    },
  },
  explain: {
    icon: <BadgeHelp />,
    label: "Explain",
    value: "explain",
    onSelect: ({ editor, input }: AIMenuItemSelectArgs) => {
      void editor.getApi(AIChatPlugin).aiChat.submit(input, {
        prompt: {
          default: "Explain {editor}",
          selecting: "Explain",
        },
        toolName: "generate",
      });
    },
  },
  fixSpelling: {
    icon: <Check />,
    label: "Fix spelling & grammar",
    value: "fixSpelling",
    onSelect: ({ editor, input }: AIMenuItemSelectArgs) => {
      void editor.getApi(AIChatPlugin).aiChat.submit(input, {
        prompt:
          "Fix spelling, grammar, and punctuation errors within each block only, without changing meaning.",
        toolName: "edit",
      });
    },
  },
  generateMarkdownSample: {
    icon: <BookOpenCheck />,
    label: "Generate Markdown sample",
    value: "generateMarkdownSample",
    onSelect: ({ editor, input }: AIMenuItemSelectArgs) => {
      void editor.getApi(AIChatPlugin).aiChat.submit(input, {
        prompt: "Generate a markdown sample",
        toolName: "generate",
      });
    },
  },
  generateMdxSample: {
    icon: <BookOpenCheck />,
    label: "Generate MDX sample",
    value: "generateMdxSample",
    onSelect: ({ editor, input }: AIMenuItemSelectArgs) => {
      void editor.getApi(AIChatPlugin).aiChat.submit(input, {
        prompt: "Generate a mdx sample",
        toolName: "generate",
      });
    },
  },
  improveWriting: {
    icon: <Wand />,
    label: "Improve writing",
    value: "improveWriting",
    onSelect: ({ editor, input }: AIMenuItemSelectArgs) => {
      void editor.getApi(AIChatPlugin).aiChat.submit(input, {
        prompt:
          "Improve the writing for clarity and flow without changing meaning or adding new information.",
        toolName: "edit",
      });
    },
  },
  insertBelow: {
    icon: <ListEnd />,
    label: "Insert below",
    value: "insertBelow",
    onSelect: ({ aiEditor, editor }: AIMenuItemSelectArgs) => {
      void editor
        .getTransforms(AIChatPlugin)
        .aiChat.insertBelow(aiEditor, { format: "none" });
    },
  },
  makeLonger: {
    icon: <ListPlus />,
    label: "Make longer",
    value: "makeLonger",
    onSelect: ({ editor, input }: AIMenuItemSelectArgs) => {
      void editor.getApi(AIChatPlugin).aiChat.submit(input, {
        prompt:
          "Make the content longer by elaborating on existing ideas within each block only, without changing meaning.",
        toolName: "edit",
      });
    },
  },
  makeShorter: {
    icon: <ListMinus />,
    label: "Make shorter",
    value: "makeShorter",
    onSelect: ({ editor, input }: AIMenuItemSelectArgs) => {
      void editor.getApi(AIChatPlugin).aiChat.submit(input, {
        prompt:
          "Make the content shorter by reducing verbosity within each block only, without changing meaning.",
        toolName: "edit",
      });
    },
  },
  replace: {
    icon: <Check />,
    label: "Replace selection",
    value: "replace",
    onSelect: ({ aiEditor, editor }: AIMenuItemSelectArgs) => {
      void editor.getTransforms(AIChatPlugin).aiChat.replaceSelection(aiEditor);
    },
  },
  simplifyLanguage: {
    icon: <FeatherIcon />,
    label: "Simplify language",
    value: "simplifyLanguage",
    onSelect: ({ editor, input }: AIMenuItemSelectArgs) => {
      void editor.getApi(AIChatPlugin).aiChat.submit(input, {
        prompt:
          "Simplify the language using clearer and more straightforward wording within each block only, without changing meaning.",
        toolName: "edit",
      });
    },
  },
  summarize: {
    icon: <Album />,
    label: "Add a summary",
    value: "summarize",
    onSelect: ({ editor, input }: AIMenuItemSelectArgs) => {
      void editor.getApi(AIChatPlugin).aiChat.submit(input, {
        mode: "insert",
        prompt: {
          default: "Summarize {editor}",
          selecting: "Summarize",
        },
        toolName: "generate",
      });
    },
  },
  tryAgain: {
    icon: <CornerUpLeft />,
    label: "Try again",
    value: "tryAgain",
    onSelect: ({ editor }: AIMenuItemSelectArgs) => {
      void editor.getApi(AIChatPlugin).aiChat.reload();
    },
  },
} satisfies Record<
  string,
  {
    icon: React.ReactNode;
    label: string;
    value: string;
    component?: React.ComponentType<{ menuState: EditorChatState }>;
    filterItems?: boolean;
    items?: { label: string; value: string }[];
    shortcut?: string;
    onSelect?: (args: AIMenuItemSelectArgs) => void;
  }
>;

const menuStateItems: Record<
  EditorChatState,
  {
    items: (typeof aiChatItems)[keyof typeof aiChatItems][];
    heading?: string;
  }[]
> = {
  cursorCommand: [
    {
      items: [
        aiChatItems.generateMdxSample,
        aiChatItems.generateMarkdownSample,
        aiChatItems.continueWrite,
        aiChatItems.summarize,
        aiChatItems.explain,
      ],
    },
  ],
  cursorSuggestion: [
    {
      items: [aiChatItems.accept, aiChatItems.discard, aiChatItems.tryAgain],
    },
  ],
  selectionCommand: [
    {
      items: [
        aiChatItems.improveWriting,
        aiChatItems.emojify,
        aiChatItems.makeLonger,
        aiChatItems.makeShorter,
        aiChatItems.fixSpelling,
        aiChatItems.simplifyLanguage,
      ],
    },
  ],
  selectionSuggestion: [
    {
      items: [
        aiChatItems.accept,
        aiChatItems.discard,
        aiChatItems.insertBelow,
        aiChatItems.tryAgain,
      ],
    },
  ],
};

export const AIMenuItems = ({
  input,
  setInput,
  setValue,
}: {
  input: string;
  setInput: (value: string) => void;
  setValue: (value: string) => void;
}) => {
  const editor = useEditorRef();
  const { messages } = usePluginOption(AIChatPlugin, "chat");
  const aiEditor = usePluginOption(AIChatPlugin, "aiEditor");
  const isSelecting = useIsSelecting();

  const menuState = React.useMemo(() => {
    if (messages && messages.length > 0) {
      return isSelecting ? "selectionSuggestion" : "cursorSuggestion";
    }

    return isSelecting ? "selectionCommand" : "cursorCommand";
  }, [isSelecting, messages]);

  const menuGroups = React.useMemo(() => {
    return menuStateItems[menuState];
  }, [menuState]);

  React.useEffect(() => {
    const defaultItem = menuGroups[0]?.items[0];
    if (!defaultItem) {
      return;
    }

    setValue(defaultItem.value);
  }, [menuGroups, setValue]);

  if (!aiEditor) {
    return null;
  }

  return (
    <>
      {menuGroups.map((group, index) => (
        <CommandGroup key={index} heading={group.heading}>
          {group.items.map((menuItem) => (
            <CommandItem
              key={menuItem.value}
              className="[&_svg]:text-muted-foreground"
              value={menuItem.value}
              onSelect={() => {
                menuItem.onSelect?.({
                  aiEditor,
                  editor,
                  input,
                });
                setInput("");
              }}
            >
              {menuItem.icon}
              <span>{menuItem.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      ))}
    </>
  );
};

export function AILoadingBar() {
  const toolName = usePluginOption(AIChatPlugin, "toolName");
  const chat = usePluginOption(AIChatPlugin, "chat");
  const mode = usePluginOption(AIChatPlugin, "mode");
  const { status } = chat;
  const { api } = useEditorPlugin(AIChatPlugin);

  const isLoading = status === "streaming" || status === "submitted";
  const visible =
    isLoading &&
    (mode === "insert" || (toolName === "edit" && mode === "chat"));

  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground shadow-md transition-all duration-300",
      )}
    >
      <AILoadingLabel
        label={status === "submitted" ? "Thinking..." : "Writing..."}
        icon={
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        }
      />
      <Button
        size="sm"
        variant="ghost"
        className="flex items-center gap-1 text-xs"
        onClick={() => api.aiChat.stop()}
      >
        <PauseIcon className="h-4 w-4" />
        Stop
        <kbd className="ml-1 rounded bg-border px-1 font-mono text-[10px] text-muted-foreground shadow-2xs">
          Esc
        </kbd>
      </Button>
    </div>
  );
}
