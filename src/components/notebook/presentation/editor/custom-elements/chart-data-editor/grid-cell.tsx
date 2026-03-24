import type React from "react";

interface GridCellProps {
  value: string | number;
  type?: "text" | "number";
  rowIndex: number;
  colIndex: number;
  placeholder?: string;
  onUpdate: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  registerRef: (el: HTMLInputElement | null) => void;
  isFocused?: boolean;
}

export function GridCell({
  value,
  type = "text",
  placeholder = "",
  onUpdate,
  onKeyDown,
  onFocus,
  registerRef,
  isFocused,
}: GridCellProps) {
  return (
    <input
      ref={registerRef}
      type={type}
      value={value}
      onChange={(e) => onUpdate(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      className={`h-8 w-full border-0 bg-transparent px-2 py-1 text-sm outline-hidden ${type === "number" ? "text-right font-mono tabular-nums" : "text-left"} ${isFocused ? "bg-primary/5 ring-2 ring-primary ring-inset" : ""} [appearance:textfield] placeholder:text-muted-foreground/50 focus:bg-primary/5 focus:ring-2 focus:ring-primary focus:ring-inset [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
      placeholder={placeholder}
    />
  );
}
