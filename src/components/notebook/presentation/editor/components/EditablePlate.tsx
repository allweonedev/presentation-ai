"use client";

import { Editor } from "@/components/plate/ui/editor";
import ImageGenerationModel from "@/components/plate/ui/image-generation-model";
import { cn } from "@/lib/utils";
import { type Value } from "platejs";
import { Plate, type PlateEditor } from "platejs/react";
import { useMemo } from "react";
import { type PlateSlide } from "../../utils/parser";
import RootImage from "../custom-elements/root-image";
import LayoutImageDrop from "../dnd/components/LayoutImageDrop";
import { useRootImageHeight } from "../hooks/useRootImageHeight";
import { getAlignmentClass, getAlignmentStyle } from "../utils/alignment-utils";

interface EditablePlateProps {
  editor: PlateEditor;
  className?: string;
  id?: string;
  readOnly: boolean;
  isPreview: boolean;
  isGenerating: boolean;
  isPresenting: boolean;
  initialContent?: PlateSlide;
  onFocusSlide: (slideId: string) => void;
  onDebouncedChange: (value: Value) => void;
}

export function EditablePlate({
  editor,
  className,
  id,
  readOnly,
  isPreview,
  isGenerating,
  isPresenting,
  initialContent,
  onFocusSlide,
  onDebouncedChange,
}: EditablePlateProps) {
  // Use extracted hook for root image height calculations
  const {
    editorRef,
    shouldCapRootImage,
    maxRootImageHeight,
    presentingRootImageHeight,
    presentingMaxRootImageHeight,
  } =
    useRootImageHeight({
      isPresenting,
      initialContent,
    });

  // Use extracted utility for alignment style
  const alignmentStyle = useMemo(
    () =>
      getAlignmentStyle(
        isPresenting,
        initialContent?.alignment,
        initialContent?.layoutType,
      ),
    [isPresenting, initialContent?.alignment, initialContent?.layoutType],
  );

  return (
    <Plate
      editor={editor}
      onValueChange={({ value }) => {
        if (readOnly || isGenerating || isPresenting) return;
        onDebouncedChange(value);
      }}
      readOnly={isGenerating || readOnly}
    >
      {!readOnly && <LayoutImageDrop slideId={initialContent?.id ?? ""} />}
      <Editor
        ref={editorRef}
        className={cn(
          className,
          "@container/plate-container flex flex-col border-none bg-transparent! py-12 outline-hidden",
          "flex-1",
          (readOnly || isGenerating) && "px-16",
          isPresenting && shouldCapRootImage && "self-start",
          getAlignmentClass(initialContent?.alignment),
        )}
        id={id}
        variant="ghost"
        readOnly={isPreview || isGenerating || readOnly}
        style={alignmentStyle}
        onFocus={() => initialContent?.id && onFocusSlide(initialContent.id)}
      />

      {initialContent?.rootImage &&
        initialContent.layoutType !== undefined &&
        initialContent.layoutType !== "background" &&
        initialContent.layoutType !== "none" && (
          <RootImage
            image={initialContent.rootImage}
            layoutType={initialContent.layoutType}
            slideId={initialContent.id}
            maxHeightPx={shouldCapRootImage ? maxRootImageHeight : presentingMaxRootImageHeight}
            heightPx={presentingRootImageHeight}
          />
        )}
      {!readOnly && <ImageGenerationModel />}
    </Plate>
  );
}
