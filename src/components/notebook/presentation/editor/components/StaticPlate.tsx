"use client";

import { cn } from "@/lib/utils";
import { type Descendant, type TText, type Value } from "platejs";
import { createStaticEditor as createSlateEditor } from "platejs/static";
import { useEffect, useMemo } from "react";
import { type PlateSlide } from "../../utils/parser";
import { EditorStatic } from "../custom-elements/static/editor-static";
import RootImageStatic from "../custom-elements/static/root-image-static";
import { PresentationEditorBaseKit } from "../plugins/presentation-editor-base-kit";
import { PresentationStaticCustomKit } from "../plugins/static-custom-kit";

interface StaticPlateProps {
  initialContent?: PlateSlide;
  className?: string;
  id?: string;
}

function isTextDescendant(node: Descendant): node is TText {
  return "text" in node;
}

function normalizeDescendant(node: Descendant): Descendant {
  if (isTextDescendant(node)) {
    return node;
  }

  const normalizedChildren = Array.isArray(node.children)
    ? node.children.map((child) => normalizeDescendant(child as Descendant))
    : [];

  return {
    ...node,
    children:
      normalizedChildren.length > 0
        ? normalizedChildren
        : ([{ text: "" }] as TText[]),
  };
}

function normalizeStaticContent(content?: PlateSlide["content"]): Value {
  if (!Array.isArray(content)) {
    return [] as Value;
  }

  return content.map((node) => normalizeDescendant(node as Descendant)) as Value;
}

export function StaticPlate({
  initialContent,
  className,
  id,
}: StaticPlateProps) {
  const normalizedContent = useMemo(
    () => normalizeStaticContent(initialContent?.content),
    [initialContent?.content],
  );

  const editor = useMemo(
    () =>
      createSlateEditor({
        plugins: [...PresentationEditorBaseKit, ...PresentationStaticCustomKit],
        value: [] as Value,
      }),
    [],
  );

  useEffect(() => {
    editor.tf.setValue(normalizedContent);
  }, [editor, normalizedContent]);

  return (
    <>
      <EditorStatic
        className={cn(
          className,
          "@container/presentation-editor-static flex flex-1 flex-col border-none bg-transparent! p-12 outline-hidden",
          initialContent?.alignment === "start" && "justify-start",
          initialContent?.alignment === "center" && "justify-center",
          initialContent?.alignment === "end" && "justify-end",
        )}
        id={id}
        editor={editor}
        value={normalizedContent}
      />

      {initialContent?.rootImage &&
        initialContent.layoutType !== undefined &&
        initialContent.layoutType !== "background" &&
        initialContent.layoutType !== "none" && (
          <RootImageStatic
            image={initialContent.rootImage}
            layoutType={initialContent.layoutType}
            slideId={initialContent.id}
          />
        )}
    </>
  );
}
