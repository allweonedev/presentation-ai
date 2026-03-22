import {
  getPublicCustomThemes,
  getUserCustomThemes,
} from "@/app/_actions/presentation/theme-actions";
import {
  themes as builtInThemes,
  type ThemeProperties,
} from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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

/**
 * Custom hook containing theme modal state and logic
 */
export function useThemeModalState(isOpen: boolean) {
  const { theme: currentThemeId, setTheme } = usePresentationState();

  const [activeTab, setActiveTab] = useState("allweone-themes");
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [selectedThemeData, setSelectedThemeData] =
    useState<ThemeProperties | null>(null);

  // Initialize selected theme from current theme when opening
  useEffect(() => {
    if (isOpen) {
      // Try to find the current theme in built-ins first
      if (typeof currentThemeId === "string" && builtInThemes[currentThemeId]) {
        setSelectedThemeId(currentThemeId);
        setSelectedThemeData(builtInThemes[currentThemeId]);
      } else {
        // Default to the first built-in theme if current is not found
        if (!selectedThemeId) {
          const keys = Object.keys(builtInThemes);
          if (keys.length > 0) {
            const firstKey = keys[0]!;
            setSelectedThemeId(firstKey);
            setSelectedThemeData(builtInThemes[firstKey]);
          }
        }
      }
    }
  }, [isOpen, currentThemeId]);

  // Fetch user themes with React Query
  const { data: userThemes = [], isLoading: isLoadingUserThemes } = useQuery({
    queryKey: ["userThemes"],
    queryFn: async () => {
      const result = await getUserCustomThemes();
      return result.success ? (result.themes as CustomTheme[]) : [];
    },
    enabled: isOpen,
  });

  // Fetch public themes with React Query
  const { data: publicThemes = [], isLoading: isLoadingPublicThemes } =
    useQuery({
      queryKey: ["publicThemes"],
      queryFn: async () => {
        const result = await getPublicCustomThemes();
        return result.success ? (result.themes as CustomTheme[]) : [];
      },
      enabled: isOpen,
    });

  const handlePreviewTheme = (id: string, theme: ThemeProperties) => {
    setSelectedThemeId(id);
    setSelectedThemeData(theme);
  };

  const handleApplyTheme = () => {
    if (selectedThemeId && selectedThemeData) {
      setTheme(selectedThemeId, selectedThemeData);
    }
  };

  return {
    activeTab,
    setActiveTab,
    selectedThemeId,
    selectedThemeData,
    userThemes,
    publicThemes,
    isLoadingUserThemes,
    isLoadingPublicThemes,
    handlePreviewTheme,
    handleApplyTheme,
  };
}
