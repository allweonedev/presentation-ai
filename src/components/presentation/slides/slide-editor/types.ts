import { type LayoutType } from "@/components/notebook/presentation/utils/parser";

export type ContentAlignment = "start" | "center" | "end";

export interface SlideEditorProps {
  slideId: string;
  dragListeners?: React.HTMLAttributes<HTMLElement>;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export const layoutMap: Record<number, LayoutType> = {
  0: "none",
  1: "vertical",
  2: "left",
  3: "right",
  4: "background",
};

export interface SlideUpdatePayload {
  layoutType?: LayoutType;
  bgColor?: string;
  width?: "S" | "M" | "L";
  alignment?: ContentAlignment;
  rootImage?: {
    query: string;
    url?: string;
  };
}
