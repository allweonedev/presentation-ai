"use client";
import { Brain } from "@/components/ui/icons";
import { usePresentationState } from "@/states/presentation-state";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Import our new components
import { updatePresentationTitle } from "@/app/_actions/notebook/presentation/presentationActions";
import AllweoneText from "@/components/globals/allweone-logo";
import { PresentButton } from "@/components/presentation/buttons/PresentButton";
import { ShareButton } from "@/components/presentation/buttons/ShareButton";
import { PresentationMenu } from "@/components/presentation/controls/PresentationMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Palette } from "lucide-react";
import * as motion from "motion/react-client";

interface PresentationHeaderProps {
  title?: string;
}

export default function PresentationHeader({ title }: PresentationHeaderProps) {
  const currentPresentationTitle = usePresentationState(
    (s) => s.currentPresentationTitle,
  );
  const isPresenting = usePresentationState((s) => s.isPresenting);
  const currentPresentationId = usePresentationState(
    (s) => s.currentPresentationId,
  );
  const activeRightPanel = usePresentationState((s) => s.activeRightPanel);
  const isReadOnly = usePresentationState((s) => s.isReadOnly);
  const setActiveRightPanel = usePresentationState(
    (s) => s.setActiveRightPanel,
  );

  const [presentationTitle, setPresentationTitle] =
    useState<string>("Presentation");
  const pathname = usePathname();

  const isPresentationPage =
    (pathname.startsWith("/presentation/") ||
      pathname.startsWith("/share/presentation/")) &&
    !pathname.includes("generate");

  // Update title when it changes in the state
  useEffect(() => {
    if (currentPresentationTitle) {
      setPresentationTitle(currentPresentationTitle);
    } else if (title) {
      setPresentationTitle(title);
    }
  }, [currentPresentationTitle, title]);

  if (pathname === "/presentation/create")
    return (
      <header
        className="notranslate flex min-h-12 w-full max-w-screen items-center justify-between gap-2 overflow-clip border-accent px-2 py-2"
        translate="no"
      >
        <div className="flex min-w-0 items-center gap-2">
          {/* This component is suppose to be logo but for now its is actually hamburger menu */}

          <Link href="/presentations">
            <Button size={"icon"} className="rounded-full" variant={"ghost"}>
              <Brain></Brain>
            </Button>
          </Link>

          <motion.div
            initial={false}
            layout="position"
            transition={{ duration: 1 }}
          >
            <Link href="/" className="h-max">
              <AllweoneText className="h-10 w-30 cursor-pointer transition-transform duration-100 active:scale-95"></AllweoneText>
            </Link>
          </motion.div>
        </div>

        {/* <SideBarDropdown /> */}
      </header>
    );

  return (
    <header
      className="notranslate flex min-h-12 w-full items-center justify-between gap-3 overflow-hidden border-b border-accent bg-background px-3 py-2 sm:px-4"
      translate="no"
    >
      {/* Left section with breadcrumb navigation */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Link
          href="/presentations"
          className="text-muted-foreground hover:text-foreground"
        >
          <Brain className="h-5 w-5"></Brain>
        </Link>
        {isPresentationPage && <PresentationMenu readOnly={isReadOnly} />}
        <Input
          type="text"
          id="presentation-title-input"
          value={presentationTitle}
          onChange={(e) => setPresentationTitle(e.target.value)}
          disabled={isReadOnly}
          onBlur={async () => {
            if (isReadOnly) {
              return;
            }
            if (
              presentationTitle &&
              currentPresentationTitle !== presentationTitle &&
              currentPresentationId
            ) {
              try {
                await updatePresentationTitle(
                  currentPresentationId,
                  presentationTitle,
                );
              } catch {
                setPresentationTitle(currentPresentationTitle || "");
              }
            }
          }}
          className="line-clamp-1 h-auto min-w-0 flex-1 cursor-text rounded-xs border-none bg-transparent p-0 font-medium text-ellipsis shadow-none outline-hidden sm:max-w-96"
          style={{
            appearance: "none",
          }}
        />
      </div>

      {/* Right section with actions */}
      <div className="scrollbar-hide flex max-w-[56vw] shrink-0 items-center gap-2 overflow-x-auto md:max-w-none md:overflow-visible">
        {/* Theme button - Only in presentation page, not outline or present mode */}
        {isPresentationPage && !isPresenting && !isReadOnly && (
          <Button
            variant="ghost"
            className="h-9 gap-1.5"
            title="Theme"
            onClick={() => setActiveRightPanel("theme")}
          >
            <Palette className="size-4" />
            <span className="hidden sm:inline">Theme</span>
          </Button>
        )}

        {/* Export button - Only in presentation page, not outline or present mode */}
        {/* Share button - Only in presentation page, not outline */}
        {isPresentationPage && !isPresenting && !isReadOnly && <ShareButton />}

        {/* Agent button - Only in presentation page, not outline or present mode */}
        {isPresentationPage && !isPresenting && !isReadOnly && (
          <Button
            variant={activeRightPanel === "agent" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveRightPanel(activeRightPanel === "agent" ? null : "agent");
            }}
            className="gap-2"
          >
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Agent</span>
          </Button>
        )}

        {/* Present button - Only in presentation page, not outline */}
        {isPresentationPage && <PresentButton />}

        {/* User profile dropdown - Keep this on all pages */}
        {/* {!isPresenting && <SideBarDropdown />} */}
      </div>
    </header>
  );
}
