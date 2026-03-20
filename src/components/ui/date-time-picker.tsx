"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./button";
import { Calendar } from "./calendar";

interface DateTimePickerProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  className?: string;
}

export function DateTimePicker({
  date,
  onDateChange,
  className,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(date);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Format time as 24-hour format for internal calculations
  const getTimeString = (date: Date | null) => {
    if (!date) return "00:00";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [time, setTime] = useState<string>(() => {
    if (date) {
      return getTimeString(date);
    }
    // Default to current hour, rounded to nearest 15 minutes
    const now = new Date();
    const minutes = Math.ceil(now.getMinutes() / 15) * 15;
    now.setMinutes(minutes === 60 ? 0 : minutes, 0, 0);
    if (minutes === 60) {
      now.setHours(now.getHours() + 1);
    }
    return getTimeString(now);
  });

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) return;

    setSelectedDate(selected);

    // Apply the selected time to the date
    const [hours, minutes] = time.split(":");
    selected.setHours(parseInt(hours ?? "0", 10), parseInt(minutes ?? "0", 10));

    onDateChange(selected);
  };

  const handleTimeSelect = (timeValue: string) => {
    setTime(timeValue);

    if (selectedDate) {
      const [hours, minutes] = timeValue.split(":");
      const newDate = new Date(selectedDate.getTime());
      newDate.setHours(
        parseInt(hours ?? "0", 10),
        parseInt(minutes ?? "0", 10),
      );

      setSelectedDate(newDate);
      onDateChange(newDate);
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("flex w-full", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full font-normal",
              !date && "text-muted-foreground",
            )}
          >
            {date ? (
              `${format(date, "PPP")}, ${format(date, "p")}`
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto items-start p-0" align="start">
          <div ref={calendarRef}>
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={handleDateSelect}
              fromYear={2000}
              toYear={new Date().getFullYear() + 10}
              defaultMonth={date ?? undefined}
            />
          </div>
          <div className="my-4 mr-2 w-[120px]">
            <ScrollArea
              className="h-72 pr-2.5"
              onWheel={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="flex h-max flex-col gap-2">
                {Array.from({ length: 96 }).map((_, i) => {
                  const hour = Math.floor(i / 4)
                    .toString()
                    .padStart(2, "0");
                  const minute = ((i % 4) * 15).toString().padStart(2, "0");
                  const timeValue = `${hour}:${minute}`;
                  const displayTime = new Date();
                  displayTime.setHours(
                    parseInt(hour, 10),
                    parseInt(minute, 10),
                  );

                  return (
                    <Button
                      key={i}
                      className="w-full px-2 text-left"
                      variant="outline"
                      onClick={() => handleTimeSelect(timeValue)}
                    >
                      {format(displayTime, "p")}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
