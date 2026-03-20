import React from "react";

import { MarkdownPlugin } from "@platejs/markdown";
import { type Value } from "@platejs/slate";
import { type AnyPluginConfig } from "platejs";
import {
  createPlateEditor,
  type CreatePlateEditorOptions,
  type PlateEditor,
} from "platejs/react";

/**
 * Creates a memoized Plate editor for React components.
 *
 * This hook creates a fully configured Plate editor instance that is memoized
 * based on the provided dependencies. It's optimized for React components to
 * prevent unnecessary re-creation of the editor on every render.
 *
 * Examples:
 *
 * ```ts
 * const editor = usePlateEditor({
 *   plugins: [ParagraphPlugin, HeadingPlugin],
 *   value: [{ type: 'p', children: [{ text: 'Hello world!' }] }],
 * });
 *
 * // Editor with custom dependencies
 * const editor = usePlateEditor(
 *   {
 *     plugins: [ParagraphPlugin],
 *     enabled,
 *   },
 *   [enabled]
 * ); // Re-create when enabled changes
 * ```
 *
 * @param options - Configuration options for creating the Plate editor
 * @param deps - Additional dependencies for the useMemo hook (default: [])
 * @see {@link createPlateEditor} for detailed information on React editor creation and configuration.
 * @see {@link createSlateEditor} for a non-React version of editor creation.
 * @see {@link withPlate} for the underlying React-specific enhancement function.
 */
export function usePlateEditor(
  options: CreatePlateEditorOptions<Value, AnyPluginConfig> & {
    enabled?: boolean;
    initialMarkdown?: string;
  } = {},
  deps: React.DependencyList = [],
): ReturnType<typeof createPlateEditor> {
  const [, forceRender] = React.useState({});
  const isMountedRef = React.useRef(false);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const value: CreatePlateEditorOptions<Value, AnyPluginConfig>["value"] =
    !options.initialMarkdown
      ? options.value
      : (editor: PlateEditor) =>
          editor
            .getApi(MarkdownPlugin)
            .markdown.deserialize(options.initialMarkdown ?? "", {
              withoutMdx: true,
            });

  return React.useMemo(() => {
    const editor = createPlateEditor({
      ...options,
      value: value,
      onReady: (ctx) => {
        if (ctx.isAsync && isMountedRef.current) {
          forceRender({});
        }
        options.onReady?.(ctx);
      },
    });

    return editor;
  }, [options.id, options.enabled, ...deps]);
}
