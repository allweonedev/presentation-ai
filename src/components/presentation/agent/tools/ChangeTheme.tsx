"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { executeToolAction } from "@/hooks/presentation/agentTools";
import { themes, type ThemeName } from "@/lib/presentation/themes";
import { Loader2, Palette } from "lucide-react";
import { useEffect, useState } from "react";

type Themes = ThemeName;

export function PresentationChangeThemeCall({
  theme,
  loading,
}: {
  theme?: Themes;
  loading?: boolean;
}) {
  const [selected, setSelected] = useState<Themes | undefined>(theme);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setSelected(theme);
  }, [theme]);

  const apply = () => {
    if (!selected) {
      return;
    }

    executeToolAction({ action: "change_theme", theme: selected });
    setIsEditing(false);
  };

  if (!theme || !themes?.[theme]?.name) {
    return (
      <div className="w-full rounded-lg border bg-card p-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Updating theme...
          </span>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-2xs">
        <div className="mb-3 flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Change Theme</span>
        </div>
        <div className="flex gap-2">
          <Select
            value={selected}
            onValueChange={(value) => setSelected(value as Themes)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(themes).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value?.name ?? key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={apply} disabled={loading || !selected}>
            Apply
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="group w-full rounded-lg border bg-card p-3 text-left shadow-2xs transition-colors hover:bg-accent/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Theme:</span>
          <span className="text-sm font-medium">
            {selected ? themes?.[selected]?.name ?? selected : "None"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          Click to edit
        </span>
      </div>
    </button>
  );
}

export function PresentationChangeThemeResult({
  message,
}: {
  message?: string;
}) {
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-900 dark:bg-green-950/20">
      <span className="text-sm text-green-900 dark:text-green-100">
        {message ?? "Theme updated"}
      </span>
    </div>
  );
}
