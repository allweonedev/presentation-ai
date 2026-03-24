import { type ImageModelList } from "@/app/_actions/apps/image-studio/generate";
import { useState } from "react";

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const FluxLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="5" fill="#0a0a0a" />
    <path d="M6 7h5l-3 5h3l-5 5 2-3.5H6L8.5 7" fill="url(#fg)" />
    <path
      d="M13 7h5l-3 5h3l-5 5 2-3.5H13L15.5 7"
      fill="url(#fg)"
      opacity="0.5"
    />
    <defs>
      <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
    </defs>
  </svg>
);

const MODELS = [
  {
    id: "fal-ai/nano-banana-pro",
    name: "Nano Banana Pro",
    provider: "Google",
    logo: <GoogleLogo />,
    premium: true,
  },
  {
    id: "fal-ai/flux-2/flash",
    name: "Flux 2.0",
    provider: "Black Forest Labs",
    logo: <FluxLogo />,
  },
];

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function GenerateImageSlidesButton({
  isGenerating,
  disabled = false,
  onGenerateImageSlides,
}: {
  isGenerating: boolean;
  disabled?: boolean;
  onGenerateImageSlides: (model: ImageModelList) => void;
}) {
  const [sel, setSel] = useState<(typeof MODELS)[0]>(
    MODELS[0] as (typeof MODELS)[0],
  );

  const handleGenerateClick = () => {
    if (!sel) return;
    onGenerateImageSlides(sel.id as ImageModelList);
  };

  return (
    <ButtonGroup className="w-full sm:w-fit">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            title="Change model"
            size="lg"
            className="flex shrink-0 items-center justify-center bg-background px-3 text-muted-foreground hover:bg-accent focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-10 sm:px-2.5"
          >
            {sel?.logo}
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1 opacity-50 transition-transform group-data-[state=open]:rotate-180"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[220px] rounded-xl p-1">
          <DropdownMenuLabel className="px-2 pt-1 pb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Model
          </DropdownMenuLabel>
          {MODELS.map((m) => (
            <DropdownMenuItem
              key={m.id}
              onClick={() => setSel(m)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 ${
                sel?.id === m.id ? "bg-primary/10" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-foreground">
                    {m.name}
                  </span>
                  {m.premium && (
                    <span className="rounded-full border border-amber-300 bg-linear-to-br from-amber-100 to-amber-200 px-1.5 py-px text-[9px] font-bold tracking-wide text-amber-700 uppercase">
                      Premium
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {m.provider}
                </div>
              </div>
              {sel?.id === m.id && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-[3px] text-primary"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="lg"
        onClick={handleGenerateClick}
        disabled={isGenerating || disabled}
        className={`flex flex-1 items-center justify-center gap-1.5 bg-background px-4 text-[15px] font-semibold hover:bg-accent focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-10 sm:flex-none sm:px-3 sm:text-sm ${
          isGenerating || disabled ? "opacity-70" : ""
        }`}
      >
        {isGenerating ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
            Generating...
          </>
        ) : (
          "Generate Image Slides"
        )}
      </Button>
    </ButtonGroup>
  );
}
