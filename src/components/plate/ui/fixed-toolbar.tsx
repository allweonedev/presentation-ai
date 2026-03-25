"use client";

import { cn } from "@/lib/utils";

import { Toolbar } from "./toolbar";

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      {...props}
      className={cn(
        "fixed-toolbar sticky top-0 left-0 z-50 scrollbar-hide flex w-full items-center justify-between overflow-x-auto border-b border-border bg-background/95 px-2 py-0.5 backdrop-blur-xs supports-backdrop-blur:bg-background/60",
        props.className,
      )}
    />
  );
}
