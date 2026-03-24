"use client";

import { type Image as GeneratedImage } from "@/app/_actions/apps/image-studio/fetch";
import { SharedGenerateControls } from "@/components/presentation/shared/SharedGenerateControls";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import { usePresentationState } from "@/states/presentation-state";
import { type TElement } from "platejs";
import { useEditorRef } from "platejs/react";
import { type RootImage as RootImageType } from "../../../utils/parser";
import { ActionButtons } from "./ActionButtons";
import { ImagePreview } from "./ImagePreview";
import { type ImageDimensions } from "./useImageDimensions";

interface GenerateControlsProps {
  element: TElement & RootImageType;
  slideId?: string;
  isRootImage: boolean;
  onImageSelect?: (url: string, prompt: string) => void;
  onImagesGenerated?: (images: GeneratedImage[]) => void;
  onOpenCrop?: () => void;
  imageDimensions?: ImageDimensions;
}

export function GenerateControls({
  element,
  slideId,
  isRootImage,
  onImageSelect,
  onImagesGenerated,
  onOpenCrop,
  imageDimensions,
}: GenerateControlsProps) {
  const editor = useEditorRef(slideId);
  const { saveImmediately } = useDebouncedSave();

  const handleImageSelect = (url: string, prompt: string) => {
    const { setSlides, clearRootImageGeneration } =
      usePresentationState.getState();
    if (isRootImage) {
      if (slideId) clearRootImageGeneration(slideId);
      setSlides((slides) =>
        slides.map((slide) =>
          slide.id === slideId
            ? {
                ...slide,
                rootImage: {
                  ...slide.rootImage!,
                  url: url,
                  query: prompt,
                  imageSource: "generate",
                  embedType: undefined,
                  chartType: undefined,
                  chartData: undefined,
                },
              }
            : slide,
        ),
      );
      void saveImmediately();
    } else {
      editor.tf.setNodes(
        { url: url, query: prompt, embedType: undefined },
        { at: editor.api.findPath(element) },
      );
      void saveImmediately();
    }
  };

  const selectImage = onImageSelect ?? handleImageSelect;

  // Calculate thumbnail scale to fit in 90x90 box
  const thumbnailDimensions = imageDimensions
    ? {
        ...imageDimensions,
        scale: Math.min(
          360 / imageDimensions.width,
          360 / imageDimensions.height,
        ),
      }
    : { width: 360, height: 360, scale: 1 };

  const handleCropSettingsChange = (settings: typeof element.cropSettings) => {
    const { setSlides } = usePresentationState.getState();
    if (isRootImage) {
      setSlides((slides) =>
        slides.map((slide) =>
          slide.id === slideId
            ? {
                ...slide,
                rootImage: {
                  ...slide.rootImage!,
                  cropSettings: settings,
                },
              }
            : slide,
        ),
      );
      void saveImmediately();
    } else {
      editor.tf.setNodes(
        { cropSettings: settings },
        { at: editor.api.findPath(element) },
      );
      void saveImmediately();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mini Preview */}

      <div className="flex flex-col gap-2">
        <div className="flex justify-center">
          <div className="relative flex size-90 items-center justify-center overflow-hidden rounded-md border bg-muted shadow-xs">
            {imageDimensions ? (
              <ImagePreview
                element={element}
                currentMode="generate"
                localCropSettings={{
                  objectFit: element.cropSettings?.objectFit ?? "cover",
                  objectPosition: {
                    x: element.cropSettings?.objectPosition.x ?? 50,
                    y: element.cropSettings?.objectPosition.y ?? 50,
                  },
                  zoom: element.cropSettings?.zoom ?? 1,
                }}
                imageDimensions={thumbnailDimensions}
                onCropSettingsChange={() => {}}
                hideControls={true}
              />
            ) : (
              // biome-ignore lint/performance/noImgElement: This is necessary to support different types of thing
              <img
                src={element.url}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Action Buttons - Always Visible */}
        <div className="flex justify-center">
          <ActionButtons
            element={element}
            slideId={slideId}
            isRootImage={isRootImage}
            imageUrl={element.url}
            onOpenCrop={onOpenCrop}
            cropSettings={{
              objectFit: element.cropSettings?.objectFit ?? "cover",
              objectPosition: {
                x: element.cropSettings?.objectPosition.x ?? 50,
                y: element.cropSettings?.objectPosition.y ?? 50,
              },
              zoom: element.cropSettings?.zoom ?? 1,
            }}
            onCropSettingsChange={handleCropSettingsChange}
            showInOverlay={true}
          />
        </div>
      </div>

      <SharedGenerateControls
        onImageSelect={selectImage}
        initialPrompt={element.query ?? ""}
        onImagesGenerated={onImagesGenerated}
      />
    </div>
  );
}
