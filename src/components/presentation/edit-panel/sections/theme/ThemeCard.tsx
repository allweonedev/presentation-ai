"use client";

import { toggleFavoriteTheme } from "@/app/_actions/presentation/theme-favorite-actions";
import { toggleLikeTheme } from "@/app/_actions/presentation/theme-like-actions";
import type React from "react";
import { useEffect, useState, useTransition } from "react";

import { type ThemeProperties } from "@/lib/presentation/themes";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useThemePanelState } from "./theme-panel-state";

interface ThemeCardProps {
  themeId: string;
  theme: ThemeProperties;
  isSelected: boolean;
  isFavorite?: boolean;
  likeCount?: number;
  isLiked?: boolean;
  showLikeButton?: boolean;
  showFavoriteButton?: boolean;
  showEllipsis?: boolean;
  showInfo?: boolean;
  onSelect?: (id: string) => void;
  isOwner?: boolean;
  isPublic?: boolean;
}

export function ThemeCard({
  themeId,
  theme,
  isSelected,
  isFavorite,
  likeCount = 0,
  isLiked = false,
  showLikeButton = false,
  showFavoriteButton = true,
  showEllipsis = true,
  showInfo = true,
  onSelect,
  isOwner = false,
  isPublic = false,
}: ThemeCardProps) {
  const {
    openEditMenu,
    setOpenEditMenu,
    setEditingTheme,
    setOpenCreateThemeModal,
  } = useThemePanelState();
  const identifier = themeId;
  const showEditMenu = openEditMenu === identifier;
  const [isPendingFavorite, startFavoriteTransition] = useTransition();
  const [isPendingLike, startLikeTransition] = useTransition();
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite ?? false);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);

  const queryClient = useQueryClient();
  const invalidateFavorites = () => {
    queryClient.invalidateQueries({
      queryKey: ["presentation", "themes", "favorites"],
    });
    queryClient.invalidateQueries({
      queryKey: ["presentation", "themes", "public"],
    });
  };

  const invalidateLikes = () => {
    queryClient.invalidateQueries({
      queryKey: ["presentation", "themes", "public"],
    });
    queryClient.invalidateQueries({
      queryKey: ["presentation", "themes", "favorites"],
    });
  };

  useEffect(() => {
    setLocalIsFavorite(isFavorite ?? false);
  }, [isFavorite]);

  useEffect(() => {
    setLocalLikeCount(likeCount);
  }, [likeCount]);

  useEffect(() => {
    setLocalIsLiked(isLiked);
  }, [isLiked]);

  // Font pairing display
  const fontPairing = `${theme.fonts.heading} / ${theme.fonts.body}`;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!themeId) {
      return;
    }

    startFavoriteTransition(async () => {
      // Optimistic update
      const previous = localIsFavorite;
      const optimistic = !previous;
      setLocalIsFavorite(optimistic);

      try {
        const result = await toggleFavoriteTheme(themeId);
        if (result.success) {
          // Align with server response if it differs
          if (result.isFavorite !== undefined) {
            setLocalIsFavorite(result.isFavorite);
          }
          invalidateFavorites();
        } else {
          // Roll back on failure
          setLocalIsFavorite(previous);
        }
      } catch {
        setLocalIsFavorite(previous);
      }
    });
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!themeId) {
      return;
    }

    startLikeTransition(async () => {
      // Optimistic update: flip like and adjust count
      const prevLiked = localIsLiked;
      const prevCount = localLikeCount;
      const optimisticLiked = !prevLiked;
      const optimisticCount = prevCount + (optimisticLiked ? 1 : -1);

      setLocalIsLiked(optimisticLiked);
      setLocalLikeCount(Math.max(0, optimisticCount));

      try {
        const result = await toggleLikeTheme(themeId);
        if (result.success) {
          // Align to server if different
          if (typeof result.isLiked === "boolean") {
            setLocalIsLiked(result.isLiked);
          }
          if (typeof result.likeCount === "number") {
            setLocalLikeCount(result.likeCount);
          }
          invalidateLikes?.();
        } else {
          // Roll back on failure
          setLocalIsLiked(prevLiked);
          setLocalLikeCount(prevCount);
        }
      } catch {
        setLocalIsLiked(prevLiked);
        setLocalLikeCount(prevCount);
      }
    });
  };

  const handleEditMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenEditMenu(showEditMenu ? null : identifier);
  };

  // Only show ellipsis if user is owner
  const canEdit = isOwner;
  // Only show delete if user is owner AND theme is private
  const canDelete = isOwner && !isPublic;

  // Use local state for display
  return (
    <div className="relative h-full w-full min-w-0 overflow-hidden rounded-lg border border-primary/20">
      {/* Action buttons in top right */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
        {themeId && showFavoriteButton && (
          <button
            onClick={handleToggleFavorite}
            disabled={isPendingFavorite}
            className="rounded-full bg-background/80 p-1 transition-colors hover:bg-background disabled:opacity-50"
          >
            <Star
              className={cn(
                "h-3.5 w-3.5",
                localIsFavorite
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-muted-foreground",
              )}
            />
          </button>
        )}

        {showEllipsis && canEdit && (
          <div className="relative">
            <button
              onClick={handleEditMenuToggle}
              className="rounded-full bg-background/80 p-1 transition-colors hover:bg-background"
            >
              <svg
                className="h-3.5 w-3.5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            {showEditMenu && (
              <div className="absolute top-full right-0 z-20 mt-1 w-28 rounded-lg border border-border bg-background py-1 shadow-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTheme({
                      id: themeId,
                      name: theme.name,
                      description: theme.description ?? null,
                      themeData: theme,
                      isPublic: isPublic,
                      logoUrl: null,
                      userId: "",
                    });
                    setOpenCreateThemeModal(true);
                    setOpenEditMenu(null);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted"
                >
                  Edit Theme
                </button>
                {canDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-red-600 transition-colors hover:bg-muted"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          if (onSelect) {
            onSelect(themeId);
            return;
          }
          usePresentationState.getState().setTheme(themeId, theme);
        }}
        className={cn(
          "h-full w-full rounded-lg transition-all hover:shadow-lg",
          isSelected
            ? "ring-2 ring-purple-600 ring-offset-2 ring-offset-background"
            : "hover:ring-2 hover:ring-primary/80",
        )}
      >
        {/* Like button for public themes */}
        {showLikeButton && themeId && (
          <button
            onClick={handleToggleLike}
            disabled={isPendingLike}
            className={cn(
              "absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 backdrop-blur-xs transition-colors hover:bg-background/95 disabled:opacity-50",
              localIsLiked && "bg-red-50 dark:bg-red-950/30",
            )}
          >
            <svg
              className={cn(
                "h-3 w-3",
                localIsLiked
                  ? "fill-red-500 text-red-500"
                  : "fill-transparent stroke-red-500 text-red-500",
              )}
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-xs text-foreground">{localLikeCount}</span>
          </button>
        )}

        {/* Theme preview */}
        <div className="relative h-28 w-full overflow-hidden rounded-t-lg sm:h-32">
          {/* Page background - uses theme.background.override */}
          <div
            className="absolute inset-0 p-2.5 sm:p-3"
            style={{
              background: theme.colors.primary,
              // background: theme.background?.override || theme.colors.background ,
            }}
          >
            {/* Slide background - uses theme.colors.background */}
            <div
              className="flex h-full w-full flex-col items-center justify-center p-3"
              style={{
                backgroundColor: theme.colors.background,
                borderRadius: theme.borderRadius.card,
                boxShadow: theme.shadows.card,
                border: `1px solid ${theme.colors.primary}60`,
              }}
            >
              {/* Title with heading color */}
              <h3
                className="mb-1 text-center text-sm font-bold sm:text-base"
                style={{ color: theme.colors.heading }}
              >
                Title
              </h3>
              {/* Body text with text color */}
              <p
                className="mb-2 text-center text-[11px] sm:text-xs"
                style={{ color: theme.colors.text }}
              >
                Body text{" "}
                <span
                  className="underline"
                  style={{ color: theme.colors.accent }}
                >
                  Link
                </span>
              </p>
              {/* Smart layout color bar */}
              <div
                className="h-1.5 w-12 rounded-full"
                style={{ backgroundColor: theme.colors.smartLayout }}
                title="Smart Layout"
              />
            </div>
          </div>
        </div>

        {/* Theme info */}
        {showInfo && (
          <div className="mt-2 flex items-center justify-between gap-2 px-2 pb-2">
            <div className="flex min-w-0 flex-col items-start gap-0.5">
              <span className="text-left text-xs font-medium text-foreground">
                {theme.name}
              </span>
              <span className="line-clamp-1 text-left text-xs text-muted-foreground">
                {fontPairing.trim()}
              </span>
            </div>
            {isSelected && (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>
        )}
      </button>
    </div>
  );
}
