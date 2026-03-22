"use client";

import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import { type ThemeProperties, type Themes } from "@/lib/presentation/themes";
import { create } from "zustand";
import { usePresentationState } from "./presentation-state";

// Maximum number of history entries to keep
const MAX_HISTORY_SIZE = 50;
// Rate limit: minimum ms between history pushes for same slide
const RATE_LIMIT_MS = 300;

/**
 * Represents a snapshot of a change in the presentation state.
 * optimization: Stores only what changed rather than the full state when possible.
 */
export interface HistoryEntry {
  timestamp: number;

  // Type of change
  changeType: "slide" | "theme" | "full";

  // For 'slide' change
  slide?: PlateSlide;
  slideId?: string;

  // For 'theme' change
  theme?: Themes | string;
  customThemeData?: ThemeProperties | null;

  // For 'full' change (fallback for reordering or bulk updates)
  slides?: PlateSlide[];
}

/**
 * History state with past, present, and future stacks
 */
export interface HistoryState {
  past: HistoryEntry[];
  present: HistoryEntry | null;
  future: HistoryEntry[];
}

interface PresentationHistoryState {
  history: HistoryState;
  canUndo: boolean;
  canRedo: boolean;

  // Rate limiting state
  lastPushTime: number;
  lastPushedSlideId: string | null;

  // Block pushes during restore (undo/redo)
  isRestoring: boolean;

  // Actions
  pushSnapshot: (
    changedSlideId?: string,
    changeType?: "slide" | "theme" | "full",
  ) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  initializeHistory: (
    slides: PlateSlide[],
    theme?: Themes | string,
    customThemeData?: ThemeProperties | null,
  ) => void;
}

function createInitialHistory(): HistoryState {
  return {
    past: [],
    present: null,
    future: [],
  };
}

