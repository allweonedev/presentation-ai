"use client";
import React from "react";

import { PresentationRoot, slideSignature, StaticPlate } from ".";
import { type PlateSlide } from "../utils/parser";

interface PresentationEditorStaticViewProps {
  initialContent?: PlateSlide;
  className?: string;
  id: string;
}

// slideSignature is imported from utils to keep behavior identical

const StaticPresentationEditor = React.memo(
  ({ initialContent, className, id }: PresentationEditorStaticViewProps) => {
    return (
      <PresentationRoot
        fontsToLoad={[]}
        isPresenting={false}
        readOnly={true}
        isStatic={true}
        initialContent={initialContent}
      >
        <StaticPlate
          initialContent={initialContent}
          className={className}
          id={id}
        />
      </PresentationRoot>
    );
  },
  (prev, next) => {
    if (prev.id !== next.id) return false;
    if (
      slideSignature(prev.initialContent) !==
      slideSignature(next.initialContent)
    )
      return false;
    if (prev.className !== next.className) return false;
    return true;
  },
);

export default StaticPresentationEditor;
