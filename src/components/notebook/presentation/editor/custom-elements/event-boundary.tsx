"use client";

import React, {
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

/**
 * List of event types to contain within the boundary.
 * These events will have stopPropagation() called on them.
 *
 * NOTE: We intentionally exclude mouse/pointer events to allow
 * parent editors (like Plate) to handle selection and focus.
 */
const DEFAULT_CONTAINED_EVENTS = [
  // Keyboard events
  "keydown",
  "keyup",
  "keypress",
  // Focus events
  "focusin",
  "focusout",
  // Input events
  "input",
  "change",
  "beforeinput",
  "compositionstart",
  "compositionupdate",
  "compositionend",
  // Form events
  "submit",
] as const;

type ContainedEventType = (typeof DEFAULT_CONTAINED_EVENTS)[number];

interface EventBoundaryProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
  /**
   * List of event types to contain. Defaults to keyboard/input/form events.
   * Does NOT include mouse/pointer events by default to preserve editor selection.
   */
  containedEvents?: readonly ContainedEventType[];
  /**
   * Whether the boundary is active. Set to false to disable event containment.
   * @default true
   */
  active?: boolean;
}

/**
 * A wrapper component that contains specified events within its boundary
 * by calling stopPropagation() on them. Useful for isolating interactive
 * components (like editors, forms, or third-party widgets) from parent
 * event handlers.
 *
 * @example
 * ```tsx
 * <EventBoundary>
 *   <ThirdPartyEditor />
 * </EventBoundary>
 * ```
 */
export const EventBoundary = React.forwardRef<
  HTMLDivElement,
  Omit<EventBoundaryProps, "ref">
>(
  (
    {
      children,
      containedEvents = DEFAULT_CONTAINED_EVENTS,
      active = true,
      ...divProps
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);

    // Use internal ref for event handling, forward the external ref
    useEffect(() => {
      if (!active) return;

      const el = internalRef.current;
      if (!el) return;

      const handler = (e: Event) => {
        e.stopPropagation();
      };

      // Only use bubble phase to allow events to reach children first,
      // then stop them from bubbling up to parent editors
      for (const type of containedEvents) {
        el.addEventListener(type, handler, { capture: false, passive: true });
      }

      return () => {
        for (const type of containedEvents) {
          el.removeEventListener(type, handler, { capture: false });
        }
      };
    }, [containedEvents, active]);

    // Merge refs - assign to both internal and external refs
    const setRefs = (node: HTMLDivElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <div {...divProps} ref={setRefs}>
        {children}
      </div>
    );
  },
);

EventBoundary.displayName = "EventBoundary";
