"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, MoreVertical, Trash2 } from "lucide-react";
import { useSlideEditorContext } from "./SlideEditorContext";

export function MoreOptionsDropdown() {
  const {
    isMenuOpen,
    setIsMenuOpen,
    setShowDeleteConfirm,
    onDuplicate,
    dragListeners,
  } = useSlideEditorContext();

  return (
    <DropdownMenu open={isMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8! cursor-grab rounded-full border border-white/20 bg-background/50 shadow-xs backdrop-blur-md transition-all hover:bg-background/80"
          {...dragListeners}
          onClick={() => setIsMenuOpen(true)}
        >
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onInteractOutside={() => setIsMenuOpen(false)}
        align="start"
        className="w-48"
      >
        <DropdownMenuItem onClick={onDuplicate} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Duplicate card
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setIsMenuOpen(false);
            setShowDeleteConfirm(true);
          }}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
