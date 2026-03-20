"use client";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { CheckCircle, Loader2 } from "lucide-react";

interface SaveStatusProps {
  className?: string;
}

export function SaveStatus({ className }: SaveStatusProps) {
  const savingStatus = usePresentationState((s) => s.savingStatus);

  if (savingStatus === "idle") return null;

  if (savingStatus === "saving") {
    return (
      <span
        className={cn(
          "flex animate-pulse items-center gap-1 text-sm text-muted-foreground",
          className,
        )}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      </span>
    );
  }

  if (savingStatus === "saved") {
    return (
      <span
        className={cn("flex items-center gap-1 text-sm text-green-500", className)}
      >
        <CheckCircle className="h-3.5 w-3.5" />
      </span>
    );
  }

  return null;
}
