"use client";

import { ThemeModalContent } from "@/components/notebook/presentation/components/theme/ThemeModalContent";
import { ThemeModalPreview } from "@/components/notebook/presentation/components/theme/ThemeModalPreview";
import { useThemeModalState } from "@/components/notebook/presentation/components/theme/useThemeModalState";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useState, type ReactNode } from "react";

interface ThemeModalProps {
  children?: ReactNode;
}

/**
 * Theme selection modal with preview panel
 */
export function ThemeModal({ children }: ThemeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    activeTab,
    setActiveTab,
    selectedThemeId,
    selectedThemeData,
    userThemes,
    publicThemes,
    isLoadingUserThemes,
    isLoadingPublicThemes,
    handlePreviewTheme,
    handleApplyTheme,
  } = useThemeModalState(isOpen);

  const onApplyTheme = () => {
    handleApplyTheme();
    setIsOpen(false);
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        {children ? children : <Button variant="link">More Themes</Button>}
      </CredenzaTrigger>
      <CredenzaContent
        shouldHaveClose={false}
        className="h-[85dvh] w-full max-w-6xl overflow-hidden p-0"
      >
        <VisuallyHidden>
          <h2>More Themes</h2>
        </VisuallyHidden>
        <div className="flex h-full flex-col lg:flex-row">
          {/* Left Panel - Theme Selection */}
          <ThemeModalContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedThemeId={selectedThemeId}
            onPreviewTheme={handlePreviewTheme}
            userThemes={userThemes}
            publicThemes={publicThemes}
            isLoadingUserThemes={isLoadingUserThemes}
            isLoadingPublicThemes={isLoadingPublicThemes}
            onApplyTheme={onApplyTheme}
            onClose={() => setIsOpen(false)}
          />

          {/* Right Panel - Preview */}
          <ThemeModalPreview selectedThemeData={selectedThemeData} />
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
