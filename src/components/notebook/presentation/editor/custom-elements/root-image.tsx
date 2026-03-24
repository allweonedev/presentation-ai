"use client";

import { MediaEmbedPlaceholder } from "@/components/plate/ui/media-embed-placeholder";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Resizable } from "@/components/ui/resizable";
import { Spinner } from "@/components/ui/spinner";
import {
  BASE_HEIGHT,
  BASE_WIDTH_PERCENTAGE,
  useRootImageActions,
} from "@/hooks/presentation/useRootImageActions";
import { cn } from "@/lib/utils";
import {
  type ImageEditorMode,
  usePresentationState,
} from "@/states/presentation-state";
import { DRAG_ITEM_BLOCK } from "@platejs/dnd";
import {
  BarChart3,
  Edit,
  ImageOff,
  Link,
  Scissors,
  Trash2,
} from "lucide-react";
import { nanoid } from "nanoid";
import { KEYS, type TElement } from "platejs";
import { useEditorReadOnly } from "platejs/react";
import { useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import { type RootImage as RootImageType } from "../../utils/parser";
import { type ImageCropSettings } from "../../utils/types";
import { isChartType } from "../lib";
import { ChartRenderer } from "./charts/ChartRenderer";
import { EmbedRenderer } from "./embeds/EmbedRenderer";
import { CropModal } from "./image-editor/CropModal";
import ImagePlaceholder from "./image-placeholder";

import { useSlideOperations } from "@/hooks/presentation/useSlideOperations";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Copy,
  Download,
  ExternalLink,
  ImageIcon,
  Layout,
  LayoutPanelLeft,
  Link2,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";

export interface RootImageProps {
  image: RootImageType;
  layoutType?: string;
  slideId: string;
  heightValue?: string | number;
  maxHeightPx?: number;
  heightPx?: number;
}

export default function RootImage({
  image,
  layoutType,
  slideId,
  heightValue,
  maxHeightPx,
  heightPx,
}: RootImageProps) {
  const isSideLayout = layoutType === "left" || layoutType === "right";
  // State for showing delete popover
  const [showDeletePopover, setShowDeletePopover] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const slides = usePresentationState((s) => s.slides);
  const updateSlide = usePresentationState((s) => s.updateSlide);
  const setCurrentSlide = usePresentationState((s) => s.setCurrentSlideId);
  const openImageEditor = usePresentationState((s) => s.openImageEditor);
  // Check if editor is in read-only mode
  const readOnly = useEditorReadOnly();

  const {
    computedGen,
    computedImageUrl,
    imageStyles,
    sizeStyle,
    isDragging,
    handleRef,
    removeRootImageFromSlide,
    onResizeStop,
    updateCropSettings,
    dragId,
  } = useRootImageActions(slideId, { image, layoutType });

  const appliedSizeStyle: React.CSSProperties = useMemo(() => {
    if (typeof heightPx === "number" && heightPx > 0) {
      return {
        ...sizeStyle,
        height: heightPx,
      };
    }

    if (typeof maxHeightPx === "number" && maxHeightPx > 0) {
      return {
        ...sizeStyle,
        maxHeight: `${maxHeightPx}px`,
      };
    }
    return sizeStyle;
  }, [heightPx, maxHeightPx, sizeStyle]);

  const resolvedMaxHeight =
    typeof maxHeightPx === "number" && maxHeightPx > 0
      ? `${maxHeightPx}px`
      : undefined;

  // Ensure popover closes when delete action is invoked
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeRootImageFromSlide();
    setShowDeletePopover(false);
  };

  // Double-click handler for the image
  const handleImageDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!readOnly) {
      setCurrentSlide(slideId);
      const openChartEditor = usePresentationState.getState().openChartEditor;
      if (image.chartType) {
        openChartEditor();
      } else if (image.embedType) {
        openImageEditor("embed");
      } else {
        openImageEditor(
          image.imageSource === "search"
            ? "search"
            : image.imageSource === "gif"
              ? "gif"
              : "generate",
        );
      }
    }
  };

  const removeImage = () => {
    const { clearRootImageGeneration } = usePresentationState.getState();

    updateSlide(slideId, {
      rootImage: {
        ...image, // Preserve generic image properties if needed, or better, fetch fresh from slide if image prop is stale
        // Actually best to just spread current image and update fields
        url: undefined,
        embedType: undefined,
        imageSource: undefined,
        chartType: undefined,
        chartData: undefined,
        chartOptions: undefined,
      } as RootImageType,
    });
    if (slideId) {
      clearRootImageGeneration(slideId);
    }
  };

  const { addSlide } = useSlideOperations();

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
      case "crop":
        if (computedImageUrl) {
          setIsCropModalOpen(true);
        }
        break;
      case "card":
        // Create a new slide with the same image
        addSlide("after", slideId, {
          id: nanoid(),
          content: [], // Empty content for image slide
          rootImage: {
            ...image,
            layoutType: "none", // Reset layout for the new slide
          },
          layoutType: "none",
          isImageSlide: true,
          alignment: "center",
        });
        toast("Created new image card");
        break;
      case "background":
        updateSlideLayout("background");
        break;
      case "removeImage":
        removeImage();
        break;
      case "removeLayout":
        // Remove layout unconditionally - no URL matching needed
        const { clearRootImageGeneration } = usePresentationState.getState();

        // We need to fetch the current slide to safely omit rootImage
        // Since updateSlide does a shallow merge, we can't easily "delete" a key with it if the key is optional
        // However, rootImage is optional on PlateSlide.
        // updateSlide(slideId, { rootImage: undefined }); // This should work if updateSlide handles undefined correctly

        // Let's check usePresentationState for updateSlide implementation:
        // updateSlide: (slideId, updates, type) => { set((state) => ({ slides: state.slides.map((slide) => slide.id === slideId ? { ...slide, ...updates } : slide) })); ... }
        // Yes, standard spread. passing rootImage: undefined should work if the type allows it.
        // But to be safe and cleaner let's stick to existing pattern but optimize it slightly or just use updateSlide.
        // The previous code did: const { rootImage: _rootImage, ...rest } = slide...

        const currentSlide = slides.find((s) => s.id === slideId);
        if (currentSlide) {
          // We can't use updateSlide to *remove* a key effectively if we want to change the object structure unless we pass the whole object sans key
          // But here we can just set it to undefined if the type allows optional.
          // PlateSlide has `rootImage?: RootImage`.
          updateSlide(slideId, { rootImage: undefined });
        }

        clearRootImageGeneration(slideId);
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };

  const updateSlideLayout = (
    newLayout: "vertical" | "left" | "right" | "background",
  ) => {
    const nextSize =
      newLayout === "vertical"
        ? {
            ...image.size,
            h: image.size?.h ?? BASE_HEIGHT,
          }
        : newLayout === "left" || newLayout === "right"
          ? {
              ...image.size,
              w: image.size?.w ?? BASE_WIDTH_PERCENTAGE,
            }
          : image.size;

    updateSlide(slideId, {
      layoutType: newLayout,
      rootImage: {
        ...image,
        size: nextSize,
      } as RootImageType,
    });
  };

  // Drop handler for charts, images, and embeds - works on entire root image area
  const [
    { isOver: isChartOver, canDrop: canDropChart, isImageDrop, isEmbedDrop },
    dropRef,
  ] = useDrop<
    { element?: TElement },
    { droppedInLayoutZone: boolean },
    {
      isOver: boolean;
      canDrop: boolean;
      isImageDrop: boolean;
      isEmbedDrop: boolean;
    }
  >(
    () => ({
      accept: DRAG_ITEM_BLOCK,
      canDrop: (item: { element?: TElement }) => {
        // Accept chart, image, or media embed elements when not in read-only mode
        if (!item.element || readOnly) return false;
        // Don't accept drop if it's the same element (self-drop)
        if (item.element.id === dragId) return false;

        const isChart = isChartType(item.element.type);
        const isImage = item.element.type === "img";
        const isEmbed = item.element.type === KEYS.mediaEmbed;
        return isChart || isImage || isEmbed;
      },
      drop: (item: { element?: TElement }) => {
        if (!item.element || readOnly) return;
        // Verify again that we are not dropping the same element (redundant safe-guard)
        if (item.element.id === dragId) return { droppedInLayoutZone: true };

        const isChart = isChartType(item.element.type);
        const isImage = item.element.type === "img";
        const isEmbed = item.element.type === KEYS.mediaEmbed;

        if (isChart) {
          // Handle chart drop
          const chartType = item.element.type;
          const chartData = (item.element as unknown as { data?: unknown })
            .data;
          const chartOptions = {
            variant: (item.element as unknown as { variant?: string }).variant,
            disableAnimation: true,
          };

          // Update the slide's rootImage with the chart data
          // Update the slide's rootImage with the chart data
          updateSlide(slideId, {
            rootImage: {
              ...image,
              chartType,
              chartData,
              chartOptions,
              // Clear any existing image/embed data
              url: undefined,
              embedType: undefined,
              imageSource: undefined,
            } as RootImageType,
          });

          toast.success("Chart added to slide");
        } else if (isImage) {
          // Handle image drop - preserve chart data but show image
          const imageUrl = (item.element as unknown as { url?: string }).url;
          const imageQuery = (item.element as unknown as { query?: string })
            .query;

          // Update the slide's rootImage with the image data
          // Keep chart data preserved but hidden since URL takes precedence
          // Update the slide's rootImage with the image data
          // Keep chart data preserved but hidden since URL takes precedence
          updateSlide(slideId, {
            rootImage: {
              ...image,
              url: imageUrl,
              query: imageQuery ?? image.query ?? "", // Use existing query if new one is null
              embedType: undefined,
              imageSource: undefined,
            } as RootImageType,
          });

          toast.success("Image added to slide");
        } else if (isEmbed) {
          // Handle media embed drop
          const embedType = (item.element as unknown as { provider?: string })
            .provider;

          // Update the slide's rootImage with the embed type
          // Update the slide's rootImage with the embed type
          updateSlide(slideId, {
            rootImage: {
              ...image,
              query: image.query ?? "",
              embedType: embedType,
              url: undefined, // Clear URL so user needs to enter one
              // Clear chart data
              chartType: undefined,
              chartData: undefined,
              chartOptions: undefined,
              imageSource: undefined,
            } as RootImageType,
          });
          toast.success("Embed type set - enter a URL to display");
        }

        return { droppedInLayoutZone: true };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        isImageDrop: monitor.getItem()?.element?.type === "img",
        isEmbedDrop: monitor.getItem()?.element?.type === KEYS.mediaEmbed,
      }),
    }),
    [readOnly, slideId, image, updateSlide, dragId],
  );

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild disabled={readOnly}>
          <Resizable
            enable={{
              top: false,
              right: !readOnly && layoutType === "left",
              bottom: !readOnly && layoutType === "vertical",
              left: !readOnly && layoutType === "right",
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            size={appliedSizeStyle}
            minWidth={layoutType === "vertical" ? "100%" : "25%"}
            maxWidth={layoutType === "vertical" ? "100%" : "60%"}
            minHeight={
              layoutType !== "vertical"
                ? (resolvedMaxHeight ?? "100%")
                : heightValue !== undefined
                  ? "0px"
                  : "200px"
            }
            maxHeight={
              layoutType !== "vertical" ? resolvedMaxHeight : resolvedMaxHeight
            }
            className={cn(
              "group/resizable relative shrink-0",
              isSideLayout && "min-h-0 self-stretch",
            )}
            handleComponent={{
              right:
                !readOnly && layoutType === "left" ? (
                  <div
                    aria-label="resize-right"
                    className="h-full w-1 cursor-ew-resize rounded-sm bg-(--presentation-primary)/70 opacity-0 transition-opacity duration-150 group-hover/resizable:opacity-100"
                  />
                ) : undefined,
              left:
                !readOnly && layoutType === "right" ? (
                  <div
                    aria-label="resize-left"
                    className="h-full w-1 cursor-ew-resize rounded-sm bg-(--presentation-primary)/70 opacity-0 transition-opacity duration-150 group-hover/resizable:opacity-100"
                  />
                ) : undefined,
              bottom:
                !readOnly && layoutType === "vertical" ? (
                  <div
                    aria-label="resize-bottom"
                    className="h-1 w-full cursor-ns-resize rounded-sm bg-(--presentation-primary)/70 opacity-0 transition-opacity duration-150 group-hover/resizable:opacity-100"
                  />
                ) : undefined,
            }}
            onResizeStop={onResizeStop}
            data-root-image={slideId}
          >
            <div
              ref={(el) => {
                if (el && !readOnly) dropRef(el);
              }}
              className={cn(
                "overflow-hidden backdrop-blur-xs",
                isSideLayout ? "absolute inset-0" : "relative h-full",
                isDragging && "opacity-50",
                isChartOver && canDropChart && "ring-2 ring-primary ring-inset",
              )}
              style={{
                borderRadius: "var(--presentation-border-radius, 0.5rem)",
                boxShadow:
                  "var(--presentation-card-shadow, 0 1px 3px rgba(0,0,0,0.12))",
              }}
            >
              {/* Chart/Image/Embed drop overlay */}
              {isChartOver && canDropChart && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-primary/20 backdrop-blur-xs">
                  {isImageDrop ? (
                    <>
                      <ImageIcon className="h-12 w-12 text-primary" />
                      <p className="mt-2 text-sm font-medium text-primary">
                        Drop image here
                      </p>
                    </>
                  ) : isEmbedDrop ? (
                    <>
                      <Link className="h-12 w-12 text-primary" />
                      <p className="mt-2 text-sm font-medium text-primary">
                        Drop embed here
                      </p>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-12 w-12 text-primary" />
                      <p className="mt-2 text-sm font-medium text-primary">
                        Drop chart here
                      </p>
                    </>
                  )}
                </div>
              )}
              <div
                ref={handleRef}
                className="h-full cursor-grab active:cursor-grabbing"
              >
                {computedGen?.status === "generating" ? (
                  <div className="flex h-full flex-col items-center justify-center bg-muted/30 p-4">
                    <Spinner className="mb-2 h-8 w-8" />
                    <p className="text-sm text-muted-foreground">
                      Generating image for &quot;{image.query}&quot;...
                    </p>
                  </div>
                ) : !computedImageUrl &&
                  !image.embedType &&
                  !image.chartType ? (
                  <ImagePlaceholder
                    isStatic={false}
                    className="h-full"
                    slideId={slideId}
                    onOpenEditor={(mode: ImageEditorMode) => {
                      openImageEditor(mode);
                    }}
                  />
                ) : image.chartType && image.chartData ? (
                  <Popover
                    open={!readOnly && showDeletePopover}
                    onOpenChange={readOnly ? () => {} : setShowDeletePopover}
                  >
                    <PopoverTrigger asChild>
                      <div
                        className="relative h-full"
                        data-root-image={slideId}
                        tabIndex={0}
                        onDoubleClick={handleImageDoubleClick}
                      >
                        <ChartRenderer
                          chartType={image.chartType}
                          chartData={image.chartData}
                          chartOptions={image.chartOptions}
                          className="h-full w-full"
                        />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto p-0"
                      side="top"
                      align="center"
                    >
                      <Button
                        onClick={handleImageDoubleClick}
                        variant="ghost"
                        size="sm"
                        className="h-8"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Chart
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8"
                        onClick={handleDeleteClick}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Chart
                      </Button>
                    </PopoverContent>
                  </Popover>
                ) : image.embedType && !image.url ? (
                  // Embed type set but no URL - show placeholder for user to enter URL
                  <MediaEmbedPlaceholder
                    embedType={image.embedType}
                    className="h-full"
                    onUrlSubmit={(url: string) => {
                      // Update the slide's rootImage with the URL
                      // Update the slide's rootImage with the URL
                      updateSlide(slideId, {
                        rootImage: {
                          ...image,
                          url: url,
                        } as RootImageType,
                      });
                    }}
                  />
                ) : image.embedType && image.url ? (
                  <Popover
                    open={!readOnly && showDeletePopover}
                    onOpenChange={readOnly ? () => {} : setShowDeletePopover}
                  >
                    <PopoverTrigger asChild>
                      <div
                        className="relative h-full"
                        data-root-image={slideId}
                        tabIndex={0}
                        onDoubleClick={handleImageDoubleClick}
                      >
                        <EmbedRenderer
                          embedType={image.embedType}
                          url={image.url}
                          className="h-full w-full"
                          style={imageStyles}
                        />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto p-0"
                      side="top"
                      align="center"
                    >
                      <Button
                        onClick={handleImageDoubleClick}
                        variant="ghost"
                        size="sm"
                        className="h-8"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Embed
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8"
                        onClick={handleDeleteClick}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Embed
                      </Button>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Popover
                    open={!readOnly && showDeletePopover}
                    onOpenChange={readOnly ? () => {} : setShowDeletePopover}
                  >
                    <PopoverTrigger asChild>
                      <div
                        className="relative h-full"
                        data-root-image={slideId}
                        tabIndex={0}
                        onDoubleClick={handleImageDoubleClick}
                      >
                        {/** biome-ignore lint/performance/noImgElement: This is a valid use case */}
                        <img
                          src={computedImageUrl}
                          alt={image.query}
                          className="" // Removed h-full w-full to avoid conflicts with inline styles
                          style={{
                            ...imageStyles,
                          }} // All sizing and crop styles handled here
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              e,
                              computedImageUrl,
                            );
                          }}
                        />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto p-0"
                      side="top"
                      align="center"
                    >
                      <Button
                        onClick={handleImageDoubleClick}
                        variant="ghost"
                        size="sm"
                        className="h-8"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      {!image.url && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          onClick={handleDeleteClick}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Layout
                        </Button>
                      )}
                      {image.url && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          onClick={removeImage}
                        >
                          <ImageOff className="mr-2 h-4 w-4" />
                          Delete Image
                        </Button>
                      )}
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </Resizable>
        </ContextMenuTrigger>
        {!readOnly && (
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
            {computedImageUrl && (
              <ContextMenuItem onClick={() => handleAction("crop")}>
                <Scissors className="mr-2 h-4 w-4" />
                Crop Image
              </ContextMenuItem>
            )}
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleAction("card")}>
              <LayoutPanelLeft className="mr-2 h-4 w-4" />
              Turn into card
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Layout className="mr-2 h-4 w-4" />
                Change layout
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem onClick={() => updateSlideLayout("vertical")}>
                  <div className="mr-2 flex h-4 w-4 flex-col gap-px rounded-sm border border-foreground/50 bg-background p-px">
                    <div className="h-[6px] w-full rounded-[1px] bg-foreground/50" />
                  </div>
                  Top layout
                </ContextMenuItem>
                <ContextMenuItem onClick={() => updateSlideLayout("left")}>
                  <div className="mr-2 flex h-4 w-4 gap-px rounded-sm border border-foreground/50 bg-background p-px">
                    <div className="h-full w-[6px] rounded-[1px] bg-foreground/50" />
                  </div>
                  Left layout
                </ContextMenuItem>
                <ContextMenuItem onClick={() => updateSlideLayout("right")}>
                  <div className="mr-2 flex h-4 w-4 justify-end gap-px rounded-sm border border-foreground/50 bg-background p-px">
                    <div className="h-full w-[6px] rounded-[1px] bg-foreground/50" />
                  </div>
                  Right layout
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuItem onClick={() => handleAction("background")}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Use as card background
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => handleAction("removeImage")}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Remove image
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleAction("removeLayout")}
              className="text-red-500 focus:bg-red-50 focus:text-red-500"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove layout
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>

      {/* Crop Modal */}
      {computedImageUrl && (
        <CropModal
          open={isCropModalOpen}
          onOpenChange={setIsCropModalOpen}
          imageUrl={computedImageUrl}
          initialCropSettings={{
            objectFit: image.cropSettings?.objectFit ?? "cover",
            objectPosition: {
              x: image.cropSettings?.objectPosition?.x ?? 50,
              y: image.cropSettings?.objectPosition?.y ?? 50,
            },
            zoom: image.cropSettings?.zoom ?? 1,
          }}
          onSave={(settings: ImageCropSettings) => {
            updateCropSettings(settings);
            setIsCropModalOpen(false);
          }}
          imageDimensions={{ width: 800, height: 450, scale: 1 }}
        />
      )}
    </>
  );
}
