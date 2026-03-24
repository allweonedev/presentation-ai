"use client";

import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";
import { type TIconListItemElement } from "../../plugins/icon-list-plugin";
import { getAlignmentClasses } from "../../utils";
import {
  DEFAULT_PRESENTATION_ICON,
  PresentationIcon,
} from "../presentation-icon";

export function IconListItemStatic(
  props: SlateElementProps<TIconListItemElement>,
) {
  const { alignment = "left", icon } = props.element;
  const displayIcon = icon?.trim() || DEFAULT_PRESENTATION_ICON;

  return (
    <SlateElement {...props}>
      <div className={cn("group/icon-item relative")}>
        <div
          className={cn(
            "flex w-full items-start gap-4",
            alignment === "right" && "flex-row-reverse",
            alignment === "center" && "justify-center",
          )}
        >
          <PresentationIcon
            icon={displayIcon}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-transparent shadow-2xs"
          />

          <div className={cn("min-w-0 flex-1", getAlignmentClasses(alignment))}>
            {props.children}
          </div>
        </div>
      </div>
    </SlateElement>
  );
}
