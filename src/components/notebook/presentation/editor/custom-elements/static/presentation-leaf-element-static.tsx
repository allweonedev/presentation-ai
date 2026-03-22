import { type SlateLeafProps, SlateLeaf } from "platejs/static";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

export interface PresentationLeafElementStaticProps {
  className?: string;
  variant?: "primary" | "secondary" | "text" | "heading";
  children?: React.ReactNode;
  [key: string]: unknown;
}

const caretVariant = cva("bg-transparent caret-primary", {
  variants: {
    variant: {
      primary: "text-(--presentation-primary)",
      secondary: "text-(--presentation-secondary)",
      text: "[font-family:var(--presentation-body-font)] text-(--presentation-text) caret-primary",
      heading:
        "[font-family:var(--presentation-heading-font)] font-bold text-(--presentation-heading) caret-primary",
    },
  },
});

export function PresentationLeafElementStatic({
  className,
  variant = "text",
  children,
  ...props
}: SlateLeafProps & PresentationLeafElementStaticProps) {
  return (
    <SlateLeaf className={cn(caretVariant({ variant }), className)} {...props}>
      {children}
    </SlateLeaf>
  );
}


