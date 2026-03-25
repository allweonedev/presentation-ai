import { cva } from "class-variance-authority";

export const columnSizeVariant = cva("flex flex-wrap *:shrink *:grow", {
  variants: {
    columnSize: {
      sm: "*:flex-1",
      md: "*:basis-[calc(33.33%-2rem)]",
      lg: "*:basis-[calc(50%-2rem)]",
      xl: "*:basis-full",
    },
  },
});

export function getAlignmentClasses(
  alignment: "left" | "center" | "right" = "center",
) {
  switch (alignment) {
    case "left":
      return "text-left";
    case "right":
      return "text-right";
    case "center":
      return "text-center";
    default:
      return "text-left";
  }
}
