"use client";

import { ThemePanel } from "@/components/presentation/edit-panel/sections/ThemePanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontsSection } from "./FontsSection";

export function ThemeSection() {
  return (
    <div className="-mx-4 flex h-full flex-col">
      <Tabs defaultValue="fonts" className="flex h-full flex-col">
        <TabsList className="w-full justify-start gap-0 rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger
            value="themes"
            className="flex-1 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Themes
          </TabsTrigger>
          <TabsTrigger
            value="fonts"
            className="flex-1 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Fonts
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <TabsContent value="themes" className="m-0">
              <ThemePanel />
            </TabsContent>
            <TabsContent value="fonts" className="m-0">
              <FontsSection />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
