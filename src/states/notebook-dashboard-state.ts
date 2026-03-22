import { create } from "zustand";
import { persist } from "zustand/middleware";

type ContentView = "templates" | "files";

interface NotebookDashboardState {
  contentView: ContentView;
  setContentView: (view: ContentView) => void;
  toggleContentView: () => void;
}

export const useNotebookDashboardState = create<NotebookDashboardState>()(
  persist(
    (set) => ({
      contentView: "files",
      setContentView: (view) => set({ contentView: view }),
      toggleContentView: () =>
        set((state) => ({
          contentView: state.contentView === "files" ? "templates" : "files",
        })),
    }),
    {
      name: "notebook-dashboard-state",
    },
  ),
);
