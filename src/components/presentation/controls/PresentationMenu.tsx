"use client";

import {
  createBlankPresentation,
  duplicatePresentation,
} from "@/app/_actions/notebook/presentation/presentationActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePresentationHistoryState } from "@/states/presentation-history-state";
import { usePresentationState } from "@/states/presentation-state";
import { useMutation } from "@tanstack/react-query";
import {
  Bot,
  Copy,
  FileEdit,
  FolderOpen,
  Palette,
  Plus,
  Redo,
  Settings,
  Undo,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export function PresentationMenu({
  readOnly = false,
}: {
  readOnly?: boolean;
}) {
  const currentPresentationId = usePresentationState(
    (state) => state.currentPresentationId,
  );
  const setCurrentPresentation = usePresentationState(
    (state) => state.setCurrentPresentation,
  );
  const setActiveRightPanel = usePresentationState(
    (state) => state.setActiveRightPanel,
  );
  const undo = usePresentationHistoryState((state) => state.undo);
  const redo = usePresentationHistoryState((state) => state.redo);
  const canUndo = usePresentationHistoryState((state) => state.canUndo);
  const canRedo = usePresentationHistoryState((state) => state.canRedo);
  const router = useRouter();

  const { mutateAsync: duplicatePresentationMutation, isPending: isDuplicating } =
    useMutation({
      mutationFn: async () => {
        if (!currentPresentationId) {
          toast.error("Current presentation is not available");
          throw new Error("CURRENT_PRESENTATION_ID_MISSING");
        }

        return duplicatePresentation(currentPresentationId);
      },
      onSuccess: (data) => {
        if (data.success && data.presentation) {
          setCurrentPresentation(data.presentation.id, data.presentation.title);
          router.push(`/presentation/${data.presentation.id}`);
          return;
        }

        toast.error(data.message);
      },
      onError: () => {
        toast.error("Failed to duplicate presentation");
      },
    });

  const {
    mutateAsync: createBlankPresentationMutation,
    isPending: isCreatingBlank,
  } = useMutation({
    mutationFn: async () => {
      const theme = usePresentationState.getState().theme;
      const language = usePresentationState.getState().language;

      return createBlankPresentation(
        "Untitled Presentation",
        theme ??
          (localStorage.getItem("theme") === "dark" ? "ebony" : "mystique"),
        language,
      );
    },
    onSuccess: (data) => {
      if (data.success && data.presentation) {
        setCurrentPresentation(data.presentation.id, data.presentation.title);
        router.push(`/presentation/${data.presentation.id}`);
        return;
      }

      toast.error(data.message);
    },
    onError: () => {
      toast.error("Failed to create presentation");
    },
  });

  const focusTitleInput = useCallback(() => {
    window.setTimeout(() => {
      const presentationTitleInput = document.getElementById(
        "presentation-title-input",
      );
      presentationTitleInput?.focus();
    }, 250);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open presentation menu">
          <FolderOpen className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuItem
          disabled={isCreatingBlank}
          onClick={() => void createBlankPresentationMutation()}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Presentation
        </DropdownMenuItem>
        {!readOnly ? (
          <DropdownMenuItem onClick={focusTitleInput}>
            <FileEdit className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          disabled={isDuplicating}
          onClick={() => void duplicatePresentationMutation()}
        >
          <Copy className="mr-2 h-4 w-4" />
          {readOnly ? "Clone to My Account" : "Duplicate"}
        </DropdownMenuItem>

        {!readOnly ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!canUndo} onClick={undo}>
              <Undo className="mr-2 h-4 w-4" />
              Undo
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!canRedo} onClick={redo}>
              <Redo className="mr-2 h-4 w-4" />
              Redo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveRightPanel("globalSettings")}>
              <Settings className="mr-2 h-4 w-4" />
              Page setup
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveRightPanel("theme")}>
              <Palette className="mr-2 h-4 w-4" />
              Theme panel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveRightPanel("agent")}>
              <Bot className="mr-2 h-4 w-4" />
              Agent panel
            </DropdownMenuItem>
          </>
        ) : null}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/presentation")}>
          <FolderOpen className="mr-2 h-4 w-4" />
          All Presentations
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
