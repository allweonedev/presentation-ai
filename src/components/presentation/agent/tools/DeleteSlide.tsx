"use client";

import { Loader2 } from "lucide-react";

export function PresentationDeleteSlideCall({
  loading,
}: {
  loading?: boolean;
}) {
  return (
    <div
      className={
        "w-full rounded-lg border border-red-500/50 bg-card p-3" +
        (loading ? " opacity-60" : "")
      }
    >
      <div className="flex items-center gap-2 text-red-500">
        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
        <span className="text-sm text-red-500">Deleting slides...</span>
      </div>
    </div>
  );
}
