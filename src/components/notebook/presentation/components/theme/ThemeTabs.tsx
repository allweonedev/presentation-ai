"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid2X2, PaletteIcon, TypeIcon } from "lucide-react";

interface ThemeTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export function ThemeTabs({
  activeTab,
  onTabChange,
  children,
}: ThemeTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="colors" className="flex items-center gap-2">
          <PaletteIcon className="h-4 w-4" />
          Colors
        </TabsTrigger>
        <TabsTrigger value="fonts" className="flex items-center gap-2">
          <TypeIcon className="h-4 w-4" />
          Fonts
        </TabsTrigger>
        <TabsTrigger value="spacing" className="flex items-center gap-2">
          <Grid2X2 className="h-4 w-4" />
          Spacing
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
