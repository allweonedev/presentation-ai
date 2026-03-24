"use client";

import {
  AreaChart,
  BarChart3,
  ChartScatter,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type SeriesChartType } from "./types";

interface ChartTypePickerProps {
  value: SeriesChartType;
  onChange: (type: SeriesChartType) => void;
}

const CHART_TYPE_OPTIONS: {
  value: SeriesChartType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "bar",
    label: "Bar",
    icon: <BarChart3 className="h-3.5 w-3.5" />,
  },
  {
    value: "line",
    label: "Line",
    icon: <TrendingUp className="h-3.5 w-3.5" />,
  },
  {
    value: "area",
    label: "Area",
    icon: <AreaChart className="h-3.5 w-3.5" />,
  },
  {
    value: "scatter",
    label: "Scatter",
    icon: <ChartScatter className="h-3.5 w-3.5" />,
  },
];

export function ChartTypePicker({ value, onChange }: ChartTypePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    CHART_TYPE_OPTIONS.find((opt) => opt.value === value) ||
    CHART_TYPE_OPTIONS[0];

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Use capture phase to catch the event before dialog does
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (
    e: React.MouseEvent,
    optionValue: SeriesChartType,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="flex h-6 items-center gap-0.5 rounded px-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        title={`Chart type: ${selectedOption?.label}`}
        onClick={handleTriggerClick}
      >
        {selectedOption?.icon}
        <ChevronDown className="h-2.5 w-2.5" />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 z-100 mt-1 min-w-[100px] animate-in rounded-md border bg-popover p-1 text-popover-foreground shadow-md fade-in-0 zoom-in-95"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {CHART_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={(e) => handleOptionClick(e, option.value)}
              className={`flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                option.value === value ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
