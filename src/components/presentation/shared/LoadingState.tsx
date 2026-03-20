"use client";

import { ThemeBackground } from "@/components/notebook/presentation/components/theme/ThemeBackground";
import { Spinner } from "@/components/ui/spinner";
import { usePresentationTheme } from "../providers/PresentationThemeProvider";

export function LoadingState() {
  const { resolvedTheme } = usePresentationTheme();
  return (
    <ThemeBackground
      themeOverride={resolvedTheme === "dark" ? "ebony" : "mystique"}
    >
      <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
        <div className="relative">
          <Spinner className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Loading Presentation</h2>
          <p className="text-muted-foreground">Getting your slides ready...</p>
        </div>
      </div>
    </ThemeBackground>
  );
}
