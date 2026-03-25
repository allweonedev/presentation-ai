import { type NodeEntry, PathApi, type TElement, type TText } from "platejs";
import { type PlateEditor } from "platejs/react";

/**
 * Components that require force full sibling updates when their siblings change
 * These components depend on sibling indexes or count for their layout/styling
 */
export const COMPONENTS_REQUIRING_SIBLING_UPDATES = [
  "pyramid-item",
  "cycle-item",
  "stair-item",
  "before-after-side",
  "compare-side",
  "timeline-item",
  "arrow-vertical-item",
  "box-item",
  "bullet",
  "cons-item",
  "pros-item",
] as const;

/**
 * Forces all sibling nodes under the same parent to re-render by touching
 * a `lastUpdate` property on each sibling node. Useful when UI depends on
 * sibling indexes or count (e.g., alternating layouts).
 */
export function updateSiblingsForcefully(
  editor: PlateEditor,
  parentElement: NodeEntry<TElement | TText>[0] | null,
  parentPath: number[],
) {
  if (
    !parentElement?.children ||
    !Array.isArray(parentElement.children) ||
    (Array.isArray(parentElement.children) &&
      parentElement.children.length === 0)
  ) {
    return;
  }

  const updateTimestamp = Date.now();
  try {
    editor.tf.withoutNormalizing(() => {
      (parentElement.children as unknown[]).forEach((_, childIndex) => {
        const siblingPath = [...parentPath, childIndex];
        try {
          editor.tf.setNodes(
            { lastUpdate: updateTimestamp },
            { at: siblingPath },
          );
        } catch {
          // ignore errors for siblings that might be mid-edit
        }
      });
    });
  } catch {
    // ignore
  }
}

/**
 * Updates siblings for all components that require it after a drop operation
 */
export function updateSiblingsAfterDrop(
  editor: PlateEditor,
  droppedElement: { type: string; id?: string },
  dropPath: number[],
) {
  // Check if the dropped element requires sibling updates
  if (
    !COMPONENTS_REQUIRING_SIBLING_UPDATES.includes(
      droppedElement.type as (typeof COMPONENTS_REQUIRING_SIBLING_UPDATES)[number],
    )
  ) {
    return;
  }

  // Get the parent element and path
  const parentPath = PathApi.parent(dropPath);
  const parentElement = editor.api.node({ at: parentPath });

  if (!parentElement) return;

  // Update all siblings
  updateSiblingsForcefully(editor, parentElement[0], parentPath);
}
