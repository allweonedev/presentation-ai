import { usePresentationState } from "@/states/presentation-state";
import debounce from "lodash.debounce";
import { type RefObject, useEffect, useLayoutEffect, useState } from "react";

interface UsePresentationAutoScrollOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
  bottomThreshold?: number;
  disabled?: boolean;
}

export function usePresentationAutoScroll({
  containerRef,
  scrollRef,
  bottomThreshold = 10,
  disabled = false,
}: UsePresentationAutoScrollOptions) {
  const [hasUserScrolledUp, setHasUserScrolledUp] = useState(false);
  const [isDisabled, setIsDisabled] = useState(disabled);

  useLayoutEffect(() => {
    if (usePresentationState.getState().isGeneratingPresentation) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, []);

  const debouncedScroll = debounce(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 100);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleScroll() {
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom =
        scrollTop + clientHeight >= scrollHeight - bottomThreshold;
      setHasUserScrolledUp(!isAtBottom);
    }

    function handleResize() {
      if (!container) return;
      // If user hasn't scrolled up, scroll to bottom on resize
      if (!hasUserScrolledUp && !isDisabled) {
        debouncedScroll();
      }
    }

    container.addEventListener("wheel", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("wheel", handleScroll);
      resizeObserver.disconnect();
    };
  }, [containerRef, bottomThreshold, hasUserScrolledUp, disabled, scrollRef]);

  return {
    hasUserScrolledUp,
    setHasUserScrolledUp,
  };
}
