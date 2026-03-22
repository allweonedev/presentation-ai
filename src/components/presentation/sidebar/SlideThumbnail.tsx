import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import { getSlideBaseWidth } from "@/config/slideFormats";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
interface SlideThumbnailProps {
  index: number;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  widthSize?: "S" | "M" | "L";
  containerWidth?: number;
  formatCategory?: PlateSlide["formatCategory"];
  aspectRatio?: PlateSlide["aspectRatio"];
}

export function SlideThumbnail({
  index,
  isActive,
  onClick,
  children,
  widthSize = "M",
  containerWidth,
  formatCategory = "presentation",
  aspectRatio = { type: "fluid", value: "" },
}: SlideThumbnailProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.2);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const unscaledHeightRef = useRef<number>(0);
  const lastContainerWidthRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;
    const container = containerRef.current;
    const content = contentRef.current;
    const slideBaseWidth = getSlideBaseWidth(
      formatCategory,
      widthSize,
      aspectRatio,
    );

    // Compute scale from container width to logical slide width
    const commitScaleAndHeight = (containerWidth: number) => {
      const newScale =
        containerWidth > 0 ? containerWidth / slideBaseWidth : 0.2;
      if (Math.abs(newScale - scale) > 0.005) {
        setScale(newScale);
      }
      const nextHeight = Math.max(
        0,
        Math.ceil(unscaledHeightRef.current * newScale),
      );
      if (
        (height ?? 0) === 0 ||
        (Number.isFinite(nextHeight) &&
          Math.abs((height ?? 0) - nextHeight) > 0)
      ) {
        setHeight(nextHeight > 0 ? nextHeight : undefined);
      }
    };

    const scheduleScaleFromCurrentWidth = () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const effectiveWidth =
          typeof containerWidth === "number" && containerWidth > 0
            ? containerWidth
            : container.clientWidth;
        commitScaleAndHeight(effectiveWidth);
      });
    };

    // Measure unscaled content height (transform does not affect layout metrics)
    const updateUnscaledHeight = () => {
      // offsetHeight is unscaled even if a CSS transform is applied on this node
      const h = content.offsetHeight || 0;
      if (h !== unscaledHeightRef.current) {
        unscaledHeightRef.current = h;
        // When content height changes, recompute scaled height (width unchanged)
        scheduleScaleFromCurrentWidth();
      }
    };

    // Drive width updates from prop (sidebar width) and window resize only to avoid RO ping-pong
    lastContainerWidthRef.current =
      typeof containerWidth === "number" && containerWidth > 0
        ? containerWidth
        : container.clientWidth;

    const contentRO = new ResizeObserver(updateUnscaledHeight);
    contentRO.observe(content);

    // Initial measurements
    updateUnscaledHeight();
    scheduleScaleFromCurrentWidth();

    const onWindowResize = () => scheduleScaleFromCurrentWidth();
    window.addEventListener("resize", onWindowResize);

    return () => {
      contentRO.disconnect();
      window.removeEventListener("resize", onWindowResize);
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [widthSize, containerWidth, formatCategory, aspectRatio]);

  // Ensure recompute when only aspect changes (minHeight change without width change)
  // This complements the RO by force-refreshing scale/height on aspectSignature updates.
  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;
    const container = containerRef.current;
    const content = contentRef.current;
    const slideBaseWidth = getSlideBaseWidth(
      formatCategory,
      widthSize,
      aspectRatio,
    );

    const effectiveWidth =
      typeof containerWidth === "number" && containerWidth > 0
        ? containerWidth
        : container.clientWidth;

    const newScale = effectiveWidth > 0 ? effectiveWidth / slideBaseWidth : 0.2;
    setScale(newScale);
    const h = content.offsetHeight || 0;
    const nextHeight = Math.max(0, Math.ceil(h * newScale));
    setHeight(nextHeight > 0 ? nextHeight : undefined);
  }, [widthSize, containerWidth, formatCategory, aspectRatio]);

  return (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-md border transition-all hover:border-primary",
        isActive ? "border-primary ring-1 ring-primary" : "border-muted",
      )}
      onClick={onClick}
    >
      <div className="absolute top-1 left-2 z-10 rounded-sm bg-muted px-1 py-0.5 text-xs font-medium text-muted-foreground">
        {index + 1}
      </div>
      <div
        ref={containerRef}
        className="pointer-events-none w-full overflow-hidden bg-card"
        style={{
          height: height ?? undefined,
          // aspectRatio: height === undefined ? "16/9" : undefined,
          transition: "height 150ms ease-in-out",
        }}
      >
        <div
          ref={contentRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: getSlideBaseWidth(formatCategory, widthSize, aspectRatio),
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
