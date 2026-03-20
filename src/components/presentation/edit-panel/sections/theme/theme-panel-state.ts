import { type CustomTheme } from "@/components/notebook/presentation/components/theme/types";
import { type ThemeProperties, type Themes } from "@/lib/presentation/themes";
import { create } from "zustand";

export type FilterOption = {
  style: "all" | "minimal" | "professional" | "creative";
};

interface ThemeState {
  tab: "standard" | "public";
  theme: Themes;
  setTab: (tab: "standard" | "public") => void;
  setTheme: (theme: Themes) => void;
  showFavorites: boolean;
  setShowFavorites: (showFavorites: boolean) => void;
  openCreateThemeModal: boolean;
  setOpenCreateThemeModal: (openCreateThemeModal: boolean) => void;
  themeFilterOption: FilterOption;
  showFont: boolean;
  setThemeFilterOption: (filter: FilterOption) => void;
  setShowFont: (bool: boolean) => void;
  openEditMenu: string | null;
  setOpenEditMenu: (themeKey: string | null) => void;
  editingTheme: CustomTheme | null;
  setEditingTheme: (theme: CustomTheme | null) => void;
  // Flag to indicate if we are customizing (creating new derived) vs editing
  isCustomizing: boolean;
  setIsCustomizing: (isCustomizing: boolean) => void;
  // Theme data imported from a PPTX file
  importedThemeData: ThemeProperties | null;
  setImportedThemeData: (data: ThemeProperties | null) => void;
}

export const useThemePanelState = create<ThemeState>((set) => ({
  tab: "standard",
  setTab: (tab) => set({ tab }),
  theme: "mystique",
  setTheme: (theme) => set({ theme }),
  showFavorites: false,
  setShowFavorites: (showFavorites) => set({ showFavorites }),
  openCreateThemeModal: false,
  setOpenCreateThemeModal: (openCreateThemeModal) =>
    set({ openCreateThemeModal }),
  showFont: false,
  themeFilterOption: {
    style: "all",
  },
  setThemeFilterOption: (option) => set({ themeFilterOption: option }),
  setShowFont: (bool) => set({ showFont: bool }),
  openEditMenu: null,
  setOpenEditMenu: (themeKey) => set({ openEditMenu: themeKey }),
  editingTheme: null,
  setEditingTheme: (theme) => set({ editingTheme: theme }),
  isCustomizing: false,
  setIsCustomizing: (isCustomizing) => set({ isCustomizing }),
  importedThemeData: null,
  setImportedThemeData: (data) => set({ importedThemeData: data }),
}));
