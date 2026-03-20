"use client";

import { type LayoutType } from "@/components/notebook/presentation/utils/parser";
import { serializeSlidesToXml } from "@/components/notebook/presentation/utils/slide-serializer";
import { usePresentationState } from "@/states/presentation-state";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import {
  type ContentAlignment,
  type SlideUpdatePayload,
  layoutMap,
} from "./types";

interface SlideEditorContextValue {
  // State
  slideId: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  aiInput: string;
  setAiInput: (input: string) => void;
  selectedLayout: number;
  setSelectedLayout: (layout: number) => void;

  // Callbacks
  onDuplicate?: () => void;
  onDelete?: () => void;
  dragListeners?: React.HTMLAttributes<HTMLElement>;

  // Derived state
  currentSlide:
    | ReturnType<typeof usePresentationState.getState>["slides"][0]
    | undefined;
  currentTheme: string;
  currentThemeData: ReturnType<
    typeof usePresentationState.getState
  >["customThemeData"];
  currentLayout: LayoutType;
  currentWidth: "S" | "M" | "L";
  currentAlignment: ContentAlignment;
  hasRootImage: boolean;

  // Actions
  updateSlide: (updates: SlideUpdatePayload) => void;
  handleImageEdit: () => void;
  handleLayoutChange: (idx: number) => void;
  handleAiSubmit: () => void;
  handleAiKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SlideEditorContext = createContext<SlideEditorContextValue | null>(null);

export function useSlideEditorContext() {
  const context = useContext(SlideEditorContext);
  if (!context) {
    throw new Error(
      "useSlideEditorContext must be used within SlideEditorProvider",
    );
  }
  return context;
}

interface SlideEditorProviderProps {
  slideId: string;
  dragListeners?: React.HTMLAttributes<HTMLElement>;
  onDuplicate?: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

export function SlideEditorProvider({
  slideId,
  dragListeners,
  onDuplicate,
  onDelete,
  children,
}: SlideEditorProviderProps) {
  const openImageEditor = usePresentationState((s) => s.openImageEditor);
  const setCurrentSlideId = usePresentationState((s) => s.setCurrentSlideId);
  const setPendingAgentMessage = usePresentationState(
    (s) => s.setPendingAgentMessage,
  );
  const setActiveRightPanel = usePresentationState(
    (s) => s.setActiveRightPanel,
  );

  // Local state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [aiInput, setAiInput] = useState("");

  // Helper to get current slide data on-demand
  const getCurrentSlideData = useCallback(() => {
    const { slides } = usePresentationState.getState();
    const currentSlide = slides.find((s) => s.id === slideId);
    return {
      currentSlide,
      currentLayout: currentSlide?.layoutType ?? "none",
      currentWidth: currentSlide?.width ?? "M",
      currentAlignment: currentSlide?.alignment ?? "start",
      hasRootImage: !!currentSlide?.rootImage?.url,
    };
  }, [slideId]);

  // Derived state from Zustand (non-reactive for theme)
  const currentTheme = usePresentationState.getState().theme;
  const currentThemeData = usePresentationState.getState().customThemeData;

  // Get initial slide data for selected layout initialization
  const initialSlideData = getCurrentSlideData();

  // Selected layout state
  const [selectedLayout, setSelectedLayout] = useState(
    initialSlideData.currentLayout === "vertical"
      ? 0
      : initialSlideData.currentLayout === "left"
        ? 2
        : initialSlideData.currentLayout === "right"
          ? 3
          : initialSlideData.currentLayout === "background"
            ? 4
            : 1,
  );

  // Actions
  const updateSlide = useCallback(
    (updates: SlideUpdatePayload) => {
      const { slides, setSlides } = usePresentationState.getState();
      const updatedSlides = slides.map((slide) => {
        if (slide.id === slideId) {
          return {
            ...slide,
            ...updates,
          };
        }
        return slide;
      });
      setSlides(updatedSlides);
    },
    [slideId],
  );

  const handleImageEdit = useCallback(() => {
    setCurrentSlideId(slideId);
    openImageEditor("generate");
  }, [openImageEditor, setCurrentSlideId, slideId]);

  const handleLayoutChange = useCallback(
    (idx: number) => {
      setSelectedLayout(idx);
      updateSlide({ layoutType: layoutMap[idx] });
    },
    [updateSlide],
  );

  const handleAiSubmit = useCallback(() => {
    if (!aiInput.trim()) return;
    const { slides } = usePresentationState.getState();
    const slideToEdit = slides.find((s) => s.id === slideId);
    if (!slideToEdit) return;

    const slideXml = serializeSlidesToXml([slideToEdit], false);
    setPendingAgentMessage({
      message: aiInput.trim(),
      slideContext: slideXml,
    });
    setAiInput("");
    setActiveRightPanel("agent");
  }, [aiInput, slideId, setPendingAgentMessage, setActiveRightPanel]);

  const handleAiKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAiSubmit();
      }
    },
    [handleAiSubmit],
  );

  const value: SlideEditorContextValue = {
    slideId,
    isMenuOpen,
    setIsMenuOpen,
    showDeleteConfirm,
    setShowDeleteConfirm,
    aiInput,
    setAiInput,
    selectedLayout,
    setSelectedLayout,
    onDuplicate,
    onDelete,
    dragListeners,
    currentSlide: initialSlideData.currentSlide,
    currentTheme,
    currentThemeData,
    currentLayout: initialSlideData.currentLayout,
    currentWidth: initialSlideData.currentWidth,
    currentAlignment: initialSlideData.currentAlignment,
    hasRootImage: initialSlideData.hasRootImage,
    updateSlide,
    handleImageEdit,
    handleLayoutChange,
    handleAiSubmit,
    handleAiKeyDown,
  };

  return (
    <SlideEditorContext.Provider value={value}>
      {children}
    </SlideEditorContext.Provider>
  );
}
