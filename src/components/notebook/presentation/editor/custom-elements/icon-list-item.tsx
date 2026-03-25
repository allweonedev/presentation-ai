"use client";

import { IconPicker } from "@/components/ui/icon-picker";
import { cn } from "@/lib/utils";
import { NodeApi, PathApi } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { DEFAULT_PRESENTATION_ICON } from "./presentation-icon";
import { type TIconListItemElement } from "../plugins/icon-list-plugin";
import { getAlignmentClasses } from "../utils";

// IconItem component for individual items in the icons list
export const IconListElement = (
  props: PlateElementProps<TIconListItemElement>,
) => {
  const parentPath = PathApi.parent(props.path);
  const parentElement = NodeApi.get(props.editor, parentPath);
  const { alignment = "left" } = parentElement as {
    alignment?: "left" | "center" | "right";
  };
  const { icon } = props.element;
  const displayIcon = icon?.trim() || DEFAULT_PRESENTATION_ICON;

  const handleIconSelect = (iconName: string) => {
    const itemPath = props.editor.api.findPath(props.element);
    if (!itemPath) return;
    props.editor.tf.setNodes({ icon: iconName }, { at: itemPath });
  };

  return (
    <PlateElement {...props}>
      <div className={cn("group/icon-item relative w-full")}>
        <div
          className={cn(
            "flex w-full items-start gap-4",
            alignment === "right" && "flex-row-reverse",
            alignment === "center" && "justify-center",
          )}
        >
          <div className="shrink-0 pt-1" data-decor="true">
            <IconPicker
              defaultIcon={DEFAULT_PRESENTATION_ICON}
              searchTerm={displayIcon}
              onIconSelect={(iconName) => handleIconSelect(iconName)}
              className="bg-transparent! shadow-none"
              size="md"
            />
          </div>

          <div className={cn("min-w-0 flex-1", getAlignmentClasses(alignment))}>
            {props.children}
          </div>
        </div>
      </div>
    </PlateElement>
  );
};
