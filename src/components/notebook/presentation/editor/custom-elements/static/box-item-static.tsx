import { IconPicker } from "@/components/ui/icon-picker";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { NodeApi, PathApi } from "platejs";
import { SlateElement, type SlateElementProps } from "platejs/static";
import {
  type TBoxGroupElement,
  type TBoxItemElement,
} from "../../plugins/box-plugin";
import { getAlignmentClasses } from "../../utils";

const boxItemVariants = cva(
  "border p-4 transition-(--presentation-transition)",
  {
    variants: {
      boxType: {
        outline:
          "border-2 border-(--presentation-card-background) bg-transparent",
        icon: "bg-opacity-60 flex items-center gap-3 bg-(--presentation-card-background)",
        solid: "bg-opacity-100 border-0 bg-(--presentation-card-background)",
        sideline:
          "border-t border-r border-b border-l-5 border-y-primary border-r-primary border-l-(--presentation-card-background)",
        joined: "rounded-none!",
        leaf: "rounded-none rounded-tl-lg! rounded-br-lg!",
      },
    },
  },
);

export function BoxItemStatic(props: SlateElementProps<TBoxItemElement>) {
  const { editor, element } = props;
  const path = editor.api.findPath(element) ?? [-1];
  const parentPath = PathApi.parent(path);
  const parentElement = NodeApi.get(editor, parentPath) as TBoxGroupElement;

  const boxType = parentElement?.boxType ?? "solid";
  const { icon } = element as unknown as { icon?: string };

  // Get alignment - use item alignment if set, otherwise inherit from parent
  const itemAlignment = element.alignment;
  const parentAlignment = parentElement?.alignment;
  const alignment = itemAlignment ?? parentAlignment ?? "left";

  return (
    <SlateElement {...props}>
      <div
        className={cn(
          boxItemVariants({
            boxType: boxType as
              | "outline"
              | "icon"
              | "solid"
              | "sideline"
              | "joined"
              | "leaf",
          }),
          "grid h-full",
          boxType === "icon"
            ? "grid-flow-row gap-2"
            : "auto-cols-fr grid-flow-col gap-4",
          "[&_:is(.presentation-heading)]:[-webkit-background-clip:unset!important;]",
          "[&_:is(.presentation-heading)]:[-webkit-text-fill-color:unset!important;]",
          "[&_:is(.presentation-heading)]:[background-clip:unset!important;]",
          "[&_:is(.presentation-heading)]:[background:none!important;]",
          "[&_:is(.presentation-heading)]:text-primary!",
        )}
        data-bg-export="true"
        style={{
          backgroundColor: (parentElement?.color as string) || undefined,
          borderColor: (parentElement?.color as string) || undefined,
          color: (parentElement?.color as string) || undefined,
          borderRadius:
            boxType !== "joined" && boxType !== "leaf"
              ? "var(--presentation-card-border-radius, 0.5rem)"
              : undefined,
          boxShadow:
            boxType === "solid"
              ? "var(--presentation-card-shadow, 0 1px 3px rgba(0,0,0,0.12))"
              : undefined,
        }}
      >
        {boxType === "icon" && (
          <div
            className="flex h-8 w-8 items-center justify-center shadow-none disabled:opacity-100"
            style={{
              backgroundColor: "transparent",
              borderColor: "transparent",
            }}
          >
            <IconPicker
              defaultIcon={icon}
              disabled={false}
              onIconSelect={(_name) => {}}
              className="h-8 w-8"
            />
          </div>
        )}
        <div className={cn("w-max max-w-full", getAlignmentClasses(alignment))}>
          {props.children}
        </div>
      </div>
    </SlateElement>
  );
}

