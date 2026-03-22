import { create } from "zustand";

type NotesState = {
  isImageGenerationModelOpen: boolean;
  isGenerating: boolean;
  setIsImageGenerationModelOpen: (open: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
};

export const useNotesState = create<NotesState>((set) => ({
  isImageGenerationModelOpen: false,
  isGenerating: false,
  setIsImageGenerationModelOpen: (open) =>
    set({ isImageGenerationModelOpen: open }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
