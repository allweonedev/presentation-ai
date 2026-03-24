"use client";

import { getSlidesToUpdate } from "@/hooks/presentation/agentTools";
import { CheckCircle2, Layers } from "lucide-react";
import { useMemo } from "react";

type Scope = "all" | undefined;

export function PresentationRegenerateSlideCall({
  slideIds,
  scope,
  loading,
}: {
  slideIds?: string[];
  scope?: Scope;
  loading?: boolean;
}) {
  const targetSlides = useMemo(
    () => getSlidesToUpdate(scope, slideIds),
    [scope, slideIds],
  );

  return (
    <div
      className={
        "rounded-lg border bg-card shadow-2xs transition-opacity" +
        (loading ? " opacity-60" : "")
      }
    >
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">Slides Regenerated</span>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2 text-sm">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Target:</span>
          <span className="font-medium">
            {scope === "all" || (!scope && targetSlides?.length === 0)
              ? `All slides (${targetSlides?.length ?? 0})`
              : `${targetSlides?.length ?? 0} slide${targetSlides?.length !== 1 ? "s" : ""}`}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PresentationRegenerateSlideResult({
  message,
}: {
  message?: string;
}) {
  return (
    <div className="rounded-md border bg-accent/30 p-2 text-xs">
      <div className="text-foreground">{message ?? "Slides regenerated"}</div>
    </div>
  );
}
