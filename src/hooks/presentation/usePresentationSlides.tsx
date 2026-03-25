"use client";

import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import { usePresentationState } from "@/states/presentation-state";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useCallback, useMemo } from "react";

interface SlideWithId extends PlateSlide {
  id: string;
}

export function usePresentationSlides() {
  // Subscribe to slide IDs only for rendering - prevents re-render when content changes
  // shallow ensures array comparison is shallow (same values = no re-render)
  const slideIds = usePresentationState((s) =>
    s.slides.map((slide) => slide.id),
  );
  // Keep full slides reference for drag operations only
  const slides = usePresentationState((s) => s.slides);
  const setSlides = usePresentationState((s) => s.setSlides);
  const setCurrentSlideId = usePresentationState((s) => s.setCurrentSlideId);
  const isPresenting = usePresentationState((s) => s.isPresenting);
  const setIsReorderingSlides = usePresentationState(
    (s) => s.setIsReorderingSlides,
  );

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Memoize slide IDs for stable reference
  const items = useMemo(() => slideIds, [slideIds]);

  // Handle drag end - needs full slides for reordering
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (isPresenting) return; // Prevent drag when presenting

      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = slides.findIndex(
          (item: SlideWithId) => item.id === active.id,
        );
        const newIndex = slides.findIndex(
          (item: SlideWithId) => item.id === over.id,
        );
        const newArray = arrayMove(slides, oldIndex, newIndex);
        setSlides([...newArray]);
        // Update current slide to the dragged slide's ID (not new position index)
        setCurrentSlideId(active.id as string);
      }
      // Clear reordering flag at end
      setIsReorderingSlides(false);
    },
    [slides, isPresenting, setSlides, setCurrentSlideId, setIsReorderingSlides],
  );

  // Expose a start handler to set reordering flag (to be wired in DndContext)
  const handleDragStart = useCallback(() => {
    if (isPresenting) return;
    setIsReorderingSlides(true);
  }, [isPresenting, setIsReorderingSlides]);

  // Scroll to a slide by index
  const scrollToSlide = useCallback((id: string) => {
    // Target the slide wrapper instead of slide container
    const slideElement = document.querySelector(`.slide-wrapper-${id}`);

    if (slideElement) {
      // Find the scrollable container
      const scrollContainer = document.querySelector(".presentation-slides");

      if (scrollContainer) {
        // Calculate the scroll position
        scrollContainer.scrollTo({
          top: (slideElement as HTMLElement).offsetTop - 30, // Add a small offset for better visibility
          behavior: "smooth",
        });
      }
    }
  }, []);

  return {
    items,
    slideIds,
    slides, // Still exposed for components that need full slide data
    sensors,
    isPresenting,
    handleDragStart,
    handleDragEnd,
    scrollToSlide,
  };
}
