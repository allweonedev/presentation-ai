"use client";

import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";
import { type TIconElement } from "../../plugins/icon-plugin";
import { PresentationIcon } from "../presentation-icon";

export function IconStatic(props: SlateElementProps<TIconElement>) {
  const { name, query } = props.element;
  const icon = name || query;

  return (
    <SlateElement
      {...props}
      className={cn("inline-flex justify-center", props.className)}
    >
      {icon ? (
        <div className="mb-2 p-2">
          <PresentationIcon
            icon={icon}
            className="flex h-10 w-10 items-center justify-center rounded-md border bg-transparent! shadow-2xs"
          />
        </div>
      ) : null}
      {props.children}
    </SlateElement>
  );
}


