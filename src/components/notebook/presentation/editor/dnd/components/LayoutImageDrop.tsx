import { type LayoutType } from "@/components/notebook/presentation/utils/parser";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { DRAG_ITEM_BLOCK } from "@platejs/dnd";
import { ImagePlugin } from "@platejs/media/react";
import { type TElement } from "platejs";
import { useEditorRef, type PlateEditor } from "platejs/react";
import { useRef } from "react";
import { useDrop } from "react-dnd";
import { isChartType } from "../../lib";

function removeNodeById(editor: PlateEditor, element: TElement) {
  const path = editor.api.findPath(element);

  if (!path) return;
  editor.tf.removeNodes({ at: path });
  return element;
}

export default function LayoutImageDrop({ slideId }: { slideId: string }) {
  // Create drop zones for top, left, and right
  const topRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const editor = useEditorRef();
  const isReorderingSlides = usePresentationState((s) => s.isReorderingSlides);

  // Check if element is image or chart
  const canDropElement = (item: { element: TElement }) => {
    if (!item?.element) return false;
    return (
      item.element.type === ImagePlugin.key || isChartType(item.element.type)
    );
  };

  const handleDrop = (item: { element: TElement }, layoutType: LayoutType) => {
    if (!item?.element) return;

    const elementType = item.element.type;
    const isImage = elementType === ImagePlugin.key;
    const isChart = isChartType(elementType);

    if (!isImage && !isChart) return;

    // Get the current slides state
    const { slides, setSlides, setCurrentSlideId } =
      usePresentationState.getState();

    if (isImage) {
      // Handle image drop
      let imageUrl = item.element.url as string;
      let imageQuery = item.element.query as string;

      // Check if the image is from the editor and needs to be removed
      const element = removeNodeById(editor, item.element);
      if (element?.url) imageUrl = element.url as string;
      if (element?.query) imageQuery = element.query as string;

      // Update the slides array with the new root image and layout type
      // When dropping an image, we keep any existing chart data but set the image URL
      // This allows restoring the chart later if needed
      const updatedSlides = slides.map((slide) => {
        if (slide.id === slideId) {
          const existingRootImage = slide.rootImage;
          return {
            ...slide,
            rootImage: {
              ...existingRootImage,
              url: imageUrl,
              query: imageQuery,
              imageSource: undefined,
              embedType: undefined,
              // Keep chartType, chartData, chartOptions but they won't be shown since url is set
              // Reset size when layout changes so default dimensions are used
              size: undefined,
            },
            layoutType: layoutType,
          };
        }
        return slide;
      });

      setSlides(updatedSlides);
      setCurrentSlideId(slideId);
    } else if (isChart) {
      // Handle chart drop
      const chartType = item.element.type;
      const chartData = (item.element as unknown as { data?: unknown }).data;
      const chartOptions = {
        variant: (item.element as unknown as { variant?: string }).variant,
        disableAnimation: true,
      };

      // Remove the chart element from its original position
      removeNodeById(editor, item.element);

      // Update the slides array with the chart data
      const updatedSlides = slides.map((slide) => {
        if (slide.id === slideId) {
          return {
            ...slide,
            rootImage: {
              ...slide.rootImage,
              chartType,
              chartData,
              chartOptions,
              // Clear any existing image/embed data
              url: undefined,
              embedType: undefined,
              imageSource: undefined,
              query: slide.rootImage?.query ?? "",
              // Reset size when layout changes so default dimensions are used
              size: undefined,
            },
            layoutType: layoutType,
          };
        }
        return slide;
      });

      setSlides(updatedSlides);
      setCurrentSlideId(slideId);
    }
  };

  // Setup drop zones
  const [{ isTopOver }, dropTop] = useDrop({
    accept: [DRAG_ITEM_BLOCK],
    canDrop: (item: { element: TElement }) =>
      !isReorderingSlides && canDropElement(item),
    drop: (item) => {
      handleDrop(item, "vertical");
      return { droppedInLayoutZone: true };
    },
    collect: (monitor) => {
      return {
        isTopOver: monitor.isOver() && monitor.canDrop(),
      };
    },
  });

  const [{ isLeftOver }, dropLeft] = useDrop({
    accept: [DRAG_ITEM_BLOCK],
    canDrop: (item: { element: TElement }) =>
      !isReorderingSlides && canDropElement(item),
    drop: (item) => {
      handleDrop(item, "left");
      return { droppedInLayoutZone: true };
    },
    collect: (monitor) => ({
      isLeftOver: monitor.isOver() && monitor.canDrop(),
    }),
  });

  const [{ isRightOver }, dropRight] = useDrop({
    accept: [DRAG_ITEM_BLOCK],
    canDrop: (item: { element: TElement }) =>
      !isReorderingSlides && canDropElement(item),
    drop: (item) => {
      handleDrop(item, "right");
      return { droppedInLayoutZone: true };
    },
    collect: (monitor) => ({
      isRightOver: monitor.isOver() && monitor.canDrop(),
    }),
  });
  // Connect the drop refs
  dropTop(topRef);
  dropLeft(leftRef);
  dropRight(rightRef);

  return (
    <>
      {/* Top drop zone */}
      <div
        ref={topRef}
        className={cn(
          "absolute top-0 right-0 left-0 z-99999 h-12",
          isTopOver ? "bg-primary/20" : "bg-transparent",
          "transition-colors duration-200",
        )}
      />

      {/* Left drop zone */}
      <div
        ref={leftRef}
        className={cn(
          "absolute top-16 bottom-0 left-0 z-99999 w-8",
          isLeftOver ? "bg-primary/20" : "bg-transparent",
          "transition-colors duration-200",
        )}
      />

      {/* Right drop zone */}
      <div
        ref={rightRef}
        className={cn(
          "absolute top-16 right-0 bottom-0 z-99999 w-8",
          isRightOver ? "bg-primary/20" : "bg-transparent",
          "transition-colors duration-200",
        )}
      />
    </>
  );
}
