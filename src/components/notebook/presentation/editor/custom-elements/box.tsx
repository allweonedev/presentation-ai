"use client";
import { cn } from "@/lib/utils";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TBoxGroupElement } from "../plugins/box-plugin";
import { columnSizeVariant } from "../utils";

export default function BoxGroup(props: PlateElementProps<TBoxGroupElement>) {
  const { columnSize = "sm", boxType = "solid" } = props.element;

  return (
    <PlateElement {...props} className="mb-4">
      <div
        className={cn(
          "max-w-full",
          columnSizeVariant({ columnSize }),
          boxType === "joined" ? "" : "gap-4",
        )}
      >
        {props.children}
      </div>
    </PlateElement>
  );
}
