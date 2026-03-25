"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  type RightPanelType,
  usePresentationState,
} from "@/states/presentation-state";
import { AnimatePresence, motion } from "motion/react";
import {
  BarChart3,
  ImageIcon,
  LayoutGrid,
  Link as LinkIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PresentationAgentPanel } from "../agent/PresentationAgentPanel";
import { GlobalSettings } from "../controls/global-settings/GlobalSettings";
import { BackgroundPanel } from "./sections/BackgroundPanel";
import { ChartEditorPanel } from "./sections/ChartEditorPanel";
import { ChartPanel } from "./sections/ChartPanel";
import { ElementsPanel } from "./sections/ElementsPanel";
import { ImageEditorPanel } from "./sections/ImageEditorPanel";
import { InfographicEditorPanel } from "./sections/InfographicEditorPanel";
import { MediaEmbedPanel } from "./sections/MediaEmbedPanel";
import { PresentationImageEditorPanel } from "./sections/PresentationImageEditorPanel";
import { ThemePanel } from "./sections/ThemePanel";

const RIGHT_PANEL_WIDTH_PX = 416;

// Panel titles and icons for panels that need our generic header
const PANEL_INFO = {
  elements: {
    title: "Add elements",
    icon: <LayoutGrid className="h-4 w-4 text-primary" />,
  },
  charts: {
    title: "Add Charts",
    icon: <BarChart3 className="h-4 w-4 text-primary" />,
  },
  embed: {
    title: "Media Embeds",
    icon: <LinkIcon className="h-4 w-4 text-primary" />,
  },
  background: {
    title: "Background",
    icon: <ImageIcon className="h-4 w-4 text-primary" />,
  },
} as const;

// Panels that have their own complete structure (header, styling, etc.)
const SELF_CONTAINED_PANELS: RightPanelType[] = [
  "agent",
  "globalSettings",
  "theme",
  "imageEditor",
  "chartEditor",
  "infographicEditor",
  "presentationImageEditor",
];

function PanelHeader({
  panel,
  onClose,
}: {
  panel: RightPanelType;
  onClose: () => void;
}) {
  const info = PANEL_INFO[panel as keyof typeof PANEL_INFO];
  if (!info) return null;

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-2">
        {info.icon}
        <h2 className="text-sm font-semibold tracking-wide">{info.title}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-8 w-8 rounded-full p-0 hover:bg-muted"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}

function PanelContent({ panel }: { panel: RightPanelType }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => setIsLoaded(true), 350);
    return () => clearTimeout(timer);
  }, [panel]);

  switch (panel) {
    case "elements":
      return <ElementsPanel isLoaded={isLoaded} />;
    case "charts":
      return <ChartPanel isLoaded={isLoaded} />;
    case "embed":
      return <MediaEmbedPanel />;
    case "background":
      return (
        <ScrollArea className="max-h-full flex-1 px-4 py-4">
          <BackgroundPanel />
        </ScrollArea>
      );
    case "theme":
      return <ThemePanel />;
    case "agent":
      return <PresentationAgentPanel />;
    case "globalSettings":
      return <GlobalSettings />;
    case "imageEditor":
      return <ImageEditorPanel />;
    case "chartEditor":
      return <ChartEditorPanel />;
    case "infographicEditor":
      return <InfographicEditorPanel />;
    case "presentationImageEditor":
      return <PresentationImageEditorPanel />;
    default:
      return null;
  }
}

export function RightPanelRenderer() {
  const activeRightPanel = usePresentationState((s) => s.activeRightPanel);
  const setActiveRightPanel = usePresentationState(
    (s) => s.setActiveRightPanel,
  );

  const handleClose = () => setActiveRightPanel(null);

  const isSelfContained =
    activeRightPanel && SELF_CONTAINED_PANELS.includes(activeRightPanel);

  return (
    <AnimatePresence>
      {activeRightPanel && (
        <motion.div
          key="right-panel"
          initial={{ width: 0, opacity: 0.5 }}
          animate={{ width: RIGHT_PANEL_WIDTH_PX, opacity: 1 }}
          exit={{ width: 0, opacity: 0.5 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full shrink-0 overflow-hidden"
        >
          <div className="flex h-full w-104 flex-col gap-3 border-l bg-background">
            {!isSelfContained && (
              <PanelHeader panel={activeRightPanel} onClose={handleClose} />
            )}
            <div className="flex-1 overflow-hidden">
              <PanelContent panel={activeRightPanel} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
