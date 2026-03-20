"use client";

import { applyThemeToSyntax } from "@/components/notebook/presentation/editor/utils/infographic-utils";
import { usePresentationTheme } from "@/components/presentation/providers/PresentationThemeProvider";
import { useMemo } from "react";

export function useAntvInfographicTheme(syntax?: string) {
  const { resolvedTheme } = usePresentationTheme();
  const isDark = resolvedTheme === "dark";

  const themedSyntax = useMemo(() => {
    return applyThemeToSyntax(syntax ?? "", isDark);
  }, [syntax, isDark]);

  return { isDark, themedSyntax };
}
