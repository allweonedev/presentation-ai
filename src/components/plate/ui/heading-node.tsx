"use client";

import { type PlateElementProps } from "platejs/react";

import { type VariantProps, cva } from "class-variance-authority";
import { PlateElement } from "platejs/react";

const headingVariants = cva("relative mb-1", {
  variants: {
    variant: {
      h1: "font-heading mt-[1.6em] pb-1 text-4xl font-bold",
      h2: "font-heading mt-[1.4em] pb-px text-2xl font-semibold tracking-tight",
      h3: "font-heading mt-[1em] pb-px text-xl font-semibold tracking-tight",
      h4: "font-heading mt-[0.75em] text-lg font-semibold tracking-tight",
      h5: "mt-[0.75em] text-lg font-semibold tracking-tight",
      h6: "mt-[0.75em] text-base font-semibold tracking-tight",
    },
  },
});

export function HeadingElement({
  variant = "h1",
  ...props
}: PlateElementProps & VariantProps<typeof headingVariants>) {
  return (
    <PlateElement
      as={variant!}
      className={headingVariants({ variant })}
      {...props}
    >
      {props.children}
    </PlateElement>
  );
}

export function H1Element(props: PlateElementProps) {
  return <HeadingElement variant="h1" {...props} />;
}

export function H2Element(props: PlateElementProps) {
  return <HeadingElement variant="h2" {...props} />;
}

export function H3Element(props: PlateElementProps) {
  return <HeadingElement variant="h3" {...props} />;
}

export function H4Element(props: PlateElementProps) {
  return <HeadingElement variant="h4" {...props} />;
}

export function H5Element(props: PlateElementProps) {
  return <HeadingElement variant="h5" {...props} />;
}

export function H6Element(props: PlateElementProps) {
  return <HeadingElement variant="h6" {...props} />;
}
