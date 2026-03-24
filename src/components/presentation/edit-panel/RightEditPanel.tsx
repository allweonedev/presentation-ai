"use client";

import { HelpMenu } from "@/components/sidebar/help-menu";
import { Button } from "@/components/ui/button";
import { usePresentationRecordingState } from "@/states/presentation-recording-state";
import { usePresentationState } from "@/states/presentation-state";
import { BarChart3, LayoutGrid, Link as LinkIcon, Video } from "lucide-react";
import { ZoomControl } from "../controls/ZoomControl";
import { TablePanelPopover } from "./sections/TablePanelPopover";

export function RightEditPanel() {
  const setActiveRightPanel = usePresentationState(
    (s) => s.setActiveRightPanel,
  );

  return (
    <div className="fixed right-3 bottom-4 z-30 flex justify-end lg:sticky lg:top-0 lg:right-auto lg:bottom-auto lg:z-auto lg:h-[calc(100dvh-4rem)] lg:flex-col lg:justify-between lg:px-3 lg:pr-6">
      <div className="flex flex-col items-end gap-3 lg:hidden">
        <HelpMenu hideKeyboardShortcutsOnMobile />
      </div>

      <div className="sheet-container relative hidden w-full max-w-max items-center justify-center gap-1 rounded-2xl border border-border/70 bg-background/95 px-2 py-2 shadow-lg backdrop-blur-sm lg:flex lg:flex-1 lg:items-center lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none">
        <div className="flex items-center gap-1 lg:absolute lg:top-1/2 lg:left-1/2 lg:flex-col lg:gap-3 lg:-translate-x-1/2 lg:-translate-y-1/2">
          <Button
            size="icon"
            variant="ghost"
            className="size-12"
            onClick={() => setActiveRightPanel("elements")}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="size-12"
            onClick={() => setActiveRightPanel("charts")}
          >
            <BarChart3 className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="size-12"
            onClick={() => setActiveRightPanel("embed")}
          >
            <LinkIcon className="h-5 w-5" />
          </Button>

          <TablePanelPopover />
          <Button
            size="icon"
            variant="ghost"
            className="size-12"
            onClick={() => {
              // enter present mode and open recording setup
              usePresentationState.getState().resetPresentingScaleLocks();
              usePresentationState.getState().setIsPresentingLoading(true);
              usePresentationState.getState().setIsPresenting(true);
              usePresentationRecordingState.getState().setWantsToRecord(true);
            }}
          >
            <Video className="h-5 w-5" />
          </Button>
        </div>
        <div className="ml-1 flex items-center gap-1 border-l border-border/70 pl-1 lg:absolute lg:bottom-4 lg:left-1/2 lg:ml-0 lg:flex-col lg:-translate-x-1/2 lg:border-l-0 lg:border-t lg:border-border/70 lg:pl-0 lg:pt-1">
          <ZoomControl />
          <HelpMenu hideKeyboardShortcutsOnMobile />
        </div>
      </div>
    </div>
  );
}
