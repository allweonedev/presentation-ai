"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

// Toggle favorite status for a theme
export async function toggleFavoriteTheme(themeId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be signed in to favorite themes",
        isFavorite: false,
      };
    }

    // Check if theme exists
    const theme = await db.presentationTheme.findUnique({
      where: { id: themeId },
    });

    if (!theme) {
      return { success: false, message: "Theme not found", isFavorite: false };
    }

    // Check if already favorited
    const existingFavorite = await db.favoritePresentationTheme.findUnique({
      where: {
        userId_themeId: {
          userId: session.user.id,
          themeId,
        },
      },
    });

    if (existingFavorite) {
      // Remove favorite
      await db.favoritePresentationTheme.delete({
        where: {
          userId_themeId: {
            userId: session.user.id,
            themeId,
          },
        },
      });
      return {
        success: true,
        isFavorite: false,
        message: "Theme removed from favorites",
      };
    } else {
      // Add favorite
      await db.favoritePresentationTheme.create({
        data: {
          userId: session.user.id,
          themeId,
        },
      });
      return {
        success: true,
        isFavorite: true,
        message: "Theme added to favorites",
      };
    }
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
      isFavorite: false,
    };
  }
}

// Get favorite themes for the current user, including like counts and user liked flag
export async function getUserFavoriteThemes() {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be signed in to view favorite themes",
        themes: [],
      };
    }

    const favorites = await db.favoritePresentationTheme.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        theme: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                presentationThemeLikes: true,
              },
            },
            presentationThemeLikes: {
              where: {
                userId: session.user.id,
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const themes = favorites.map((fav) => ({
      ...fav.theme,
      likeCount: fav.theme._count.presentationThemeLikes,
      isLiked: !!fav.theme.presentationThemeLikes?.length,
      isFavorite: true,
    }));

    return {
      success: true,
      themes,
    };
  } catch (error) {
    console.error("Failed to fetch favorite themes:", error);
    return {
      success: false,
      message: "Unable to load favorite themes. Please try again later.",
      themes: [],
    };
  }
}

// Get favorite theme IDs for the current user
export async function getUserFavoriteThemeIds() {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be signed in to view favorite themes",
        themeIds: [],
      };
    }

    const favorites = await db.favoritePresentationTheme.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        themeId: true,
      },
    });

    const themeIds = favorites.map((fav) => fav.themeId);

    return {
      success: true,
      themeIds,
    };
  } catch (error) {
    console.error("Failed to fetch favorite theme IDs:", error);
    return {
      success: false,
      message: "Unable to load favorite themes. Please try again later.",
      themeIds: [],
    };
  }
}
