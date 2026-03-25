import { updateSiblingsForcefully } from "@/components/notebook/presentation/editor/dnd/utils/updateSiblingsForcefully";
import { type TElement, type TText } from "platejs";
import { type PlateEditor } from "platejs/react";
import { useEffect, useRef } from "react";

/**
 * Forces re-render of all children of the given element whenever
 * the number of its children changes. This is useful for components
 * whose UI depends on sibling indexes/count.
 */
export function useForceUpdateChildrenOnLengthChange(
  editor: PlateEditor | null | undefined,
  element: (TElement | TText) | null | undefined,
): void {
  const previousLengthRef = useRef<number>(
    Array.isArray((element as TElement | TText | undefined)?.children)
      ? ((element as TElement).children as unknown[]).length
      : 0,
  );

  useEffect(() => {
    if (!editor || !element) return;

    const currentLength = Array.isArray((element as TElement).children)
      ? ((element as TElement).children as unknown[]).length
      : 0;

    if (currentLength !== previousLengthRef.current) {
      const parentPath = editor.api.findPath(element as TElement);
      if (parentPath) {
        updateSiblingsForcefully(editor, element as TElement, parentPath);
      }
      previousLengthRef.current = currentLength;
    }
  }, [editor, element, (element as TElement | undefined)?.children?.length]);
}
