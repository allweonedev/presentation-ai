"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { type TQuoteElement } from "../plugins/quote-plugin";

const quoteVariants = cva("relative my-6", {
  variants: {
    variant: {
      large: "flex flex-col items-center py-8 text-center",
      "sidequote-icon":
        "rounded-r-lg border-l-4 border-(--presentation-primary) bg-(--presentation-primary)/5 py-4 pl-6",
      sidequote: "border-l-4 border-(--presentation-primary) py-2 pl-4",
    },
  },
  defaultVariants: {
    variant: "large",
  },
});

const QuoteMark = ({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn(
      "size-12 text-(--presentation-primary)/30",
      flip && "rotate-180",
      className,
    )}
  >
    <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-.485-1.938-.597.144c-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162-.293.408-.492.856-.702 1.299-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539l.025.168.026-.006A4.5 4.5 0 1 0 6.5 10zm11 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-.485-1.938-.597.144c-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162-.293.408-.492.856-.702 1.299-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539l.025.168.026-.006A4.5 4.5 0 1 0 17.5 10z" />
  </svg>
);

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("size-6 text-(--presentation-primary)", className)}
  >
    <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-.485-1.938-.597.144c-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162-.293.408-.492.856-.702 1.299-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539l.025.168.026-.006A4.5 4.5 0 1 0 6.5 10zm11 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-.485-1.938-.597.144c-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162-.293.408-.492.856-.702 1.299-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539l.025.168.026-.006A4.5 4.5 0 1 0 17.5 10z" />
  </svg>
);

export function QuoteElement({
  element,
  children,
  className,
  ref,
  ...props
}: PlateElementProps<TQuoteElement>) {
  const { variant = "large", author } = element;

  if (variant === "large") {
    return (
      <PlateElement
        ref={ref}
        element={element}
        className={cn(quoteVariants({ variant }), className)}
        {...props}
      >
        <div className="flex max-w-3xl items-start gap-4">
          <QuoteMark className="-mt-2 shrink-0" />

          <div className="flex flex-1 flex-col items-center">
            <blockquote className="font-serif text-xl text-(--presentation-foreground) italic md:text-2xl">
              {children}
            </blockquote>

            {author && (
              <p className="mt-4 text-sm font-medium text-(--presentation-muted-foreground)">
                - {author}
              </p>
            )}
          </div>

          <QuoteMark className="-mt-2 shrink-0" flip />
        </div>
      </PlateElement>
    );
  }

  if (variant === "sidequote-icon") {
    return (
      <PlateElement
        ref={ref}
        element={element}
        className={cn(quoteVariants({ variant }), className)}
        {...props}
      >
        <QuoteIcon className="mb-2" />

        <blockquote className="text-base text-(--presentation-foreground) italic md:text-lg">
          {children}
        </blockquote>

        {author && (
          <p className="mt-3 text-sm font-semibold text-(--presentation-foreground)">
            {author}
          </p>
        )}
      </PlateElement>
    );
  }

  return (
    <PlateElement
      ref={ref}
      element={element}
      className={cn(quoteVariants({ variant: "sidequote" }), className)}
      {...props}
    >
      <blockquote className="text-base text-(--presentation-foreground)">
        {children}
      </blockquote>

      {author && (
        <p className="mt-2 text-sm text-(--presentation-muted-foreground)">
          - {author}
        </p>
      )}
    </PlateElement>
  );
}
