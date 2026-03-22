"use client";
import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TStatsGroupElement } from "../plugins/stats-plugin";
import { columnSizeVariant, getAlignmentClasses } from "../utils";

export default function StatsGroup(
  props: PlateElementProps<TStatsGroupElement>,
) {
  const { columnSize = "sm", alignment = "left" } = props.element;

  return (
    <PlateElement {...props} className="mb-4">
      <div
        className={cn(
          "max-w-full",
          columnSizeVariant({ columnSize }),
          getAlignmentClasses(alignment),
        )}
      >
        {props.children}
      </div>
    </PlateElement>
  );
}
