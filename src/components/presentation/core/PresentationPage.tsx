"use client";

import TouchAwareDndProvider from "@/components/globals/TouchAwareDndProvider";
import { ThemeBackground } from "@/components/notebook/presentation/components/theme/ThemeBackground";
import RecordingControls from "@/components/notebook/presentation/recording/RecordingControls";
import RecordingPreviewDialog from "@/components/notebook/presentation/recording/RecordingPreviewDialog";
import WebcamOverlay from "@/components/notebook/presentation/recording/WebcamOverlay";
import { usePresentationAutoScroll } from "@/hooks/presentation/usePresentationAutoScroll";
import { usePresentationData } from "@/hooks/presentation/usePresentationData";
import { usePresentationHistory } from "@/hooks/presentation/usePresentationHistory";
import { type ThemeProperties } from "@/lib/presentation/themes";
import { cn } from "@/lib/utils";
import { usePresentationRecordingState } from "@/states/presentation-recording-state";
import { usePresentationState } from "@/states/presentation-state";
import { useParams } from "next/navigation";
import { PlateController } from "platejs/react";
import { useEffect, useRef } from "react";
import { RightEditPanel } from "../edit-panel/RightEditPanel";
import { RightPanelRenderer } from "../edit-panel/RightPanelRenderer";
import { LoadingState } from "../shared/LoadingState";
import { PresentingLoadingOverlay } from "../shared/PresentingLoadingOverlay";
import { ThemeFontLoader } from "../shared/ThemeFontLoader";
import { SlideSidebar } from "../sidebar/SlideSidebar";
import { SlidesContainer } from "../slides/SlidesContainer";

import { AllCommunityModule, ModuleRegistry } from "ag-charts-community";
import { AllEnterpriseModule, LicenseManager } from "ag-charts-enterprise";

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);
LicenseManager.setLicenseKey(
  "[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-115834}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{15 January 2026}____[v3]_[0102]_MTc2ODQzNTIwMDAwMA==ae743528180d7c8b545a6196dd9a7f1a",
);

export default function PresentationPage({ readOnly = false }: { readOnly?: boolean }) {
  const params = useParams();
  const id = params.id as string;
  const isGeneratingPresentation = usePresentationState(
    (s) => s.isGeneratingPresentation,
  );
  const isPresenting = usePresentationState((s) => s.isPresenting);
  const isReadOnly = usePresentationState((s) => s.isReadOnly);
  const setIsReadOnly = usePresentationState((s) => s.setIsReadOnly);
  const resetPresentMode = usePresentationState((s) => s.resetPresentMode);
  const isPresentingLoading = usePresentationState(
    (s) => s.isPresentingLoading,
  );
  // const activeRightPanel = usePresentationState((s) => s.activeRightPanel);
  const wantsToRecord = usePresentationRecordingState((s) => s.wantsToRecord);
  // Load presentation data
  const { isLoading, currentThemeData } = usePresentationData(id, readOnly);

  // Auto scroll refs
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  usePresentationAutoScroll({
    containerRef,
    scrollRef,
  });

  // Track presentation history
  usePresentationHistory();

  useEffect(() => {
    resetPresentMode();
  }, [id, resetPresentMode]);

  useEffect(() => {
    setIsReadOnly(readOnly);
    return () => {
      setIsReadOnly(false);
    };
  }, [readOnly, setIsReadOnly]);

  const effectiveReadOnly = readOnly || isReadOnly;

  if (isLoading) {
    return <LoadingState />;
  }

  const themeData: ThemeProperties | undefined = currentThemeData ?? undefined;
  const showSlideSidebar = !isPresenting;
  const showEditPanels = !effectiveReadOnly && !isPresenting;

  return (
    <ThemeBackground className="flex h-full w-full">
      <TouchAwareDndProvider>
        <PlateController>
          {themeData && <ThemeFontLoader themeData={themeData} />}

          <div className="grid h-full w-full min-w-0 lg:grid-cols-[auto_minmax(0,1fr)]">
            <div className="hidden lg:flex">
              <SlideSidebar showSidebar={showSlideSidebar} />
            </div>
            <div
              className={cn(
                "presentation-slides flex min-w-0 w-full overflow-x-hidden overflow-y-auto",
                isPresenting && "fixed inset-0 pb-0",
              )}
            >
              <div className="mx-auto flex min-w-0 flex-1 flex-col space-y-8 px-3 pt-8 sm:px-0 sm:pt-16 lg:max-w-[95%] xl:max-w-[90%]">
                <div className="space-y-8" ref={containerRef}>
                  <SlidesContainer
                    isGeneratingPresentation={isGeneratingPresentation}
                    isReadOnly={effectiveReadOnly}
                  />
                </div>
                <div ref={scrollRef} />
              </div>

              {/* RightEditPanel shows buttons, hidden when any panel is open */}
              {showEditPanels && <RightEditPanel />}

              {/* Recording UI (not captured) */}
              {isPresenting && wantsToRecord && (
                <>
                  <WebcamOverlay />
                  <RecordingControls />
                  <RecordingPreviewDialog />
                </>
              )}
            </div>
          </div>

          {/* Unified Right Panel Renderer with animations */}
          {showEditPanels && <RightPanelRenderer />}
        </PlateController>
      </TouchAwareDndProvider>

      {isPresentingLoading && <PresentingLoadingOverlay />}
    </ThemeBackground>
  );
}
