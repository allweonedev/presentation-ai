"use client";

import {
  PlateElement,
  type PlateElementProps,
  useEditorRef,
  useReadOnly,
  withHOC,
} from "platejs/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import { generateImageAction } from "@/app/_actions/apps/image-studio/generate";
import { getImageFromUnsplash } from "@/app/_actions/apps/image-studio/unsplash";
import {
  Resizable,
  mediaResizeHandleVariants,
} from "@/components/plate/ui/resize-handle";
import { Spinner } from "@/components/ui/spinner";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import { cn } from "@/lib/utils";
import {
  type ImageEditorMode,
  usePresentationState,
} from "@/states/presentation-state";
import { Image, useMediaState } from "@platejs/media/react";
import { ResizableProvider, ResizeHandle } from "@platejs/resizable";
import { type TImageElement } from "platejs";
import { type ImageCropSettings } from "../../utils/types";
import { useDraggable } from "../dnd/hooks/useDraggable";
import { PresentationImagePlaceholder } from "./presentation-image-placeholder";

type PresentationImageNode = TImageElement & {
  query?: string;
  cropSettings?: ImageCropSettings;
  imageSource?: "generate" | "search" | "gif";
};

export interface PresentationImageElementProps
  extends PlateElementProps<PresentationImageNode> {
  nodeProps?: Record<string, unknown>;
}

