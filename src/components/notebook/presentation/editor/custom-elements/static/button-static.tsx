import { cn } from "@/lib/utils";
import { type TElement } from "platejs";
import { SlateElement, type SlateElementProps } from "platejs/static";
import type * as React from "react";
import { type BUTTON_ELEMENT } from "../../lib";

type ButtonStaticElement = TElement & {
  type: typeof BUTTON_ELEMENT;
  variant?: "filled" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export default function ButtonStatic(
  props: SlateElementProps<ButtonStaticElement>,
) {
  const element = props.element as ButtonStaticElement;
  const variant = element.variant ?? "filled";
  const size = element.size ?? "md";

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1 text-sm"
      : size === "lg"
        ? "px-6 py-3 text-lg"
        : "px-4 py-2 text-base";

  const commonClasses =
    "inline-flex items-center gap-2 font-medium transition-(--presentation-transition)";

  const variantClasses =
    variant === "outline"
      ? "border"
      : variant === "ghost"
        ? "bg-transparent"
        : "";

  const style: React.CSSProperties = (() => {
    const baseStyle = {
      borderRadius: "var(--presentation-button-border-radius, 0.5rem)",
    };

    if (variant === "outline") {
      return {
        ...baseStyle,
        color: element.color || "var(--presentation-primary)",
        backgroundColor: "transparent",
        borderColor: element.color || "var(--presentation-primary)",
      } as React.CSSProperties;
    }
    if (variant === "ghost") {
      return {
        ...baseStyle,
        color: element.color || "var(--presentation-primary)",
        backgroundColor: "transparent",
      } as React.CSSProperties;
    }
    return {
      ...baseStyle,
      backgroundColor: element.color || "var(--presentation-primary)",
      color: "var(--presentation-background)",
      boxShadow: "var(--presentation-button-shadow, 0 2px 4px rgba(0,0,0,0.1))",
    } as React.CSSProperties;
  })();

  return (
    <SlateElement
      {...props}
      className={cn("transition-all duration-300", props.className)}
    >
      <div
        className={cn(
          "presentation-element",
          commonClasses,
          sizeClasses,
          variantClasses,
        )}
        style={style}
      >
        {props.children}
      </div>
    </SlateElement>
  );
}

