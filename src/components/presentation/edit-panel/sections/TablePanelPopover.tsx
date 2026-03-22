"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { Table } from "lucide-react";
import { KEYS, type TElement } from "platejs";
import { useState } from "react";

// Helper function to create a table node with specified dimensions
const createTableNode = (rows: number, cols: number): TElement => {
  const createParagraph = () => ({
    type: KEYS.p,
    children: [{ text: "" }],
  });

  const createCell = () => ({
    type: KEYS.td,
    children: [createParagraph()],
  });

  const createRow = () => ({
    type: KEYS.tr,
    children: Array.from({ length: cols }, createCell),
  });

  return {
    type: KEYS.table,
    children: Array.from({ length: rows }, createRow),
  } as unknown as TElement;
};

export function TablePanelPopover() {
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Access presentation state
  const slides = usePresentationState((s) => s.slides);
  const currentSlideId = usePresentationState((s) => s.currentSlideId);
  const setSlides = usePresentationState((s) => s.setSlides);

  const handleMouseEnter = (r: number, c: number) => {
    setRows(r);
    setCols(c);
  };

  const handleClick = () => {
    if (rows === 0 || cols === 0) return;

    // Create table node
    const tableNode = createTableNode(rows, cols);

    // Update slide content by ID
    const updatedSlides = slides.map((slide) => {
      if (slide.id === currentSlideId) {
        return {
          ...slide,
          content: [...slide.content, tableNode],
        };
      }
      return slide;
    });

    // Update slides state
    setSlides(updatedSlides);

    // Close popover
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="size-12">
          <Table className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" className="w-auto p-4" align="start">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-muted-foreground">
            {rows > 0 && cols > 0 ? `${cols}x${rows} Table` : "Insert Table"}
          </div>
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: "repeat(10, 1fr)",
            }}
            onMouseLeave={() => {
              setRows(0);
              setCols(0);
            }}
          >
            {Array.from({ length: 100 }).map((_, i) => {
              const r = Math.floor(i / 10) + 1;
              const c = (i % 10) + 1;
              const isSelected = r <= rows && c <= cols;

              return (
                <div
                  key={i}
                  className={cn(
                    "h-4 w-4 cursor-pointer rounded-sm border transition-colors",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/20 bg-muted hover:border-primary/50",
                  )}
                  onMouseEnter={() => handleMouseEnter(r, c)}
                  onClick={handleClick}
                />
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
