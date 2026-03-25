"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { DRAG_ITEM_BLOCK, type ElementDragItemNode } from "@platejs/dnd";
import {
  Copy,
  Download,
  Edit,
  ExternalLink,
  FileText,
  Link2,
  Maximize2,
  Trash2,
} from "lucide-react";
import { useDrop } from "react-dnd";
import { toast } from "sonner";
import { type RootImage } from "../../../utils/parser";

interface ImageSlideProps {
  image: RootImage;
  slideId: string;
}

export default function ImageSlide({ image, slideId }: ImageSlideProps) {
  const slides = usePresentationState((s) => s.slides);
  const setSlides = usePresentationState((s) => s.setSlides);
  const setCurrentSlide = usePresentationState((s) => s.setCurrentSlideId);
  const openImageEditor = usePresentationState((s) => s.openImageEditor);
  const rootImageGeneration = usePresentationState(
    (s) => s.rootImageGeneration,
  );

  const computedImageUrl = image.url;
  const computedGen = rootImageGeneration[slideId];
  const isGenerating =
    computedGen?.status === "queued" || computedGen?.status === "generating";

  const handleAction = (action: string) => {
    switch (action) {
      case "copy":
        if (computedImageUrl) {
          fetch(computedImageUrl)
            .then((response) => response.blob())
            .then((blob) => {
              const item = new ClipboardItem({ [blob.type]: blob });
              navigator.clipboard.write([item]);
              toast("Image copied to clipboard");
            })
            .catch((err) => {
              console.error("Failed to copy image:", err);
              toast("Failed to copy image");
            });
        }
        break;
      case "copyAddress":
        if (computedImageUrl) {
          navigator.clipboard.writeText(computedImageUrl);
          toast("Image address copied to clipboard");
        }
        break;
      case "openNewTab":
        if (computedImageUrl) {
          window.open(computedImageUrl, "_blank");
        }
        break;
      case "download":
        if (computedImageUrl) {
          const link = document.createElement("a");
          link.href = computedImageUrl;
          link.download = "downloaded-image";
          link.click();
        }
        break;
      case "replace":
        setCurrentSlide(slideId);
        openImageEditor(
          image.imageSource === "search"
            ? "search"
            : image.imageSource === "gif"
              ? "gif"
              : "generate",
        );
        break;
      case "fit":
        updateCropSettings({
          ...image.cropSettings,
          objectFit:
            image.cropSettings?.objectFit === "contain" ? "cover" : "contain",
          objectPosition: image.cropSettings?.objectPosition ?? {
            x: 50,
            y: 50,
          },
        });
        break;
      case "convertToSlide":
        // Convert this image slide back to a regular slide
        const updatedSlides = slides.map((slide) => {
          if (slide.id === slideId) {
            return {
              ...slide,
              isImageSlide: false,
              layoutType: "left" as const, // Set a default layout
              content:
                slide.content.length > 0
                  ? slide.content
                  : [{ type: "h1", children: [{ text: "" }] }],
            };
          }
          return slide;
        });
        setSlides(updatedSlides);
        toast("Converted to slide");
        break;
      case "removeSlide":
        // Remove this slide entirely
        const filteredSlides = slides.filter((slide) => slide.id !== slideId);
        setSlides(filteredSlides);
        toast("Slide removed");
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };

  const updateCropSettings = (newCropSettings: typeof image.cropSettings) => {
    const updatedSlides = slides.map((slide) => {
      if (slide.id === slideId && slide.rootImage) {
        return {
          ...slide,
          rootImage: {
            ...slide.rootImage,
            cropSettings: newCropSettings,
          },
        };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  // Drop zone for accepting draggable elements
  const [{ isOver, canDrop }, dropRef] = useDrop<
    ElementDragItemNode,
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: DRAG_ITEM_BLOCK,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop: (dragItem) => {
      // Get the dropped element from dragItem
      const droppedElement = dragItem.element;
      if (!droppedElement) {
        toast.error("Could not get dropped element");
        return;
      }

      // Convert image slide to normal slide with image as background
      // and add the dropped element to the content
      const updatedSlides = slides.map((slide) => {
        if (slide.id === slideId) {
          // Create new content array with the dropped element
          const newContent = Array.isArray(droppedElement)
            ? [...droppedElement]
            : [droppedElement];

          return {
            ...slide,
            isImageSlide: false,
            layoutType: "background" as const,
            // Keep the rootImage so it becomes the background
            rootImage: slide.rootImage,
            // Add the dropped element to content
            content: newContent as typeof slide.content,
          };
        }
        return slide;
      });
      setSlides(updatedSlides);
      toast.success("Element added to slide");
    },
  });

  const isDropActive = isOver && canDrop;

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      className="relative aspect-video w-full"
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "flex h-full w-full cursor-pointer items-center justify-center",
              "relative overflow-hidden",
            )}
            onDoubleClick={() => {
              setCurrentSlide(slideId);
              openImageEditor(
                image.imageSource === "search"
                  ? "search"
                  : image.imageSource === "gif"
                    ? "gif"
                    : "generate",
              );
            }}
          >
            {isGenerating ? (
              <div className="absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center bg-muted/30 p-4">
                <Spinner className="mb-2 h-8 w-8" />
                <p className="text-sm text-muted-foreground">
                  Generating image...
                </p>
              </div>
            ) : computedImageUrl ? (
              // biome-ignore lint/performance/noImgElement: Valid use case for img element
              <img
                src={computedImageUrl}
                alt={image.query}
                className="h-full w-full"
                style={{
                  objectFit: image.cropSettings?.objectFit ?? "cover",
                  objectPosition: image.cropSettings?.objectPosition
                    ? `${image.cropSettings.objectPosition.x}% ${image.cropSettings.objectPosition.y}%`
                    : "center",
                }}
              />
            ) : (
              <div className="flex items-center justify-center text-muted-foreground">
                <span>No image</span>
              </div>
            )}
            {/* Drop indicator overlay */}
            {isDropActive && (
              <div className="absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-primary bg-primary/20">
                <div className="rounded-md bg-background/90 px-4 py-2 shadow-lg">
                  <span className="text-sm font-medium text-primary">
                    Drop to add element
                  </span>
                </div>
              </div>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem onClick={() => handleAction("copy")}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleAction("copyAddress")}>
            <Link2 className="mr-2 h-4 w-4" />
            Copy image address
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleAction("openNewTab")}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open image in new tab
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleAction("download")}>
            <Download className="mr-2 h-4 w-4" />
            Download image
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => handleAction("replace")}>
            <Edit className="mr-2 h-4 w-4" />
            Replace image...
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleAction("fit")}>
            <Maximize2 className="mr-2 h-4 w-4" />
            {image.cropSettings?.objectFit === "contain"
              ? "Cover Image"
              : "Fit Image"}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => handleAction("convertToSlide")}>
            <FileText className="mr-2 h-4 w-4" />
            Convert to slide
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => handleAction("removeSlide")}
            className="text-red-500 focus:bg-red-50 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove slide
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
