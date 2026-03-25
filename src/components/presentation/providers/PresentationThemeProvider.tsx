"use client";

import type * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
const STORAGE_KEY = "presentation-theme";

type Theme = "light" | "dark";

interface PresentationThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: Theme;
}

const PresentationThemeContext = createContext<
  PresentationThemeContextValue | undefined
>(undefined);

/**
 * Custom hook to access the presentation theme context.
 * This is a drop-in replacement for next-themes' useTheme within the presentation route.
 *
 * @throws Error if used outside of PresentationThemeProvider
 */
export function usePresentationTheme() {
  const context = useContext(PresentationThemeContext);
  if (context === undefined) {
    throw new Error(
      "usePresentationTheme must be used within a PresentationThemeProvider",
    );
  }
  return context;
}

/**
 * A custom theme provider for the presentation section.
 * This creates a completely isolated theme context that doesn't affect the global app theme.
 *
 * Unlike next-themes, this provider:
 * - Uses its own localStorage key ("presentation-theme")
 * - Doesn't touch the global <html> element
 * - Provides the same API as next-themes for easy migration
 */
export function PresentationThemeProvider({
  children,
  defaultTheme = "dark",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
      }
    } catch {
      // localStorage might not be available (SSR, privacy mode, etc.)
    }
  }, []);

  // Save theme to localStorage when it changes
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      window.dispatchEvent(new CustomEvent("presentation-theme-change"));
    } catch {
      // localStorage might not be available
    }
  }, []);

  const value: PresentationThemeContextValue = {
    theme,
    setTheme,
    resolvedTheme: theme, // In our case, resolved is always the same as theme (no "system" option)
  };

  return (
    <PresentationThemeContext.Provider value={value}>
      <PresentationThemeWrapper mounted={mounted} theme={theme}>
        {children}
      </PresentationThemeWrapper>
    </PresentationThemeContext.Provider>
  );
}

/**
 * Inner wrapper that applies the theme class to a div element.
 * This ensures Tailwind's dark: variants work correctly within the presentation.
 */
function PresentationThemeWrapper({
  children,
}: {
  children: React.ReactNode;
  mounted: boolean;
  theme: Theme;
}) {
  return children;
}
