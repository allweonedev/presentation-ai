import type * as React from "react";

import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const headingVariants = cva("relative mb-1", {
  variants: {
    variant: {
      h1: "pb-1 text-[3em] font-bold",
      h2: "pb-px text-[1.875em] font-semibold tracking-tight",
      h3: "pb-px text-[1.5em] font-semibold tracking-tight",
      h4: "text-[1.25em] font-semibold tracking-tight",
      h5: "text-[1.125em] font-semibold tracking-tight",
      h6: "text-[1em] font-semibold tracking-tight",
    },
  },
});

export function PresentationHeadingElementStatic({
  variant = "h1",
  ...props
}: SlateElementProps & VariantProps<typeof headingVariants>) {
  return (
    <SlateElement
      as={variant!}
      className={cn(
        "text-(--presentation-heading)",
        "[font-family:var(--presentation-heading-font)] font-bold",
        "caret-primary",
        headingVariants({ variant }),
      )}
      {...props}
    >
      {props.children}
    </SlateElement>
  );
}

export function H1ElementStatic(props: SlateElementProps) {
  return <PresentationHeadingElementStatic variant="h1" {...props} />;
}

export function H2ElementStatic(
  props: React.ComponentProps<typeof PresentationHeadingElementStatic>,
) {
  return <PresentationHeadingElementStatic variant="h2" {...props} />;
}

export function H3ElementStatic(
  props: React.ComponentProps<typeof PresentationHeadingElementStatic>,
) {
  return <PresentationHeadingElementStatic variant="h3" {...props} />;
}

export function H4ElementStatic(
  props: React.ComponentProps<typeof PresentationHeadingElementStatic>,
) {
  return <PresentationHeadingElementStatic variant="h4" {...props} />;
}

export function H5ElementStatic(
  props: React.ComponentProps<typeof PresentationHeadingElementStatic>,
) {
  return <PresentationHeadingElementStatic variant="h5" {...props} />;
}

export function H6ElementStatic(
  props: React.ComponentProps<typeof PresentationHeadingElementStatic>,
) {
  return <PresentationHeadingElementStatic variant="h6" {...props} />;
}


