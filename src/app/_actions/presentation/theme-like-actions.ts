"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

// Toggle like status for a theme
export async function toggleLikeTheme(themeId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be signed in to like themes",
        isLiked: false,
        likeCount: 0,
      };
    }

    // Check if theme exists
    const theme = await db.presentationTheme.findUnique({
      where: { id: themeId },
    });

    if (!theme) {
      return {
        success: false,
        message: "Theme not found",
        isLiked: false,
        likeCount: 0,
      };
    }

    // Check if already liked
    const existingLike = await db.presentationThemeLike.findUnique({
      where: {
        userId_themeId: {
          userId: session.user.id,
          themeId,
        },
      },
    });

    if (existingLike) {
      // Remove like
      await db.presentationThemeLike.delete({
        where: {
          userId_themeId: {
            userId: session.user.id,
            themeId,
          },
        },
      });
    } else {
      // Add like
      await db.presentationThemeLike.create({
        data: {
          userId: session.user.id,
          themeId,
        },
      });
    }

    // Get updated like count
    const likeCount = await db.presentationThemeLike.count({
      where: { themeId },
    });

    // Check if user still likes it
    const isLiked = !existingLike;

    return {
      success: true,
      isLiked,
      likeCount,
      message: isLiked ? "Theme liked" : "Theme unliked",
    };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
      isLiked: false,
      likeCount: 0,
    };
  }
}

// Get like counts for multiple themes
export async function getThemeLikes(themeIds: string[]) {
  try {
    if (themeIds.length === 0) {
      return {
        success: true,
        likes: {},
      };
    }

    const likes = await db.presentationThemeLike.groupBy({
      by: ["themeId"],
      where: {
        themeId: {
          in: themeIds,
        },
      },
      _count: {
        id: true,
      },
    });

    const likesMap: Record<string, number> = {};
    likes.forEach((like) => {
      likesMap[like.themeId] = like._count.id;
    });

    // Ensure all themeIds are in the map (even if count is 0)
    themeIds.forEach((id) => {
      if (!(id in likesMap)) {
        likesMap[id] = 0;
      }
    });

    return {
      success: true,
      likes: likesMap,
    };
  } catch (error) {
    console.error("Failed to fetch theme likes:", error);
    return {
      success: false,
      message: "Unable to load theme likes. Please try again later.",
      likes: {},
    };
  }
}

// Check if user has liked specific themes
export async function getUserLikedThemeIds(themeIds: string[]) {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be signed in",
        themeIds: [],
      };
    }

    if (themeIds.length === 0) {
      return {
        success: true,
        themeIds: [],
      };
    }

    const likes = await db.presentationThemeLike.findMany({
      where: {
        userId: session.user.id,
        themeId: {
          in: themeIds,
        },
      },
      select: {
        themeId: true,
      },
    });

    const likedThemeIds = likes.map((like) => like.themeId);

    return {
      success: true,
      themeIds: likedThemeIds,
    };
  } catch (error) {
    console.error("Failed to fetch liked theme IDs:", error);
    return {
      success: false,
      message: "Unable to load liked themes. Please try again later.",
      themeIds: [],
    };
  }
}
