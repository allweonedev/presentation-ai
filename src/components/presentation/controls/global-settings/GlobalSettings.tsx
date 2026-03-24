"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePresentationState } from "@/states/presentation-state";
import { ImageIcon, LayoutGridIcon, Settings, TypeIcon, X } from "lucide-react";
import { AlignmentSection } from "./sections/AlignmentSection";
import { FormatsSection } from "./sections/FormatsSection";
import { PageBackgroundSection } from "./sections/PageBackgroundSection";
import { PremiumFeaturesSection } from "./sections/PremiumFeaturesSection";
import { ThemeSection } from "./sections/ThemeSection";
import { TypographySizeSection } from "./sections/TypographySizeSection";
import { WidthSection } from "./sections/WidthSection";

export function GlobalSettings() {
  const setActiveRightPanel = usePresentationState(
    (s) => s.setActiveRightPanel,
  );

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-3 backdrop-blur-xs supports-backdrop-filter:bg-background/60">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-wide">Page Setup</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActiveRightPanel(null)}
          className="h-8 w-8 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="max-h-full flex-1 px-4 py-4">
        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="cards" className="flex-1 gap-1.5">
              <LayoutGridIcon className="size-4" />
              Cards
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex-1 gap-1.5">
              <TypeIcon className="size-4" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="background" className="flex-1 gap-1.5">
              <ImageIcon className="size-4" />
              Background
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="mt-6 space-y-4">
            <FormatsSection />
            <WidthSection />
            <AlignmentSection />
            <TypographySizeSection />
            <PremiumFeaturesSection />
          </TabsContent>

          <TabsContent value="theme" className="mt-6">
            <ThemeSection />
          </TabsContent>

          <TabsContent value="background" className="mt-6">
            <PageBackgroundSection />
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}
