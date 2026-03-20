"use client";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { NodeApi, PathApi } from "platejs";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TTimelineGroupElement } from "../plugins/timeline-plugin";
import { getAlignmentClasses } from "../utils";

export const containerVariants = cva("flex flex-1", {
  variants: {
    orientation: {
      horizontal: "items-center p-4 pt-0",
      vertical: "items-center p-4 pl-0",
    },
    sidedness: {
      single: "",
      double: "",
    },
    isEven: {
      true: "",
      false: "",
    },
    showLine: {
      true: "gap-6",
      false: "gap-4",
    },
    alignment: {
      left: "",
      center: "",
      right: "",
    },
  },
  compoundVariants: [
    {
      sidedness: "single",
      alignment: "left",
      orientation: "horizontal",
      class: "p-4 pt-0",
    },
    {
      sidedness: "single",
      alignment: "right",
      orientation: "horizontal",
      class: "p-4 pb-0",
    },
    {
      sidedness: "single",
      alignment: "left",
      orientation: "vertical",
      class: "p-4 pl-0",
    },
    {
      sidedness: "single",
      alignment: "right",
      orientation: "vertical",
      class: "p-4 pr-0",
    },
    {
      orientation: "horizontal",
      sidedness: "single",
      class: "flex-col",
    },

    {
      orientation: "horizontal",
      sidedness: "double",
      isEven: true,
      class: "row-start-2 h-[calc(100%+2.25rem)] flex-col self-end pt-4",
    },
    {
      orientation: "horizontal",
      sidedness: "double",
      isEven: false,
      class: "row-start-1 h-[calc(100%+2rem)] flex-col-reverse self-start pt-4",
    },

    {
      orientation: "vertical",
      sidedness: "double",
      isEven: true,
      class: "w-[calc(50%+2.25rem)] place-self-end pl-4",
    },
    {
      orientation: "vertical",
      sidedness: "double",
      isEven: false,
      class: "w-[calc(50%+2.25rem)] flex-row-reverse place-self-start pl-4",
    },
  ],
});

export const circleVariants = cva(
  "relative flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-1 ring-(--ring-color) ring-offset-2",
  {
    variants: {
      orientation: {
        horizontal: "",
        vertical: "",
      },
      sidedness: {
        single: "",
        double: "",
      },
    },
  },
);

export const lineVariants = cva("", {
  variants: {
    orientation: {
      horizontal: "",
      vertical: "",
    },
    sidedness: {
      single: "",
      double: "",
    },
    showLine: {
      true: "before:absolute before:z-50 before:rounded-full before:bg-(--before-bg) before:content-['']",
      false: "",
    },
    isEven: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      showLine: true,
      class:
        "before:top-1/2 before:left-1/2 before:h-1/2 before:w-[2px] before:-translate-x-1/2 before:translate-y-full",
    },

    {
      orientation: "horizontal",
      sidedness: "double",
      showLine: true,
      isEven: false,
      class:
        "before:top-0 before:left-1/2 before:h-1/2 before:w-[2px] before:-translate-x-1/2 before:-translate-y-full",
    },

    {
      orientation: "vertical",
      showLine: true,
      class:
        "before:top-1/2 before:left-1/2 before:h-[2px] before:w-1/2 before:translate-x-full before:-translate-y-1/2",
    },

    {
      orientation: "vertical",
      sidedness: "double",
      showLine: true,
      isEven: false,
      class:
        "before:top-1/2 before:left-0 before:h-[2px] before:w-1/2 before:-translate-x-full before:-translate-y-1/2",
    },
  ],
});

export const contentVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "flex-col",
    },
    sidedness: {
      single: "",
      double: "",
    },
  },
});

export function TimelineItem(props: PlateElementProps) {
  const parentPath = PathApi.parent(props.path);
  const parentElement = NodeApi.get(
    props.editor,
    parentPath,
  ) as TTimelineGroupElement;
  const orientation = parentElement.orientation ?? "vertical";
  const sidedness = parentElement.sidedness ?? "single";
  const showLine = parentElement.showLine ?? true;
  const numbered = parentElement.numbered ?? true;
  const index = props.path.at(-1) ?? 0;
  const itemNumber = index + 1;
  const isEven = itemNumber % 2 === 0;

  const lineClass = lineVariants({ orientation, sidedness, showLine, isEven });
  const alignment = parentElement.alignment ?? "left";
  return (
    //* Container
    <div
      className={cn(
        containerVariants({
          orientation,
          sidedness,
          isEven,
          showLine,
          alignment,
        }),
        sidedness === "single" &&
          alignment === "left" &&
          orientation === "horizontal" &&
          "flex-col",
        sidedness === "single" &&
          alignment === "right" &&
          orientation === "horizontal" &&
          "flex-col-reverse",
        sidedness === "single" &&
          alignment === "left" &&
          orientation === "vertical" &&
          "flex-row",
        sidedness === "single" &&
          alignment === "right" &&
          orientation === "vertical" &&
          "flex-row-reverse",
      )}
    >
      {/* Circle */}
      <div
        className={cn(
          circleVariants({ orientation, sidedness }),
          lineClass,
          sidedness === "single" && alignment === "right" && "rotate-180",
        )}
        style={
          {
            backgroundColor:
              (parentElement.color as string) ||
              "var(--presentation-smart-layout, var(--presentation-primary))",
            color: "var(--presentation-background)",
            "--ring-color":
              (parentElement.color as string) ||
              "var(--presentation-smart-layout, var(--presentation-primary))",
            "--before-bg":
              (parentElement.color as string) ||
              "var(--presentation-smart-layout, var(--presentation-primary))",
          } as React.CSSProperties & {
            "--ring-color": string;
            "--before-bg": string;
          }
        }
      >
        <span
          className={cn(
            sidedness === "single" && alignment === "right" && "rotate-180",
          )}
        >
          {numbered ? itemNumber : ""}
        </span>
      </div>
      {/* Content */}
      <PlateElement
        className={cn(
          "max-w-full",
          contentVariants({ orientation, sidedness }),
          getAlignmentClasses(alignment),
        )}
        {...props}
      >
        {props.children}
      </PlateElement>
    </div>
  );
}
