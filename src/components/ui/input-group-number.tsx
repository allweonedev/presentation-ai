"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface InputGroupNumberProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "onChange"
> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * A custom number input component using InputGroup pattern.
 * Features up/down arrow buttons on the right side for incrementing/decrementing.
 */
function InputGroupNumber({
  className,
  value,
  onChange,
  min = 1,
  max = 50,
  step = 1,
  disabled,
  ...props
}: InputGroupNumberProps) {
  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      onChange(min);
      return;
    }
    const parsedValue = parseInt(inputValue, 10);
    if (!Number.isNaN(parsedValue)) {
      const clampedValue = Math.max(min, Math.min(max, parsedValue));
      onChange(clampedValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleDecrement();
    }
  };

  return (
    <div
      data-slot="input-group"
      role="group"
      data-disabled={disabled}
      className={cn(
        "group/input-group relative flex w-full items-center rounded-md border border-input shadow-2xs outline-hidden transition-[color,box-shadow] dark:bg-input/30",
        "h-9",
        // Focus state
        "has-[[data-slot=input-group-control]:focus-visible]:ring-1 has-[[data-slot=input-group-control]:focus-visible]:ring-ring",
        // Disabled state
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {/* Number Input */}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        data-slot="input-group-control"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          "h-full w-10 flex-1 bg-transparent px-3 py-1.5 text-sm outline-hidden",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          disabled && "cursor-not-allowed",
        )}
        {...props}
      />

      {/* Increment/Decrement Buttons */}
      <div
        data-slot="input-group-addon"
        data-align="inline-end"
        className="flex h-full flex-col border-l border-input"
      >
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          tabIndex={-1}
          aria-label="Increment"
          className={cn(
            "flex h-1/2 items-center justify-center px-2 text-muted-foreground transition-colors",
            "hover:bg-muted/50 hover:text-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground",
            "border-b border-input",
          )}
        >
          <ChevronUp className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          tabIndex={-1}
          aria-label="Decrement"
          className={cn(
            "flex h-1/2 items-center justify-center px-2 text-muted-foreground transition-colors",
            "hover:bg-muted/50 hover:text-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-muted-foreground",
          )}
        >
          <ChevronDown className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export { InputGroupNumber };
