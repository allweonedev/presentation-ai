import { NodeApi, PathApi } from "platejs";
import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";
import { type TPyramidGroupElement } from "../../plugins/pyramid-plugin";

export function PyramidItemStatic(props: SlateElementProps) {
  const path = props.editor.api.findPath(props.element) ?? [-1];
  const parentPath = PathApi.parent(path);
  const parentElement = NodeApi.get(
    props.editor,
    parentPath,
  ) as TPyramidGroupElement;

  const totalItems = parentElement?.children?.length || 1;
  const index = (path?.at(-1) as number) ?? 0;
  const isFunnel = (parentElement as unknown as { isFunnel?: boolean })
    ?.isFunnel;

  const shapeHeight = 80;
  const maxWidthPercentage = 80;
  const increment = maxWidthPercentage / (2 * totalItems);

  const calculateClipPath = () => {
    if (isFunnel) {
      if (index === 0) {
        const currentXOffset = increment * (totalItems - index);
        const currentLeft = 50 - currentXOffset;
        const currentRight = 50 + currentXOffset;

        const nextXOffset = increment * (totalItems - index - 1);
        const nextLeft = 50 - nextXOffset;
        const nextRight = 50 + nextXOffset;

        return `polygon(${currentLeft}% 0%, ${currentRight}% 0%, ${nextRight}% 100%, ${nextLeft}% 100%)`;
      } else if (index === totalItems - 1) {
        const prevXOffset = increment * (totalItems - index);
        const prevLeft = 50 - prevXOffset;
        const prevRight = 50 + prevXOffset;

        return `polygon(${prevLeft}% 0%, ${prevRight}% 0%, 50% 100%)`;
      } else {
        const currentXOffset = increment * (totalItems - index);
        const currentLeft = 50 - currentXOffset;
        const currentRight = 50 + currentXOffset;

        const nextXOffset = increment * (totalItems - index - 1);
        const nextLeft = 50 - nextXOffset;
        const nextRight = 50 + nextXOffset;

        return `polygon(${currentLeft}% 0%, ${currentRight}% 0%, ${nextRight}% 100%, ${nextLeft}% 100%)`;
      }
    } else {
      if (index === 0) {
        return `polygon(50% 0%, ${50 - increment}% 100%, ${50 + increment}% 100%)`;
      } else {
        const prevXOffset = increment * index;
        const currentXOffset = increment * (index + 1);
        const prevBottomLeft = 50 - prevXOffset;
        const prevBottomRight = 50 + prevXOffset;
        const currentBottomLeft = 50 - currentXOffset;
        const currentBottomRight = 50 + currentXOffset;
        return `polygon(${prevBottomLeft}% 0%, ${prevBottomRight}% 0%, ${currentBottomRight}% 100%, ${currentBottomLeft}% 100%)`;
      }
    }
  };

  const calculateLeftOffset = () => {
    if (isFunnel) {
      return 40 - (totalItems - (index + 1)) * increment;
    }
    return 40 - (index + 1) * increment;
  };

  const clipPath = calculateClipPath();

  return (
    <div className={cn("group/pyramid-item relative h-full w-full")}>
      <div className="grid h-full auto-cols-fr grid-flow-col items-center">
        <div className="relative flex-1">
          <div
            className="grid place-items-center text-2xl font-bold"
            style={{
              height: `${shapeHeight}px`,
              clipPath: clipPath as unknown as string,
              backgroundColor:
                (parentElement?.color as string) ||
                "var(--presentation-smart-layout)",
              color: "var(--presentation-background)",
            }}
          >
            {index + 1}
          </div>
        </div>
        <div
          className="relative flex h-full flex-1 items-center border-b border-gray-700"
          style={{
            right: `calc(${calculateLeftOffset()}% + 34px)`,
            paddingLeft: isFunnel ? `2.5rem` : `0`,
          }}
        >
          <SlateElement {...props}>{props.children}</SlateElement>
        </div>
      </div>
    </div>
  );
}


