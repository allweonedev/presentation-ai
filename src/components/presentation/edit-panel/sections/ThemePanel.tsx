"use client";

import {
  getPublicCustomThemes,
  getUserCustomThemes,
} from "@/app/_actions/presentation/theme-actions";
import { getUserFavoriteThemes } from "@/app/_actions/presentation/theme-favorite-actions";
import { themes as builtInThemes } from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { FontsSection } from "../../controls/global-settings/sections/FontsSection";
import { ThemeFilter } from "./theme/Filter";
import { ThemePanelHeader } from "./theme/ThemeHeader";
import { ThemeSelector, type ThemeListItem } from "./theme/ThemeSelector";
import { ThemeTabs } from "./theme/ThemeTabs";
import { useThemePanelState } from "./theme/theme-panel-state";

import { type CustomTheme } from "@/components/notebook/presentation/components/theme/types";

export function ThemePanel() {
  const { theme: activeTheme } = usePresentationState();
  const { tab, showFavorites, showFont } = useThemePanelState();

  const publicThemesQuery = useQuery({
    queryKey: ["presentation", "themes", "public"],
    queryFn: async () => {
      const result = await getPublicCustomThemes();
      return result.success ? (result.themes as CustomTheme[]) : [];
    },
    enabled: tab === "public" || showFavorites,
  });

  const userThemesQuery = useQuery({
    queryKey: ["presentation", "themes", "user"],
    queryFn: async () => {
      const result = await getUserCustomThemes();
      return result.success ? (result.themes as CustomTheme[]) : [];
    },
    enabled: tab === "public",
  });

  const favoriteThemesQuery = useQuery({
    queryKey: ["presentation", "themes", "favorites"],
    queryFn: async () => {
      const result = await getUserFavoriteThemes();
      return result.success ? (result.themes as CustomTheme[]) : [];
    },
    enabled: showFavorites || tab === "public",
  });

  const publicThemes = publicThemesQuery.data ?? [];
  const userThemes = userThemesQuery.data ?? [];
  const favoriteThemes = favoriteThemesQuery.data ?? [];

  const standardThemeItems = useMemo<ThemeListItem[]>(
    () =>
      Object.entries(builtInThemes).map(([key, value]) => ({
        themeId: key,
        theme: value,
        canFavorite: false,
        canLike: false,
      })),
    [],
  );

  const userThemeItems = useMemo<ThemeListItem[]>(
    () =>
      userThemes.map((item) => ({
        key: item.id,
        themeId: item.id,
        theme: { ...item.themeData, name: item.name },
        isFavorite: item.isFavorite ?? false,
        likeCount: item.likeCount ?? 0,
        isLiked: item.isLiked ?? false,
        canFavorite: false,
        canLike: false,
        isUserTheme: true,
      })),
    [userThemes],
  );

  const publicThemeItems = useMemo<ThemeListItem[]>(
    () =>
      publicThemes.map((item) => ({
        key: item.id,
        themeId: item.id,
        theme: { ...item.themeData, name: item.name },
        isFavorite: item.isFavorite ?? false,
        likeCount: item.likeCount ?? 0,
        isLiked: item.isLiked ?? false,
        canFavorite: true,
        canLike: true,
      })),
    [publicThemes],
  );

  const favoriteThemeItems = useMemo<ThemeListItem[]>(
    () =>
      favoriteThemes.map((item) => ({
        key: item.id,
        themeId: item.id,
        theme: { ...item.themeData, name: item.name },
        isFavorite: item.isFavorite ?? true,
        likeCount: item.likeCount ?? 0,
        isLiked: item.isLiked ?? false,
        canFavorite: true,
        canLike: true,
      })),
    [favoriteThemes],
  );

  // Combine user themes and public themes for "More Themes" tab
  const combinedThemeItems = useMemo<ThemeListItem[]>(
    () => [...userThemeItems, ...publicThemeItems],
    [userThemeItems, publicThemeItems],
  );

  let themesForSelector: ThemeListItem[] = [];
  if (showFavorites) {
    themesForSelector = favoriteThemeItems;
  } else if (tab === "public") {
    themesForSelector = combinedThemeItems;
  } else {
    themesForSelector = standardThemeItems;
  }

  const isFavoritesLoading = showFavorites && favoriteThemesQuery.isPending;
  const isPublicLoading =
    !showFavorites &&
    tab === "public" &&
    (publicThemesQuery.isPending || userThemesQuery.isPending);

  const isLoadingThemes = isFavoritesLoading || isPublicLoading;

  return (
    <div className="flex h-full flex-col gap-2 bg-background">
      <ThemePanelHeader />
      <ThemeTabs />
      <ThemeFilter />

      {showFont ? (
        <div className="scrollbar-thin max-h-[calc(100vh-4rem-4rem-4rem)] overflow-y-auto px-4 pt-2 pb-4 scrollbar-thumb-accent">
          <FontsSection />
        </div>
      ) : (
        <ThemeSelector
          themes={themesForSelector}
          activeKey={String(activeTheme)}
          isLoading={isLoadingThemes && !themesForSelector.length}
          emptyMessage={
            showFavorites
              ? "You have not favorited any themes yet."
              : "No themes available right now."
          }
        />
      )}
    </div>
  );
}
