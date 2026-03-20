"use client";

import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Brain } from "./icons";
import { TextShimmer } from "./text-shimmer";

interface AILoadingLabelProps {
  label?: string;
  icon?: ReactNode;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  duration?: number;
  spread?: number;
}

export function AILoadingLabel({
  label = "AI is thinking",
  icon,
  className,
  iconClassName,
  textClassName,
  duration = 1.6,
  spread = 2.25,
}: AILoadingLabelProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <span
        className={cn("flex shrink-0 items-center justify-center", iconClassName)}
      >
        {icon ?? <Brain className="h-4 w-4 animate-pulse text-primary" />}
      </span>
      <TextShimmer
        as="span"
        duration={duration}
        spread={spread}
        className={cn(
          "font-semibold [--base-color:hsl(var(--muted-foreground))] [--base-gradient-color:hsl(var(--primary))] dark:[--base-color:hsl(var(--muted-foreground))] dark:[--base-gradient-color:hsl(var(--foreground))]",
          textClassName,
        )}
      >
        {label}
      </TextShimmer>
    </div>
  );
}
