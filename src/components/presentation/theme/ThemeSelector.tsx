"use client";
import {
  getPublicCustomThemes,
  getUserCustomThemes,
} from "@/app/_actions/presentation/theme-actions";
import { CreateThemeModal } from "@/components/notebook/presentation/components/theme/create-theme/CreateThemeModal";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  themes,
  type ThemeProperties,
  type Themes,
} from "@/lib/presentation/themes";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { useQuery } from "@tanstack/react-query";
import { Palette } from "lucide-react";
import { useState } from "react";
import { useThemePanelState } from "../edit-panel/sections/theme/theme-panel-state";
import { usePresentationTheme } from "../providers/PresentationThemeProvider";

interface CustomTheme {
  id: string;
  name: string;
  description: string | null;
  themeData: ThemeProperties;
  isPublic: boolean;
  logoUrl: string | null;
  userId: string;
  user?: {
    name: string | null;
  };
}

type ThemeId = Themes | `custom-${string}`;

function ThemeCardSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
    </div>
  );
}

export function ThemeSelector() {
  const { resolvedTheme } = usePresentationTheme();
  const { theme: presentationTheme, setTheme: setPresentationTheme } =
    usePresentationState();
  const { setOpenCreateThemeModal } = useThemePanelState();
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my-themes");
  const isDark = resolvedTheme === "dark";

  // Fetch user themes with React Query
  const { data: userThemes = [], isLoading: isLoadingUserThemes } = useQuery({
    queryKey: ["userThemes"],
    queryFn: async () => {
      const result = await getUserCustomThemes();
      return result.success ? (result.themes as CustomTheme[]) : [];
    },
    enabled: isThemeSheetOpen,
  });

  // Fetch public themes with React Query
  const { data: publicThemes = [], isLoading: isLoadingPublicThemes } =
    useQuery({
      queryKey: ["publicThemes"],
      queryFn: async () => {
        const result = await getPublicCustomThemes();
        return result.success ? (result.themes as CustomTheme[]) : [];
      },
      enabled: isThemeSheetOpen,
    });

  // Handle theme selection
  const handleThemeSelect = (
    themeKey: ThemeId,
    customData?: ThemeProperties | null,
  ) => {
    setPresentationTheme(themeKey as Themes, customData);
    setIsThemeSheetOpen(false);
  };

  return (
    <Sheet open={isThemeSheetOpen} onOpenChange={setIsThemeSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Palette className="mr-1 h-4 w-4" />
          Theme
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        overlay={false}
        className="absolute top-0 bottom-0 w-full max-w-md overflow-y-auto sm:max-w-lg"
        container={
          typeof window === "undefined"
            ? undefined
            : typeof document !== "undefined"
              ? (document.querySelector<HTMLElement>(".sheet-container") ??
                undefined)
              : undefined
        }
      >
        <SheetHeader className="mb-5">
          <SheetTitle>Presentation Theme</SheetTitle>
          <SheetDescription>
            Choose a theme for your presentation
          </SheetDescription>
          <div>
            <CreateThemeModal></CreateThemeModal>
            <Button onClick={() => setOpenCreateThemeModal(true)}>
              Create New Theme
            </Button>
          </div>
        </SheetHeader>

        <Tabs
          defaultValue="my-themes"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="mb-4">
            <TabsList>
              <TabsTrigger value="my-themes">My Themes</TabsTrigger>
              <TabsTrigger value="public-themes">Public Themes</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="my-themes">
            {isLoadingUserThemes ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <ThemeCardSkeleton key={i} />
                ))}
              </div>
            ) : userThemes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {userThemes.map((theme) => {
                  const themeData = theme.themeData;
                  const modeColors = themeData.colors;
                  const modeShadows = themeData.shadows;

                  return (
                    <button
                      key={theme.id}
                      onClick={() =>
                        handleThemeSelect(theme.id as ThemeId, themeData)
                      }
                      className={cn(
                        "group relative space-y-2 rounded-lg border p-4 text-left transition-all",
                        presentationTheme === theme.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50 hover:bg-muted/50",
                      )}
                      style={{
                        borderRadius: themeData.borderRadius.button,
                        boxShadow: modeShadows.card,
                        transition: themeData.transitions.default,
                        backgroundColor: isDark
                          ? "rgba(0,0,0,0.3)"
                          : "rgba(255,255,255,0.9)",
                      }}
                    >
                      <div
                        className="font-medium"
                        style={{
                          color: modeColors.heading,
                          fontFamily: themeData.fonts.heading,
                        }}
                      >
                        {theme.name}
                      </div>
                      <div
                        className="text-sm"
                        style={{
                          color: modeColors.text,
                          fontFamily: themeData.fonts.body,
                        }}
                      >
                        {theme.description ?? "Custom theme"}
                      </div>
                      <div className="flex gap-2">
                        {[modeColors.primary, modeColors.accent].map(
                          (color, i) => (
                            <div
                              key={i}
                              className="h-4 w-4 rounded-full ring-1 ring-white/10 ring-inset"
                              style={{ backgroundColor: color }}
                            />
                          ),
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center">
                <p className="mb-4 text-muted-foreground">
                  You haven&apos;t created any themes yet
                </p>
                <Button onClick={() => setOpenCreateThemeModal(true)}>
                  Create Your First Theme
                </Button>
                <CreateThemeModal></CreateThemeModal>
              </div>
            )}
          </TabsContent>

          <TabsContent value="public-themes">
            {isLoadingPublicThemes ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <ThemeCardSkeleton key={i} />
                ))}
              </div>
            ) : publicThemes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {publicThemes.map((theme) => {
                  const themeData = theme.themeData;
                  const modeColors = themeData.colors;
                  const modeShadows = themeData.shadows;

                  return (
                    <button
                      key={theme.id}
                      onClick={() =>
                        handleThemeSelect(theme.id as ThemeId, themeData)
                      }
                      className={cn(
                        "group relative space-y-2 rounded-lg border p-4 text-left transition-all",
                        presentationTheme === theme.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50 hover:bg-muted/50",
                      )}
                      style={{
                        borderRadius: themeData.borderRadius.button,
                        boxShadow: modeShadows.card,
                        transition: themeData.transitions.default,
                        backgroundColor: isDark
                          ? "rgba(0,0,0,0.3)"
                          : "rgba(255,255,255,0.9)",
                      }}
                    >
                      <div
                        className="font-medium"
                        style={{
                          color: modeColors.heading,
                          fontFamily: themeData.fonts.heading,
                        }}
                      >
                        {theme.name}
                      </div>
                      <div
                        className="text-sm"
                        style={{
                          color: modeColors.text,
                          fontFamily: themeData.fonts.body,
                        }}
                      >
                        {theme.description ?? "Custom theme"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        By {theme.user?.name ?? "Unknown"}
                      </div>
                      <div className="flex gap-2">
                        {[modeColors.primary, modeColors.accent].map(
                          (color, i) => (
                            <div
                              key={i}
                              className="h-4 w-4 rounded-full ring-1 ring-white/10 ring-inset"
                              style={{ backgroundColor: color }}
                            />
                          ),
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">
                  No public themes available
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">Built-in Themes</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(themes).map(([key, themeOption]) => {
              const modeColors = themeOption.colors;
              const modeShadows = themeOption.shadows;

              return (
                <button
                  key={key}
                  onClick={() => handleThemeSelect(key as ThemeId)}
                  className={cn(
                    "group relative space-y-2 rounded-lg border p-4 text-left transition-all",
                    presentationTheme === key
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50 hover:bg-muted/50",
                  )}
                  style={{
                    borderRadius: themeOption.borderRadius.button,
                    boxShadow: modeShadows.card,
                    transition: themeOption.transitions.default,
                    backgroundColor:
                      presentationTheme === key
                        ? `${modeColors.primary}${isDark ? "15" : "08"}`
                        : isDark
                          ? "rgba(0,0,0,0.3)"
                          : "rgba(255,255,255,0.9)",
                  }}
                >
                  <div
                    className="font-medium"
                    style={{
                      color: modeColors.heading,
                      fontFamily: themeOption.fonts.heading,
                    }}
                  >
                    {themeOption.name}
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: modeColors.text,
                      fontFamily: themeOption.fonts.body,
                    }}
                  >
                    {themeOption.description}
                  </div>
                  <div className="flex gap-2">
                    {[modeColors.primary, modeColors.accent].map((color, i) => (
                      <div
                        key={i}
                        className="h-4 w-4 rounded-full ring-1 ring-white/10 ring-inset"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div
                    className="mt-2 text-xs"
                    style={{ color: modeColors.text, opacity: 0.7 }}
                  >
                    <span className="block">
                      Heading: {themeOption.fonts.heading}
                    </span>
                    <span className="block">
                      Body: {themeOption.fonts.body}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
