import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TTimelineGroupElement } from "../plugins/timeline-plugin";

export const containerVariants = cva("mb-4 flex", {
  variants: {
    orientation: {
      horizontal: "justify-around",
      vertical: "flex-col",
    },

    sidedness: {
      single: "",
      double: "",
    },
  },
});

export const lineVariants = cva("absolute transform", {
  variants: {
    orientation: {
      horizontal: "h-[2px]",
      vertical: "w-[2px]",
    },

    sidedness: {
      single: "",
      double: "",
    },
    alignment: {
      left: "",
      center: "",
      right: "",
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      sidedness: "single",
      alignment: "center",
      class: "top-5 right-0 left-0",
    },

    {
      orientation: "horizontal",
      sidedness: "single",
      class: "top-5 right-0 left-0",
      alignment: "left",
    },

    {
      orientation: "horizontal",
      sidedness: "single",
      class: "top-auto right-0 bottom-5 left-0",
      alignment: "right",
    },

    {
      orientation: "horizontal",
      sidedness: "double",
      class: "top-1/2 right-0 left-0 -translate-y-1/2",
    },
    {
      orientation: "vertical",
      sidedness: "single",
      class: "inset-y-4 left-5",
      alignment: "center",
    },

    {
      orientation: "vertical",
      sidedness: "single",
      class: "inset-y-4 left-5",
      alignment: "left",
    },

    {
      orientation: "vertical",
      sidedness: "single",
      class: "inset-y-4 right-5 left-auto",
      alignment: "right",
    },

    {
      orientation: "vertical",
      sidedness: "double",
      class: "top-0 bottom-0 left-1/2 -translate-x-1/2",
    },
  ],
});

export default function Timeline({
  element,
  children,
  ...props
}: PlateElementProps<TTimelineGroupElement>) {
  const orientation = element.orientation ?? "vertical";
  const sidedness = element.sidedness ?? "single";
  const alignment = element.alignment ?? "center";

  console.log(lineVariants({ orientation, sidedness, alignment }));
  return (
    <div>
      <div
        className={cn(lineVariants({ orientation, sidedness, alignment }))}
        style={{
          backgroundColor:
            (element.color as string) ||
            "var(--presentation-smart-layout, var(--presentation-primary))",
        }}
      />

      <PlateElement
        element={element}
        {...props}
        className={cn(
          containerVariants({ orientation, sidedness }),
          sidedness === "single" && orientation === "horizontal" && "*:flex-1",
          orientation === "horizontal" &&
            sidedness === "double" &&
            "[&>div>div>div.slate-blockWrapper]:grid [&>div>div>div.slate-blockWrapper]:grid-rows-2",
        )}
      >
        {children}
      </PlateElement>
    </div>
  );
}
