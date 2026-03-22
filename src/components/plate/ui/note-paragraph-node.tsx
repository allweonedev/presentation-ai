"use client";

import { NodeApi } from "platejs";
import {
  type PlateElementProps,
  PlateElement,
  useEditorSelector,
  useReadOnly,
} from "platejs/react";

import { NotesTemplateActions } from "@/components/notebook/notes/NotesTemplateActions";
import { cn } from "@/lib/utils";

export function NoteParagraphElement(props: PlateElementProps) {
  const readOnly = useReadOnly();
  const isEditorEmpty = useEditorSelector((editor) => editor.api.isEmpty(), []);
  const isCurrentParagraphEmpty =
    NodeApi.string(props.element).trim().length === 0;
  const isFirstTopLevelParagraph =
    props.path.length === 1 && props.path[0] === 0;
  const showPlaceholder =
    !readOnly &&
    isEditorEmpty &&
    isCurrentParagraphEmpty &&
    isFirstTopLevelParagraph;

  return (
    <PlateElement
      {...props}
      className={cn("relative m-0 px-0 py-1", showPlaceholder && "min-h-8")}
    >
      {showPlaceholder && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex max-w-full items-center">
          <NotesTemplateActions />
        </div>
      )}
      {props.children}
    </PlateElement>
  );
}
