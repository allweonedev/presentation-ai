"use client";

import { CreateThemeModal } from "@/components/notebook/presentation/components/theme/create-theme/CreateThemeModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { Star, X } from "lucide-react";
import { useThemePanelState } from "./theme-panel-state";

export function ThemePanelHeader() {
  const { showFavorites, setShowFavorites, setOpenCreateThemeModal } =
    useThemePanelState();
  const setActiveRightPanel = usePresentationState(
    (s) => s.setActiveRightPanel,
  );

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2">
      <Button
        onClick={() => setOpenCreateThemeModal(true)}
        className="bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
      >
        New Theme
      </Button>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={cn(
            "rounded-lg p-2 transition-colors",
            showFavorites
              ? "bg-yellow-100 dark:bg-yellow-900"
              : "hover:bg-muted",
          )}
          title="Favorites"
        >
          <Star
            className={cn(
              "h-4 w-4",
              showFavorites
                ? "fill-yellow-500 text-yellow-500"
                : "text-foreground",
            )}
          />
        </button>

        <CreateThemeModal />
        <Button
          variant="ghost"
          className="size-8! rounded-full p-0"
          onClick={() => setActiveRightPanel(null)}
        >
          <X className="size-5!" />
        </Button>
      </div>
    </div>
  );
}