export const PresentationImageElement = withHOC(
  ResizableProvider,
  function PresentationImageElement({
    children,
    className,
    nodeProps,
    ref,
    ...props
  }: PresentationImageElementProps) {
    const { align = "center", focused, readOnly, selected } = useMediaState();
    const { isDragging, handleRef } = useDraggable({
      element: props.element,
    });
    const imageRef = useRef<HTMLDivElement | null>(null);
    const editor = useEditorRef();
    const { saveImmediately } = useDebouncedSave();
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(
      props.element.url,
    );

    const imageSource = usePresentationState((s) => s.imageSource);
    const imageModel = usePresentationState((s) => s.imageModel);
    const openPresentationImageEditor = usePresentationState(
      (s) => s.openPresentationImageEditor,
    );
    const hasHandledGenerationRef = useRef(false);

    const isReadOnly = useReadOnly();

    const cropSettings: ImageCropSettings = props.element.cropSettings || {
      objectFit: "cover",
      objectPosition: { x: 50, y: 50 },
      zoom: 1,
    };

    const handleOpenEditor = (mode: ImageEditorMode) => {
      if (isReadOnly) return;
      if (props.element.id) {
        const boundUpdateElement = (updateProps: Record<string, unknown>) => {
          editor.tf.setNodes(updateProps as Partial<TImageElement>, {
            at: [],
            match: (n) => n.id === props.element.id,
          });
        };

        openPresentationImageEditor(mode, boundUpdateElement);
      }
    };

    const generateImage = async (prompt: string) => {
      const container = document.querySelector(".presentation-slides");
      const isEditorReadOnly = !container?.contains(imageRef?.current);
      if (isEditorReadOnly) {
        return;
      }
      setIsGenerating(true);
      try {
        hasHandledGenerationRef.current = true;
        let result;

        if (imageSource === "stock") {
          const unsplashResult = await getImageFromUnsplash(prompt);
          if (unsplashResult.success && unsplashResult.imageUrl) {
            result = {
              success: true,
              image: { url: unsplashResult.imageUrl },
            };
          }
        } else {
          result = await generateImageAction(prompt, imageModel);
        }

        if (
          result &&
          typeof result === "object" &&
          "success" in result &&
          result.success === true &&
          result.image?.url
        ) {
          const newImageUrl = result.image.url;
          setImageUrl(newImageUrl);

          const nextImageElement: Partial<TImageElement> = {
            ...props.element,
            url: newImageUrl,
            query: prompt,
            cropSettings,
          };

          editor.tf.setNodes(nextImageElement);

          setTimeout(() => {
            void saveImmediately();
          }, 500);
        }
      } catch (error) {
        console.error("Error generating image:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    useEffect(() => {
      setImageUrl(props.element.url);
    }, [props.element.url]);

    useEffect(() => {
      if (
        hasHandledGenerationRef.current ||
        !props.element.query ||
        props.element.url ||
        imageUrl
      ) {
        return;
      }

      if (props.element.query) {
        void generateImage(props.element.query);
      }
    }, [props.element.query, props.element.url, imageUrl]);

    const imageStyles: React.CSSProperties = {
      objectFit: cropSettings.objectFit,
      objectPosition: `${cropSettings.objectPosition.x}% ${cropSettings.objectPosition.y}%`,
      transform: `scale(${cropSettings.zoom ?? 1})`,
      transformOrigin: `${cropSettings.objectPosition.x}% ${cropSettings.objectPosition.y}%`,
    };

    if (isReadOnly) {
      return (
        <PlateElement ref={ref} className={cn(className)} {...props}>
          <div ref={imageRef}>
            <Resizable
              align={align}
              options={{
                align,
                readOnly,
              }}
            >
              {imageUrl ? (
                <div className="my-4 text-center">
                  <Image
                    ref={handleRef}
                    className={cn("h-auto max-w-full")}
                    alt={props.element.query ?? ""}
                    src={imageUrl}
                    loading="lazy"
                    decoding="async"
                    style={{
                      ...imageStyles,
                      borderRadius: "var(--presentation-border-radius, 0.5rem)",
                      boxShadow:
                        "var(--presentation-card-shadow, 0 1px 3px rgba(0,0,0,0.12))",
                    }}
                    {...nodeProps}
                  />
                </div>
              ) : (
                <PresentationImagePlaceholder
                  className="pointer-events-auto h-full w-full rounded-[inherit]"
                  element={props.element}
                />
              )}
              {children}
            </Resizable>
          </div>
        </PlateElement>
      );
    }

    return (
      <PlateElement ref={ref} className={cn(className)} {...props}>
        <div ref={imageRef}>
          <Resizable
            align={align}
            options={{
              align,
              readOnly,
            }}
            className={cn("flex", !props.element.width && "w-full")}
          >
            <ResizeHandle
              className={mediaResizeHandleVariants({ direction: "left" })}
              options={{ direction: "left" }}
            />
            {isGenerating ? (
              <div className="relative min-h-[200px] w-full">
                <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-muted">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner className="h-6 w-6" />
                    <span className="text-sm text-muted-foreground">
                      Generating image...
                    </span>
                  </div>
                </div>
              </div>
            ) : !imageUrl ? (
              <div
                ref={handleRef}
                className={cn(
                  "my-4 aspect-video w-full",
                  focused && selected && "ring-2 ring-ring ring-offset-2",
                )}
                style={{
                  borderRadius: "var(--presentation-border-radius, 0.5rem)",
                }}
                {...nodeProps}
              >
                <PresentationImagePlaceholder
                  className="pointer-events-auto h-full w-full rounded-[inherit]"
                  element={props.element}
                />
              </div>
            ) : (
              <div className="my-4 flex-1 text-center">
                <Image
                  ref={handleRef}
                  className={cn(
                    "h-auto w-full",
                    "cursor-pointer",
                    focused && selected && "ring-2 ring-ring ring-offset-2",
                    isDragging && "opacity-50",
                  )}
                  alt={props.element.query ?? ""}
                  src={imageUrl}
                  loading="lazy"
                  decoding="async"
                  onDoubleClick={() => {
                    const mode: ImageEditorMode =
                      props.element.imageSource === "search"
                        ? "search"
                        : props.element.imageSource === "gif"
                          ? "gif"
                          : "generate";
                    handleOpenEditor(mode);
                  }}
                  style={{
                    ...imageStyles,
                    borderRadius: "var(--presentation-border-radius, 0.5rem)",
                    boxShadow:
                      "var(--presentation-card-shadow, 0 1px 3px rgba(0,0,0,0.12))",
                  }}
                  onError={(e) => {
                    console.error(
                      "Presentation image failed to load:",
                      e,
                      imageUrl,
                    );
                  }}
                  {...nodeProps}
                />
              </div>
            )}
            <ResizeHandle
              className={mediaResizeHandleVariants({
                direction: "right",
              })}
              options={{ direction: "right" }}
            />
            {children}
          </Resizable>
        </div>
      </PlateElement>
    );
  },
);
