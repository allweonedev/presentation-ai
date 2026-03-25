"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { type ThemeProperties } from "@/lib/presentation/themes";
import { ThemeCard } from "./ThemeCard";

export interface ThemeListItem {
  theme: ThemeProperties;
  themeId: string;
  isFavorite?: boolean;
  likeCount?: number;
  isLiked?: boolean;
  canLike?: boolean;
  isUserTheme?: boolean;
}

interface ThemeSelectorProps {
  themes: ThemeListItem[];
  activeKey: string;
  isLoading?: boolean;
  emptyMessage?: string;
  skeletonCount?: number;
}

export function ThemeSelector({
  themes,
  activeKey,
  isLoading = false,
  emptyMessage = "No themes available.",
  skeletonCount = 6,
}: ThemeSelectorProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 px-4 pt-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ThemeCardSkeleton key={`theme-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (!themes.length) {
    return (
      <div className="mx-4 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        <span>{emptyMessage}</span>
      </div>
    );
  }

  // Separate user themes from public themes
  const userThemes = themes.filter((item) => item.isUserTheme);
  const publicThemes = themes.filter((item) => !item.isUserTheme);
  const hasUserThemes = userThemes.length > 0;
  const hasPublicThemes = publicThemes.length > 0;

  return (
    <div className="scrollbar-thin max-h-[calc(100vh-64px-2*80px)] overflow-y-auto scrollbar-thumb-primary scrollbar-track-transparent">
      {hasUserThemes && (
        <div className="px-4 pt-3">
          <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Your Themes
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {userThemes.map((item) => (
              <ThemeCard
                key={item.themeId}
                themeId={item.themeId}
                theme={item.theme}
                isSelected={activeKey === item.themeId}
                isFavorite={item.isFavorite}
                likeCount={item.likeCount}
                isLiked={item.isLiked}
                showLikeButton={item.canLike ?? false}
                isOwner={item.isUserTheme}
                isPublic={false}
              />
            ))}
          </div>
        </div>
      )}

      {hasPublicThemes && (
        <div className={`px-4 ${hasUserThemes ? "pt-6" : "pt-3"}`}>
          {hasUserThemes && (
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Public Themes
            </h3>
          )}
          <div className="grid grid-cols-2 gap-3">
            {publicThemes.map((item) => (
              <ThemeCard
                key={item.themeId}
                themeId={item.themeId}
                theme={item.theme}
                isSelected={activeKey === item.themeId}
                isFavorite={item.isFavorite}
                likeCount={item.likeCount}
                isLiked={item.isLiked}
                showLikeButton={item.canLike ?? false}
                isOwner={item.isUserTheme}
                isPublic={!item.isUserTheme}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ThemeCardSkeleton() {
  return (
    <div className="relative rounded-xl border border-border bg-card/50 p-2">
      <Skeleton className="aspect-4/3 w-full rounded-lg" />
      <div className="mt-3 space-y-2 px-2 pb-2">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  );
}
