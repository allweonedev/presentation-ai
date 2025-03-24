"use client";

import { GripVertical, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePresentationState } from "@/states/presentation-state";
import { type PlateSlide } from "../utils/parser";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SlideEditPopover } from "./SlideEditPopover";
import { nanoid } from "nanoid";

interface SlideContainerProps {
  children: React.ReactNode;
  index: number;
  id: string;
  className?: string;
}

export function SlideContainer({
  children,
  index,
  id,
  className,
}: SlideContainerProps) {
  const { slides, setSlides } = usePresentationState();

  const currentSlide = slides[index];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const addNewSlide = (position: "before" | "after") => {
    const newSlide: PlateSlide = {
      content: [
        {
          type: "h1",
          children: [{ text: "New Slide" }],
        },
      ],
      id: nanoid(),
      alignment: "center",
    };

    const updatedSlides = [...slides];
    const insertIndex = position === "before" ? index : index + 1;
    updatedSlides.splice(insertIndex, 0, newSlide);
    setSlides(updatedSlides);
  };

  const deleteSlide = () => {
    const updatedSlides = [...slides];
    updatedSlides.splice(index, 1);
    setSlides(updatedSlides);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/card-container relative grid w-full place-items-center pb-6",
        isDragging && "z-50 opacity-50",
      )}
      {...attributes}
    >
      <div
        className={cn(
          "relative w-full",
          currentSlide?.width !== "M" && "max-w-5xl",
          currentSlide?.width !== "L" && "max-w-6xl",
          className,
        )}
      >
        <div className="absolute left-4 top-2 z-[100] flex opacity-0 transition-opacity duration-200 group-hover/card-container:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="!size-8 cursor-grab rounded-full"
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>

          <SlideEditPopover index={index} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="!size-8 rounded-full shadow-sm hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Slide</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete slide {index + 1}? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button variant="destructive" onClick={deleteSlide}>
                    Delete
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {children}
      </div>
      {/* Add slide after button */}
      <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover/card-container:opacity-100">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background shadow-md"
          onClick={() => addNewSlide("after")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
