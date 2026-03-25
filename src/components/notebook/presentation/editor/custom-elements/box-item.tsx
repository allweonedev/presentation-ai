"use client";

import { IconPicker } from "@/components/ui/icon-picker";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { NodeApi, PathApi } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";
import {
  type TBoxGroupElement,
  type TBoxItemElement,
} from "../plugins/box-plugin";
import { getAlignmentClasses } from "../utils";

const boxItemVariants = cva(
  "w-full border p-4 transition-(--presentation-transition)",
  {
    variants: {
      boxType: {
        outline:
          "border-2 border-(--presentation-card-background) bg-transparent",
        icon: "bg-opacity-60 gap-3 bg-(--presentation-card-background)",
        solid: "bg-opacity-100 border-0 bg-(--presentation-card-background)",
        sideline:
          "border-t border-r border-b border-l-5 border-y-primary border-r-primary border-l-(--presentation-card-background)",
        joined: "rounded-none!",
        leaf: "rounded-none rounded-tl-lg! rounded-br-lg!",
      },
    },
  },
);

export const BoxItem = (props: PlateElementProps<TBoxItemElement>) => {
  // Get parent element for color and variant information
  const parentPath = PathApi.parent(props.path);
  const parentElement = NodeApi.get(
    props.editor,
    parentPath,
  ) as TBoxGroupElement;

  const boxType = parentElement?.boxType ?? "solid";
  const { icon } = props.element as unknown as { icon?: string };

  // Get alignment - use item alignment if set, otherwise inherit from parent
  const itemAlignment = props.element.alignment;
  const parentAlignment = parentElement?.alignment;
  const alignment = itemAlignment ?? parentAlignment ?? "left";

  const handleIconSelect = (iconName: string) => {
    const itemPath = props.editor.api.findPath(props.element);
    if (!itemPath) return;
    props.editor.tf.setNodes({ icon: iconName }, { at: itemPath });
  };

  return (
    <div
      className={cn(
        boxItemVariants({ boxType }),
        "grid h-full w-full",
        boxType === "icon"
          ? "grid-flow-row gap-2"
          : "auto-cols-fr grid-flow-col gap-4",
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
        <IconPicker
          disabled={false}
          defaultIcon={icon}
          onIconSelect={(name) => handleIconSelect(name)}
          className="shadow-none disabled:opacity-100"
          size="md"
          style={{
            backgroundColor: "transparent",
            borderColor: "transparent",
          }}
        />
      )}
      <PlateElement
        {...props}
        className={cn("w-full", getAlignmentClasses(alignment))}
      >
        {props.children}
      </PlateElement>
    </div>
  );
};
