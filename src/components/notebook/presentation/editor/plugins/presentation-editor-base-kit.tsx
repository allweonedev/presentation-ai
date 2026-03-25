import { BaseAlignKit } from "@/components/plate/plugins/align-base-kit";
import { BaseBasicMarksKit } from "@/components/plate/plugins/basic-marks-base-kit";
import { BaseCalloutKit } from "@/components/plate/plugins/callout-base-kit";
import { BaseCodeBlockKit } from "@/components/plate/plugins/code-block-base-kit";
import { BaseColumnKit } from "@/components/plate/plugins/column-base-kit";
import { BaseCommentKit } from "@/components/plate/plugins/comment-base-kit";
import { BaseDateKit } from "@/components/plate/plugins/date-base-kit";
import { BaseFontKit } from "@/components/plate/plugins/font-base-kit";
import { BaseLineHeightKit } from "@/components/plate/plugins/line-height-base-kit";
import { BaseLinkKit } from "@/components/plate/plugins/link-base-kit";
import { BaseListKit } from "@/components/plate/plugins/list-base-kit";
import { MarkdownKit } from "@/components/plate/plugins/markdown-kit";
import { BaseMathKit } from "@/components/plate/plugins/math-base-kit";
import { BaseMediaKit } from "@/components/plate/plugins/media-base-kit";
import { BaseMentionKit } from "@/components/plate/plugins/mention-base-kit";
import { BaseSuggestionKit } from "@/components/plate/plugins/suggestion-base-kit";
import { BaseTocKit } from "@/components/plate/plugins/toc-base-kit";
import { BaseToggleKit } from "@/components/plate/plugins/toggle-base-kit";
import { PresentationBasicBlocksBaseKit } from "./presentation-basic-blocks-base-kit";

// Presentation-focused BaseEditorKit using presentation static components for headings/paragraphs
export const PresentationEditorBaseKit = [
  ...PresentationBasicBlocksBaseKit,
  ...BaseCodeBlockKit,
  ...BaseToggleKit,
  ...BaseTocKit,
  ...BaseMediaKit,
  ...BaseCalloutKit,
  ...BaseColumnKit,
  ...BaseMathKit,
  ...BaseDateKit,
  ...BaseLinkKit,
  ...BaseMentionKit,
  ...BaseBasicMarksKit,
  ...BaseFontKit,
  ...BaseListKit,
  ...BaseAlignKit,
  ...BaseLineHeightKit,
  ...BaseCommentKit,
  ...BaseSuggestionKit,
  ...MarkdownKit,
];
