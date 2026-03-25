import { NodeApi, PathApi } from "platejs";
import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { type TStairGroupElement } from "../../plugins/staircase-plugin";

export function StairItemStatic(props: SlateElementProps) {
  const path = props.editor.api.findPath(props.element) ?? [-1];
  const parentPath = PathApi.parent(path);
  const parentElement = NodeApi.get(
    props.editor,
    parentPath,
  ) as TStairGroupElement;

  const totalItems = parentElement?.children?.length || 1;
  const index = (path?.at(-1) as number) ?? 0;

  // Refs and state for dynamic height
  const containerRef = useRef<HTMLDivElement>(null);
  const [blockHeight, setBlockHeight] = useState(70);

  // ResizeObserver to dynamically adjust height based on container height
  useEffect(() => {
    if (!containerRef.current) return;

    const updateHeight = () => {
      const containerHeight = containerRef.current?.offsetHeight ?? 70;
      setBlockHeight(Math.max(containerHeight, 70));
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Calculate a width ramp similar to non-static design, but driven by totalItems
  const baseWidth = 70;
  const maxWidth = 220;
  const increment = (maxWidth - baseWidth) / (totalItems - 1 || 1);
  const widthPx = baseWidth + index * increment;

  return (
    <div className={cn("group/stair-item relative mb-2 w-full")}>
      <div className="flex items-center gap-4 border-b border-gray-700">
        {/* Width-growing block with number */}
        <div
          style={{
            width: `${widthPx}px`,
            height: `${blockHeight}px`,
            backgroundColor:
              (parentElement?.color as string) ||
              "var(--presentation-smart-layout)",
            color: "var(--presentation-background)",
          }}
          className="flex shrink-0 items-center justify-center rounded-md text-2xl font-bold"
        >
          {index + 1}
        </div>

        <SlateElement
          ref={containerRef}
          className="flex flex-1 items-center"
          {...props}
        >
          {props.children}
        </SlateElement>
      </div>
    </div>
  );
}


