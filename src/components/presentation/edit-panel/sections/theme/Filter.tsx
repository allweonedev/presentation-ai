"use client";

import { useThemePanelState } from "@/components/presentation/edit-panel/sections/theme/theme-panel-state";
import { extractThemeFromPptx } from "@/lib/presentation/pptx-theme-extractor";
import { themes } from "@/lib/presentation/themes";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { Loader2, Settings2, Type, Upload } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function ThemeFilter() {
  const {
    setShowFont,
    showFont,
    setOpenCreateThemeModal,
    setEditingTheme,
    setIsCustomizing,
    setImportedThemeData,
  } = useThemePanelState();
  const [isImporting, setIsImporting] = useState(false);

  function handleFontClick() {
    setShowFont(!useThemePanelState.getState().showFont);
  }

  function handleImportClick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pptx";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (file.size > MAX_FILE_SIZE) {
        toast.error("File is too large", {
          description: "Maximum file size is 50MB.",
        });
        return;
      }

      try {
        setIsImporting(true);
        const themeData = await extractThemeFromPptx(file);
        setImportedThemeData(themeData);
        setOpenCreateThemeModal(true);
      } catch {
        toast.error("Failed to extract theme", {
          description:
            "The file could not be read. Please ensure it is a valid .pptx file.",
        });
      } finally {
        setIsImporting(false);
      }
    };
    input.click();
  }

  function handleCustomizeClick() {
    // Get current theme from presentation state
    const { theme, customThemeData } = usePresentationState.getState();

    // Get theme data - either custom or from built-in themes
    const builtInTheme = themes[theme as keyof typeof themes];
    const themeData = customThemeData ?? builtInTheme;

    if (!themeData) {
      console.error("Could not find theme data for:", theme);
      return;
    }

    // Use the built-in theme name if available, otherwise use the theme ID
    // This prevents using potentially corrupted names from customThemeData
    const themeName = builtInTheme?.name || theme || "Custom Theme";

    // Set editing theme with current theme data, but mark as customizing
    const customizing = {
      id: nanoid(),
      name: themeName,
      description: themeData.description,
      themeData: themeData,
      isPublic: false, // Always private
      logoUrl: null,
      userId: "", // Will be set by server
    };

    // Set state in correct order causing modal to open with correct data
    setEditingTheme(customizing);
    setIsCustomizing(true);
    setOpenCreateThemeModal(true);
  }

  return (
    <div className="relative flex gap-2 px-4">
      {/* Customize Button */}
      <button
        onClick={handleCustomizeClick}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted"
        type="button"
      >
        <Settings2 className="h-4 w-4 text-foreground" />
        <span className="text-foreground">Customize</span>
      </button>

      {/* Font Button */}
      <button
        onClick={handleFontClick}
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted",
          showFont && "bg-muted",
        )}
        type="button"
      >
        <Type className="h-4 w-4 text-foreground" />
        <span className="text-foreground">Font</span>
      </button>

      {/* Import Button */}
      <button
        onClick={handleImportClick}
        disabled={isImporting}
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted",
          isImporting && "cursor-not-allowed opacity-60",
        )}
        title="Import Theme from PPTX"
        type="button"
      >
        {isImporting ? (
          <Loader2 className="h-4 w-4 animate-spin text-foreground" />
        ) : (
          <Upload className="h-4 w-4 text-foreground" />
        )}
        <span className="text-foreground">
          {isImporting ? "Importing..." : "Import"}
        </span>
      </button>
    </div>
  );
}
