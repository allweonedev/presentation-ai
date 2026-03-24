"use client";

import { ThemeBackground } from "@/components/notebook/presentation/components/theme/ThemeBackground";
import { Loader2 } from "lucide-react";

export function PresentingLoadingOverlay() {
  return (
    <ThemeBackground className="fixed inset-0 z-999999 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 px-6 py-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </ThemeBackground>
  );
}
