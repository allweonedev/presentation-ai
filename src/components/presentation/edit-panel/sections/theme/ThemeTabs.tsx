"use client";

import { cn } from "@/lib/utils";
import { useThemePanelState } from "./theme-panel-state";

export function ThemeTabs() {
  const { tab, setTab } = useThemePanelState();

  const handleTabChange = (tab: "standard" | "public") => {
    setTab(tab);
  };

  return (
    <div className="px-2">
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        <button
          onClick={() => handleTabChange("standard")}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            tab === "standard"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          ALLWEONE
        </button>
        <button
          onClick={() => handleTabChange("public")}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            tab === "public"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Explore
        </button>
      </div>
    </div>
  );
}
