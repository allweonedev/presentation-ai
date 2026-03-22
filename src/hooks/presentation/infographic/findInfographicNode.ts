"use client";

import { ANTV_INFOGRAPHIC } from "@/components/notebook/presentation/editor/lib";
import { type TAntvInfographicElement } from "@/components/notebook/presentation/editor/plugins/antv-infographic-plugin";
import { type NodeEntry } from "platejs";
import { type PlateEditor } from "platejs/react";

function isAntvInfographicElement(
  node: unknown,
  elementId: string,
): node is TAntvInfographicElement {
  return (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    node.type === ANTV_INFOGRAPHIC &&
    "id" in node &&
    node.id === elementId
  );
}

export function findInfographicEntryById(
  editor: PlateEditor,
  elementId: string,
): NodeEntry<TAntvInfographicElement> | undefined {
  if (!elementId) {
    return undefined;
  }

  const entry = editor.api.node({
    at: [],
    match: (node) => isAntvInfographicElement(node, elementId),
  });

  if (!entry) {
    return undefined;
  }

  const [node, path] = entry;

  if (!isAntvInfographicElement(node, elementId)) {
    return undefined;
  }

  return [node, path];
}
