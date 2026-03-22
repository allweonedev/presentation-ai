import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";

export function PresentationElementStatic(props: SlateElementProps) {
  return (
    <SlateElement
      {...props}
      className={cn(
        "relative transition-all duration-300 select-text!",
        props.className,
      )}
    >
      {props.children}
    </SlateElement>
  );
}


