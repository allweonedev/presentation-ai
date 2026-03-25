import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { NodeApi, PathApi } from "platejs";
import { SlateElement, type SlateElementProps } from "platejs/static";
import {
  type TBulletGroupElement,
  type TBulletItemElement,
} from "../../plugins/bullet-plugin";
import { getAlignmentClasses } from "../../utils";

const bulletItemVariants = cva("", {
  variants: {
    bulletType: {
      numbered: "flex items-start",
      basic: "flex items-start",
      arrow: "flex items-start",
    },
  },
});

const bulletMarkerVariants = cva("shrink-0", {
  variants: {
    bulletType: {
      numbered:
        "flex h-12 w-12 items-center justify-center rounded-md bg-primary text-xl font-bold text-primary-foreground",
      basic:
        "mt-3 flex h-2 w-2 items-center justify-center rounded-full bg-primary",
      arrow: "mt-1 flex h-6 w-6 items-center justify-center",
    },
  },
});

// Arrow SVG component for arrow bullet type
const ArrowMarker = ({ color }: { color: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 155.139 155.139"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon
      fill={color}
      points="155.139,77.566 79.18,1.596 79.18,45.978 0,45.978 0,109.155 79.18,109.155 79.18,153.542"
    />
  </svg>
);

export function BulletItemStatic(props: SlateElementProps<TBulletItemElement>) {
  const path = props.editor.api.findPath(props.element) ?? [-1];
  const parentPath = PathApi.parent(path);
  const parentElement = NodeApi.get(
    props.editor,
    parentPath,
  ) as TBulletGroupElement;

  const bulletType = parentElement?.bulletType ?? "numbered";
  const index = path.at(-1) as number;

  // Get alignment - use item alignment if set, otherwise inherit from parent
  const itemAlignment = props.element.alignment;
  const parentAlignment = parentElement?.alignment;
  const alignment = itemAlignment ?? parentAlignment ?? "left";

  return (
    <SlateElement {...props}>
      <div className={cn("group/bullet-item relative")}>
        {/* The bullet item layout with numbered block and content */}
        <div
          className={cn(
            bulletItemVariants({ bulletType }),
            "gap-3",
            alignment === "right" && "flex-row-reverse",
          )}
        >
          {/* Bullet marker - numbered, basic dot, or arrow */}
          <div
            className={bulletMarkerVariants({ bulletType })}
            style={{
              backgroundColor:
                bulletType !== "arrow"
                  ? (parentElement?.color as string) ||
                    "var(--presentation-primary)"
                  : undefined,
              color:
                bulletType === "numbered"
                  ? "var(--presentation-background)"
                  : undefined,
            }}
          >
            {bulletType === "numbered" && index + 1}
            {bulletType === "arrow" && (
              <ArrowMarker
                color={
                  (parentElement?.color as string) ||
                  "var(--presentation-primary)"
                }
              />
            )}
          </div>

          <div className={cn("flex-1", getAlignmentClasses(alignment))}>
            {props.children}
          </div>
        </div>
      </div>
    </SlateElement>
  );
}


