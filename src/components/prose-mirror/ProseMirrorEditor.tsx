import { cn } from "@/lib/utils";
import { baseKeymap, toggleMark } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import FloatingToolbar from "./FloatingToolbar";
import mySchema from "./ProseMirrorSchema";

interface ProseMirrorEditorProps {
  content: string;
  onChange: (content: string) => void;
  isEditing: boolean;
  onChangeState?: (hasChanges: boolean) => void;
  onBlur?: () => void;
  className?: string;
  showFloatingToolbar?: boolean;
}

const ProseMirrorEditor: React.FC<ProseMirrorEditorProps> = ({
  content,
  onChange,
  isEditing,
  onChangeState,
  onBlur,
  className,
  showFloatingToolbar = true,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const originalContentRef = useRef(content);
  const toolbarTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [toolbarState, setToolbarState] = useState({
    isVisible: false,
    top: 0,
    left: 0,
  });

  const checkForChanges = (newContent: string) => {
    const hasChanges = newContent !== originalContentRef.current;
    onChangeState?.(hasChanges);
  };

  const updateToolbarPosition = useCallback((view: EditorView) => {
    const { from, to } = view.state.selection;

    if (from === to) {
      setToolbarState((prev) => ({ ...prev, isVisible: false }));
      if (toolbarTimeoutRef.current) {
        clearTimeout(toolbarTimeoutRef.current);
      }
      return;
    }

    const editorBox = editorRef.current?.getBoundingClientRect();
    if (!editorBox) return;

    const { top: editorTop, left: editorLeft } = editorBox;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    // Calculate position relative to the editor
    const selectionTop = Math.min(start.top, end.top);
    const selectionLeft = (start.left + end.left) / 2;

    // Clear any existing timeout
    if (toolbarTimeoutRef.current) {
      clearTimeout(toolbarTimeoutRef.current);
    }

    // Set a new timeout for showing the toolbar
    toolbarTimeoutRef.current = setTimeout(() => {
      setToolbarState({
        isVisible: true,
        top: selectionTop - editorTop,
        left: selectionLeft - editorLeft,
      });
    }, 150);
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    // Add global styles to remove ProseMirror focus outline
    const style = document.createElement("style");
    style.textContent = `
      .ProseMirror {
        outline: none !important;
        position: relative !important;
      }
      .ProseMirror-focused {
        outline: none !important;
      }
    `;
    document.head.appendChild(style);

    const state = EditorState.create({
      doc: defaultMarkdownParser.parse(content),
      schema: mySchema,
      plugins: [
        history(),
        keymap({
          "Mod-z": undo,
          "Mod-y": redo,
          "Mod-Shift-z": redo,
          "Mod-b": (state, dispatch) => {
            const strongMark = state.schema.marks.strong;
            if (!strongMark) return false;
            return toggleMark(strongMark)(state, dispatch);
          },
          "Mod-i": (state, dispatch) => {
            const emMark = state.schema.marks.em;
            if (!emMark) return false;
            return toggleMark(emMark)(state, dispatch);
          },
        }),
        keymap(baseKeymap),
      ],
    });

    const view = new EditorView(editorRef.current, {
      state,
      editable: () => isEditing,
      dispatchTransaction: (transaction) => {
        const newState = view.state.apply(transaction);
        view.updateState(newState);

        const markdownContent = defaultMarkdownSerializer.serialize(
          newState.doc,
        );
        onChange(markdownContent);
        checkForChanges(markdownContent);

        if (transaction.selectionSet && isEditing) {
          updateToolbarPosition(view);
        }
      },
      handleDOMEvents: {
        blur: (_view, event) => {
          // Check if the related target (where focus is going) is part of our toolbar
          const relatedTarget = event.relatedTarget as HTMLElement;
          if (
            relatedTarget?.closest('[role="menu"]') ??
            relatedTarget?.closest(".floating-toolbar")
          ) {
            // If clicking toolbar or dropdown, don't hide
            return false;
          }

          if (toolbarTimeoutRef.current) {
            clearTimeout(toolbarTimeoutRef.current);
          }
          setToolbarState((prev) => ({ ...prev, isVisible: false }));
          onBlur?.();
          return false;
        },
        focus: () => {
          const { from, to } = view.state.selection;
          if (from !== to) {
            updateToolbarPosition(view);
          }
          return false;
        },
      },
    });

    viewRef.current = view;
    originalContentRef.current = content;
    onChangeState?.(false);

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
      if (toolbarTimeoutRef.current) {
        clearTimeout(toolbarTimeoutRef.current);
      }
      document.head.removeChild(style);
    };
  }, [isEditing, updateToolbarPosition]);

  // Update content when it changes externally
  useEffect(() => {
    if (viewRef.current) {
      const currentContent = defaultMarkdownSerializer.serialize(
        viewRef.current.state.doc,
      );
      if (currentContent !== content) {
        const newState = EditorState.create({
          doc: defaultMarkdownParser.parse(content),
          schema: mySchema,
          plugins: viewRef.current.state.plugins,
        });
        viewRef.current.updateState(newState);
        originalContentRef.current = content;
        onChangeState?.(false);
      }
    }
  }, [content]);

  return (
    <div className="relative">
      <div
        ref={editorRef}
        className={cn(
          "prose max-w-none focus:ring-0 focus:outline-hidden dark:prose-invert",
          isEditing ? "cursor-text" : "cursor-default",
          className,
        )}
      />
      {viewRef.current && showFloatingToolbar && (
        <FloatingToolbar
          view={viewRef.current}
          isVisible={toolbarState.isVisible && isEditing}
          top={toolbarState.top}
          left={toolbarState.left}
        />
      )}
    </div>
  );
};

export default ProseMirrorEditor;
