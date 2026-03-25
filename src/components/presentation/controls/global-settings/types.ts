import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";

export type ContentAlignment = "start" | "center" | "end";

export type SlideUpdate = Omit<PlateSlide, "id">;
