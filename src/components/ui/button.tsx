import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { Arrow } from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap ring-offset-background transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        success: "bg-green-500 text-primary-foreground hover:bg-green-400/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "m-0 p-0 text-primary underline underline-offset-4",
        loading:
          "disabled flex items-center justify-center bg-primary text-primary-foreground",
        noBackground: "m-0 bg-transparent p-0 text-sm text-inherit",
        outlineLoading:
          "disabled flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        noBackgroundLoading:
          "disabled m-0 flex items-center justify-center bg-transparent p-0 text-sm text-inherit",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-8 w-8 md:h-10 md:w-10",
        xs: "h-5 rounded-md p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const ChildComponent = () => {
      if (variant !== "loading") {
        return children;
      }
      if (
        variant === "loading" ||
        variant === "outlineLoading" ||
        variant === "noBackgroundLoading"
      ) {
        return <Spinner className="h-4 w-4"></Spinner>;
      }
      return children;
    };
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {ChildComponent()}
      </Comp>
    );
  },
);
Button.displayName = "Button";
// TooltipButton should have exactly the same type as Button, with a couple tooltip props
export interface TooltipButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  tooltipText?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
  tooltipOffset?: number;
  tooltipAlignOffset?: number;
  delayDuration?: number;
  arrow?: boolean;
  asChild?: boolean;
}

const TooltipButton = React.forwardRef<HTMLButtonElement, TooltipButtonProps>(
  (
    {
      tooltipText,
      tooltipSide = "top",
      tooltipAlign = "center",
      tooltipOffset = 4,
      tooltipAlignOffset = 0,
      delayDuration = 0,
      arrow = true,
      children,
      ...props
    },
    ref,
  ) => {
    // No tooltip: just Button
    if (!tooltipText) {
      return (
        <Button ref={ref} {...props}>
          {children}
        </Button>
      );
    }
    // With tooltip
    return (
      <TooltipProvider>
        <Tooltip delayDuration={delayDuration}>
          <TooltipTrigger asChild suppressHydrationWarning>
            <Button ref={ref} {...props}>
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side={tooltipSide}
            align={tooltipAlign}
            sideOffset={tooltipOffset}
            alignOffset={tooltipAlignOffset}
          >
            {arrow && <Arrow className="fill-primary" />}
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

TooltipButton.displayName = "TooltipButton";

export { Button, buttonVariants, TooltipButton };
