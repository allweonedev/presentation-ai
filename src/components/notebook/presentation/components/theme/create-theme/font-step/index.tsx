"use client";

import { useState } from "react";
import { useWatch } from "react-hook-form";
import { CurrentFontDisplay } from "./CurrentFontDisplay";
import { CustomFontCreator } from "./CustomFontCreator";
import { FontCombinationsList } from "./FontCombinationsList";
import { FontStepHeader } from "./FontStepHeader";
import { type FontStepProps } from "./types";
import { useFontUpload } from "./useFontUpload";
import { UserFontPairs } from "./UserFontPairs";
import { useSaveFontPair } from "./useSaveFontPair";

export function FontStep({ control, setValue }: FontStepProps) {
  const [showCustom, setShowCustom] = useState(false);

  // Use useWatch to properly subscribe to form changes
  const currentHeadingFont = useWatch({ control, name: "fonts.heading" });
  const currentBodyFont = useWatch({ control, name: "fonts.body" });
  const currentHeadingUrl = useWatch({ control, name: "fonts.headingUrl" });
  const currentBodyUrl = useWatch({ control, name: "fonts.bodyUrl" });

  const {
    isUploadingHeading,
    isUploadingBody,
    handleFontUpload,
    getLocalCustomFonts,
  } = useFontUpload({ setValue, control });

  const { isSaving, saveFontPair } = useSaveFontPair(() => {
    setShowCustom(false);
  });

  const handleSaveFontPair = () => {
    saveFontPair({
      heading: currentHeadingFont,
      body: currentBodyFont,
      headingUrl: currentHeadingUrl,
      bodyUrl: currentBodyUrl,
    });
  };

  const handleSelectFontPair = (heading: string, body: string) => {
    const options = { shouldDirty: true };
    setValue("fonts.heading", heading, options);
    setValue("fonts.body", body, options);
  };

  const handleSelectUserFontPair = (
    heading: string,
    body: string,
    headingUrl?: string,
    bodyUrl?: string,
  ) => {
    const options = { shouldDirty: true };
    setValue("fonts.heading", heading, options);
    setValue("fonts.body", body, options);
    if (headingUrl) setValue("fonts.headingUrl", headingUrl, options);
    if (bodyUrl) setValue("fonts.bodyUrl", bodyUrl, options);
  };

  return (
    <div className="flex h-full flex-col">
      <FontStepHeader />

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        <CurrentFontDisplay
          headingFont={currentHeadingFont}
          bodyFont={currentBodyFont}
          showCustom={showCustom}
          onToggleCustom={() => setShowCustom(!showCustom)}
        />

        {showCustom && (
          <CustomFontCreator
            control={control}
            setValue={setValue}
            isUploadingHeading={isUploadingHeading}
            isUploadingBody={isUploadingBody}
            isSaving={isSaving}
            onUploadHeading={() => handleFontUpload("heading")}
            onUploadBody={() => handleFontUpload("body")}
            onSave={handleSaveFontPair}
            onCancel={() => setShowCustom(false)}
            getLocalCustomFonts={getLocalCustomFonts}
            currentHeadingFont={currentHeadingFont}
            currentBodyFont={currentBodyFont}
          />
        )}

        <UserFontPairs
          currentHeading={currentHeadingFont}
          currentBody={currentBodyFont}
          onSelect={handleSelectUserFontPair}
        />

        <FontCombinationsList
          currentHeading={currentHeadingFont}
          currentBody={currentBodyFont}
          onSelect={handleSelectFontPair}
        />
      </div>
    </div>
  );
}