export const usePresentationHistoryState = create<PresentationHistoryState>(
  (set, get) => ({
    history: createInitialHistory(),
    canUndo: false,
    canRedo: false,
    lastPushTime: 0,
    lastPushedSlideId: null,
    isRestoring: false,

    pushSnapshot: (
      changedSlideId?: string,
      changeType: "slide" | "theme" | "full" = "full",
    ) => {
      const state = get();

      // Block first push after restore (this is the editor sync), then reset flag
      if (state.isRestoring) {
        set({ isRestoring: false });
        // However, if this is a 'slide' update (user edit), we might want to capture it if it's not a restore artifact?
        // But preventing loops is priority.
        return;
      }

      const { slides, theme, customThemeData } =
        usePresentationState.getState();

      if (slides.length === 0) return;

      const now = Date.now();
      let newEntry: HistoryEntry | null = null;
      let shouldMerge = false;

      // --- HANDLE SLIDE CHANGE ---
      if (changeType === "slide" && changedSlideId) {
        const changedSlide = slides.find((s) => s.id === changedSlideId);
        if (!changedSlide) return;

        // Skip if identical to present
        if (
          state.history.present?.changeType === "slide" &&
          state.history.present.slideId === changedSlideId
        ) {
          const currentSlideString = JSON.stringify(changedSlide);
          const presentSlideString = JSON.stringify(
            state.history.present.slide,
          );
          if (currentSlideString === presentSlideString) return;
        }

        // Rate limiting for same slide
        if (
          changedSlideId === state.lastPushedSlideId &&
          now - state.lastPushTime < RATE_LIMIT_MS &&
          state.history.present?.changeType === "slide" &&
          state.history.present.slideId === changedSlideId
        ) {
          shouldMerge = true;
        }

        newEntry = {
          timestamp: now,
          changeType: "slide",
          slide: JSON.parse(JSON.stringify(changedSlide)),
          slideId: changedSlideId,
          theme,
          customThemeData,
        };
      }
      // --- HANDLE THEME CHANGE ---
      else if (changeType === "theme") {
        if (
          state.history.present?.changeType === "theme" &&
          state.history.present.theme === theme &&
          JSON.stringify(state.history.present.customThemeData) ===
            JSON.stringify(customThemeData)
        ) {
          return;
        }

        newEntry = {
          timestamp: now,
          changeType: "theme",
          theme,
          customThemeData,
        };
      }
      // --- HANDLE FULL CHANGE (Fallback) ---
      else {
        if (
          state.history.present?.slides &&
          JSON.stringify(slides) ===
            JSON.stringify(state.history.present.slides)
        ) {
          return;
        }

        newEntry = {
          timestamp: now,
          changeType: "full",
          slides: JSON.parse(JSON.stringify(slides)),
          theme,
          customThemeData,
        };
      }

      if (!newEntry) return;

      if (shouldMerge && state.history.present) {
        set({
          history: { ...state.history, present: newEntry },
          lastPushTime: now,
          lastPushedSlideId: changedSlideId ?? null,
        });
        return;
      }

      // If no present, this is the first entry
      if (state.history.present === null) {
        set({
          history: {
            past: [],
            present: newEntry,
            future: [],
          },
          canUndo: false,
          canRedo: false,
          lastPushTime: now,
          lastPushedSlideId: changedSlideId ?? null,
        });
        return;
      }

      const newPast = [...state.history.past, state.history.present];
      if (newPast.length > MAX_HISTORY_SIZE) {
        newPast.splice(0, newPast.length - MAX_HISTORY_SIZE);
      }

      set({
        history: {
          past: newPast,
          present: newEntry,
          future: [],
        },
        canUndo: true,
        canRedo: false,
        lastPushTime: now,
        lastPushedSlideId: changedSlideId ?? null,
      });
    },

    undo: () => {
      const state = get();
      const { past, present, future } = state.history;

      if (past.length === 0 || present === null) return;

      const previous = past[past.length - 1];
      if (!previous) return;

      const newPast = past.slice(0, -1);
      const newFuture = [present, ...future];

      // Set isRestoring to block pushes during editor sync
      set({
        history: {
          past: newPast,
          present: previous,
          future: newFuture,
        },
        canUndo: newPast.length > 0,
        canRedo: true,
        isRestoring: true,
      });

      const { slides, updateSlide, setSlides, setTheme } =
        usePresentationState.getState();

      if (previous.changeType === "full" && previous.slides) {
        setSlides(previous.slides, "history");
      } else if (
        previous.changeType === "slide" &&
        previous.slide &&
        previous.slideId
      ) {
        // Find if this slide still exists
        const slideExists = slides.some((s) => s.id === previous.slideId);
        if (slideExists) {
          updateSlide(
            previous.slideId,
            previous.slide as Partial<PlateSlide>,
            "history",
          );
        }
      }

      // Restore theme if present
      if (previous.theme !== undefined) {
        setTheme(previous.theme, previous.customThemeData ?? null, "history");
      }
    },

    redo: () => {
      const state = get();
      const { past, present, future } = state.history;

      if (future.length === 0 || present === null) return;

      const next = future[0];
      if (!next) return;

      const newFuture = future.slice(1);
      const newPast = [...past, present];

      // Set isRestoring to block pushes during editor sync
      set({
        history: {
          past: newPast,
          present: next,
          future: newFuture,
        },
        canUndo: true,
        canRedo: newFuture.length > 0,
        isRestoring: true,
      });

      const { slides, updateSlide, setSlides, setTheme } =
        usePresentationState.getState();

      if (next.changeType === "full" && next.slides) {
        setSlides(next.slides, "history");
      } else if (next.changeType === "slide" && next.slide && next.slideId) {
        const slideExists = slides.some((s) => s.id === next.slideId);
        if (slideExists) {
          updateSlide(
            next.slideId,
            next.slide as Partial<PlateSlide>,
            "history",
          );
        }
      }

      // Restore theme if present
      if (next.theme !== undefined) {
        setTheme(next.theme, next.customThemeData ?? null, "history");
      }
    },

    clearHistory: () => {
      set({
        history: createInitialHistory(),
        canUndo: false,
        canRedo: false,
        lastPushTime: 0,
        lastPushedSlideId: null,
        isRestoring: false,
      });
    },

    initializeHistory: (slides, theme, customThemeData) => {
      // For initialization, we store the initial state so we can undo back to it
      const initialEntry: HistoryEntry = {
        timestamp: Date.now(),
        changeType: "full",
        slides: JSON.parse(JSON.stringify(slides)),
        theme: theme ?? undefined,
        customThemeData: customThemeData,
      };

      set({
        history: {
          past: [],
          present: initialEntry,
          future: [],
        },
        canUndo: false,
        canRedo: false,
        lastPushTime: Date.now(),
        lastPushedSlideId: null,
        isRestoring: false,
      });
    },
  }),
);
