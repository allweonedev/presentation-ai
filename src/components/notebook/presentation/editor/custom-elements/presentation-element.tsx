"use client";

import { cn } from "@/lib/utils";
import { PlateElement, type StyledPlateElementProps } from "platejs/react";

export const PresentationElement = ({
  children,
  ref,
  className,
  ...props
}: StyledPlateElementProps) => {
  return (
    <PlateElement
      ref={ref}
      className={cn(
        "relative transition-all duration-300 select-text!",
        className,
      )}
      {...props}
    >
      {children}
    </PlateElement>
  );
};

PresentationElement.displayName = "PresentationElement";
