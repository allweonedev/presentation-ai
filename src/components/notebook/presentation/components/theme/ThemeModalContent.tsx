"use client";

import { ThemeCardSkeleton } from "@/components/notebook/presentation/components/theme/ThemeCardSkeleton";
import { ThemeCard } from "@/components/presentation/edit-panel/sections/theme/ThemeCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  themes as builtInThemes,
  type ThemeProperties,
} from "@/lib/presentation/themes";
import { X } from "lucide-react";

interface CustomTheme {
  id: string;
  name: string;
  description?: string;
  themeData: ThemeProperties;
  isPublic: boolean;
  logoUrl?: string;
  userId: string;
  user?: {
    name: string;
  };
  isFavorite?: boolean;
  likeCount?: number;
  isLiked?: boolean;
}

interface ThemeModalContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedThemeId: string | null;
  onPreviewTheme: (id: string, theme: ThemeProperties) => void;
  userThemes: CustomTheme[];
  publicThemes: CustomTheme[];
  isLoadingUserThemes: boolean;
  isLoadingPublicThemes: boolean;
  onApplyTheme: () => void;
  onClose: () => void;
}

/**
 * Left panel theme selection content with tabs and theme grids
 */
export function ThemeModalContent({
  activeTab,
  onTabChange,
  selectedThemeId,

  onPreviewTheme,
  userThemes,
  publicThemes,
  isLoadingUserThemes,
  isLoadingPublicThemes,
  onApplyTheme,
  onClose,
}: ThemeModalContentProps) {
  const hasUserThemes = userThemes.length > 0;
  const hasPublicThemes = publicThemes.length > 0;

  return (
    <div className="flex h-full max-h-[85vh] w-full flex-col overflow-hidden border-border bg-background lg:w-[40%] lg:border-r">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-2">
        <h2 className="p-4 text-lg font-semibold">Themes</h2>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="allweone-themes"
        value={activeTab}
        onValueChange={onTabChange}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div className="shrink-0 px-4 pt-2">
          <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="allweone-themes"
              className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              ALLWEONE
            </TabsTrigger>
            <TabsTrigger
              value="explore"
              className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Explore
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="max-h-[calc(85vh-4rem)] flex-1">
          <TabsContent value="allweone-themes" className="m-0 p-4">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-2">
              {Object.entries(builtInThemes).map(([key, theme]) => (
                <div key={key} className="h-44">
                  <ThemeCard
                    themeId={key}
                    theme={theme}
                    isSelected={selectedThemeId === key}
                    onSelect={() => onPreviewTheme(key, theme)}
                    showEllipsis={false}
                    showFavoriteButton={false}
                    showInfo={true}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="explore" className="m-0 p-4">
            <div className="space-y-6">
              {/* User Themes */}
              <div className="space-y-3">
                <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Your Themes
                </h3>
                {isLoadingUserThemes ? (
                  <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <ThemeCardSkeleton key={`skeleton-user-${i}`} />
                    ))}
                  </div>
                ) : hasUserThemes ? (
                  <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                    {userThemes.map((item) => (
                      <div key={item.id} className="h-44">
                        <ThemeCard
                          themeId={item.id}
                          theme={item.themeData}
                          isSelected={selectedThemeId === item.id}
                          isFavorite={item.isFavorite}
                          likeCount={item.likeCount}
                          isLiked={item.isLiked}
                          isOwner={true}
                          isPublic={item.isPublic}
                          onSelect={() =>
                            onPreviewTheme(item.id, item.themeData)
                          }
                          showInfo={true}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-sm text-muted-foreground italic">
                    You haven&apos;t created any themes yet.
                  </div>
                )}
              </div>

              {/* Public Themes */}
              <div className="space-y-3">
                <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Public Themes
                </h3>
                {isLoadingPublicThemes ? (
                  <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <ThemeCardSkeleton key={`skeleton-public-${i}`} />
                    ))}
                  </div>
                ) : hasPublicThemes ? (
                  <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                    {publicThemes.map((item) => (
                      <div key={item.id} className="h-44">
                        <ThemeCard
                          themeId={item.id}
                          theme={item.themeData}
                          isSelected={selectedThemeId === item.id}
                          isFavorite={item.isFavorite}
                          likeCount={item.likeCount}
                          isLiked={item.isLiked}
                          showLikeButton={true}
                          isOwner={false}
                          isPublic={true}
                          onSelect={() =>
                            onPreviewTheme(item.id, item.themeData)
                          }
                          showInfo={true}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-sm text-muted-foreground italic">
                    No public themes available.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Apply Button */}
      <div className="shrink-0 border-t border-border p-4">
        <Button
          onClick={onApplyTheme}
          className="w-full"
          disabled={!selectedThemeId}
        >
          Apply Theme
        </Button>
      </div>
    </div>
  );
}
