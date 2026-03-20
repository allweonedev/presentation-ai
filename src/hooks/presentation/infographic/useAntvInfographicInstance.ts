"use client";

import { Infographic } from "@antv/infographic";
import { useEffect, useRef, type RefObject } from "react";

export function useAntvInfographicInstance(
  containerRef: RefObject<HTMLDivElement | null>,
  editBarContainerRef?: RefObject<HTMLElement | null>,
) {
  const infographicRef = useRef<Infographic | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const editBarContainer = editBarContainerRef?.current ?? null;

    const instance = new Infographic({
      container,
      width: "100%",
      height: "100%",
      editable: true,
      // interactions: [
      //   new DblClickEditText(),
      //   new BrushSelect(),
      //   new ClickSelect(),
      //   new DragElement(),
      //   new HotkeyHistory(),
      // ],
    });

    infographicRef.current = instance;

    const getSvg = () => container.querySelector("svg");
    const getEditBar = () =>
      (editBarContainer ?? container).querySelector(
        '[data-element-type="infographic-component"]',
      ) as HTMLElement | null;

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const svg = getSvg();
      const editBar = getEditBar();
      if (!svg) return;
      const inSvg = svg.contains(target);
      const inEditBar = !!editBar && editBar.contains(target);
      const inPopover =
        target instanceof Element &&
        !!target.closest(".infographic-edit-popover");
      const inFloatingToolbar =
        target instanceof Element &&
        !!target.closest(".antv-infographic-toolbar-floating");

      if (!inSvg && !inEditBar && !inPopover && !inFloatingToolbar) {
        (
          instance as unknown as { editor?: any }
        )?.editor?.interaction?.clearSelection?.();
      } else {
        requestAnchorCapture();
      }
    };

    document.addEventListener("click", handleDocumentClick, true);

    type EditBarAnchor = {
      bar: HTMLElement;
      boundsEl: SVGGraphicsElement;
      offsetX: number;
      offsetY: number;
      slideId?: string;
      index?: number;
    };

    let rafId: number | null = null;
    let anchorRafId: number | null = null;
    const anchorRef = { current: null as EditBarAnchor | null };

    const isEditBarElement = (node: HTMLElement) => {
      if (node.classList.contains("infographic-edit-popover__content")) {
        return false;
      }
      return Boolean(node.querySelector(".infographic-edit-popover"));
    };

    const isVisibleEditBar = (node: HTMLElement) => {
      const style = window.getComputedStyle(node);
      return (
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        node.isConnected
      );
    };

    const getSlideContainer = (node: HTMLElement | null) => {
      if (!node) return null;
      const className = Array.from(node.classList).find((value) =>
        value.startsWith("slide-container-"),
      );
      if (className) {
        return document.querySelector<HTMLElement>(`.${className}`) ?? null;
      }
      return node.closest<HTMLElement>('[class*="slide-container-"]');
    };

    const getInfographicMeta = () => {
      const host = (editBarContainer ?? container) as HTMLElement;
      const slideContainer = getSlideContainer(host);
      const slideClass = slideContainer
        ? Array.from(slideContainer.classList).find((value) =>
            value.startsWith("slide-container-"),
          )
        : undefined;
      const slideId = slideClass
        ? slideClass.replace("slide-container-", "")
        : undefined;

      let index = -1;
      if (slideClass) {
        const items = Array.from(
          document.querySelectorAll<HTMLElement>(
            `.${slideClass} .infographic-content`,
          ),
        );
        index = items.indexOf(host);
        if (index >= 0) {
          host.dataset.infographicIndex = String(index);
          if (slideId) host.dataset.infographicSlideId = slideId;
        }
      }

      return { host, slideId, index };
    };

    const getSelectionBoundsElement = () => {
      const svg = getSvg();
      if (!svg) return null;

      const dashed = svg.querySelector<SVGRectElement>(
        'rect[stroke-dasharray="4 2"]',
      );
      if (dashed) return dashed;

      const transient = svg.querySelector<SVGGElement>(
        'g[data-element-type="transient-container"]',
      );
      if (!transient) return null;

      const combined = transient.querySelector<SVGRectElement>(
        'rect[stroke="#3384F5"][stroke-width="2"]',
      );
      if (combined) return combined;

      return transient.querySelector<SVGRectElement>('rect[stroke="#3384F5"]');
    };

    const findActiveEditBar = () => {
      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-element-type="infographic-component"]',
        ),
      ).filter(isEditBarElement);
      if (!candidates.length) return null;

      const visible = candidates.filter(isVisibleEditBar);
      const list = visible.length ? visible : candidates;
      if (!list.length) return null;

      const { host, slideId, index } = getInfographicMeta();
      if (slideId && index >= 0) {
        const match = list.find(
          (bar) =>
            bar.dataset.infographicSlideId === slideId &&
            bar.dataset.infographicIndex === String(index),
        );
        if (match) return match;
      }

      const hostRect = host.getBoundingClientRect();
      const hostCenterX = hostRect.left + hostRect.width / 2;
      const hostCenterY = hostRect.top + hostRect.height / 2;
      const ranked = list
        .map((bar) => {
          const rect = bar.getBoundingClientRect();
          const dx = rect.left + rect.width / 2 - hostCenterX;
          const dy = rect.top + rect.height / 2 - hostCenterY;
          return { bar, distance: dx * dx + dy * dy };
        })
        .sort((a, b) => a.distance - b.distance);

      return ranked[0]?.bar ?? null;
    };

    const getScrollContainer = () =>
      container.closest(".presentation-slides") ??
      document.querySelector<HTMLElement>(".presentation-slides");

    const captureAnchor = () => {
      const bar = findActiveEditBar();
      const boundsEl = getSelectionBoundsElement();
      if (!bar || !boundsEl || !isVisibleEditBar(bar)) {
        anchorRef.current = null;
        return;
      }

      const barRect = bar.getBoundingClientRect();
      const boundsRect = boundsEl.getBoundingClientRect();
      const { slideId, index } = getInfographicMeta();
      if (slideId) bar.dataset.infographicSlideId = slideId;
      if (index >= 0) bar.dataset.infographicIndex = String(index);

      anchorRef.current = {
        bar,
        boundsEl,
        offsetX: barRect.left - boundsRect.left,
        offsetY: barRect.top - boundsRect.top,
        slideId: slideId ?? undefined,
        index: index >= 0 ? index : undefined,
      };
    };

    const requestAnchorCapture = () => {
      if (anchorRafId !== null) return;
      anchorRafId = window.requestAnimationFrame(() => {
        anchorRafId = window.requestAnimationFrame(() => {
          anchorRafId = null;
          captureAnchor();
        });
      });
    };

    const syncEditBarPosition = () => {
      rafId = null;
      const { slideId, index } = getInfographicMeta();
      let anchor = anchorRef.current;
      if (
        anchor &&
        ((slideId && anchor.slideId && anchor.slideId !== slideId) ||
          (index >= 0 && anchor.index !== undefined && anchor.index !== index))
      ) {
        anchorRef.current = null;
        anchor = null;
      }

      if (!anchor || !anchor.boundsEl.isConnected || !anchor.bar.isConnected) {
        captureAnchor();
        anchor = anchorRef.current;
      }
      if (!anchor) return;

      const boundsRect = anchor.boundsEl.getBoundingClientRect();
      if (!Number.isFinite(boundsRect.left) || !Number.isFinite(boundsRect.top))
        return;

      anchor.bar.style.left = `${boundsRect.left + anchor.offsetX}px`;
      anchor.bar.style.top = `${boundsRect.top + anchor.offsetY}px`;
    };

    const requestSync = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(syncEditBarPosition);
    };

    const scrollContainer = getScrollContainer();
    const handleScroll = () => requestSync();
    const handleResize = () => {
      requestAnchorCapture();
      requestSync();
    };

    scrollContainer?.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    window.addEventListener("resize", handleResize);
    container.addEventListener("pointerup", requestAnchorCapture, true);
    container.addEventListener("keyup", requestAnchorCapture, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      scrollContainer?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerup", requestAnchorCapture, true);
      container.removeEventListener("keyup", requestAnchorCapture, true);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (anchorRafId !== null) {
        window.cancelAnimationFrame(anchorRafId);
      }

      try {
        instance.destroy();
      } catch {
        // Ignore destruction errors
      }
      infographicRef.current = null;
    };
  }, [containerRef]);

  return infographicRef;
}
