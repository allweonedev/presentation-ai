"use client";

import { ImageIcon } from "lucide-react";

export function TextAndHeadingPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      <div className="w-full space-y-1 rounded p-2">
        <div className="mb-2 h-5 w-3/4 rounded bg-muted-foreground/20" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
      </div>
    </div>
  );
}

export function TextAndImagePreview() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 p-3">
      <div className="flex-1 space-y-1">
        <div className="h-3 w-3/4 rounded bg-muted-foreground/20" />
        <div className="h-1.5 w-full rounded bg-muted" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
        <ImageIcon className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}

export function ImageAndTextPreview() {
  return (
    <div className="flex h-full w-full flex-row-reverse items-center justify-center gap-2 p-3">
      <div className="flex-1 space-y-1">
        <div className="h-3 w-3/4 rounded bg-muted-foreground/20" />
        <div className="h-1.5 w-full rounded bg-muted" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
        <ImageIcon className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}

export function TwoColumnsPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <div className="grid w-full grid-cols-2 gap-2">
        <div className="space-y-1">
          <div className="h-2 w-full rounded bg-muted-foreground/20" />
          <div className="h-1 w-full rounded bg-muted" />
          <div className="h-1 w-5/6 rounded bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="h-2 w-full rounded bg-muted-foreground/20" />
          <div className="h-1 w-full rounded bg-muted" />
          <div className="h-1 w-5/6 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
export function TwoColumnsWithHeadingPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3">
      <div className="h-5 w-full rounded bg-muted-foreground/20"></div>
      <div className="grid w-full grid-cols-2 gap-2">
        <div className="space-y-1">
          <div className="h-2 w-full rounded bg-muted-foreground/20" />
          <div className="h-1 w-full rounded bg-muted" />
          <div className="h-1 w-5/6 rounded bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="h-2 w-full rounded bg-muted-foreground/20" />
          <div className="h-1 w-full rounded bg-muted" />
          <div className="h-1 w-5/6 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function SolidBoxesPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="grid w-full grid-cols-2 gap-2 p-3">
        <div className="aspect-square rounded bg-muted-foreground/20" />
        <div className="aspect-square rounded bg-muted-foreground/20" />
        <div className="aspect-square rounded bg-muted-foreground/20" />
        <div className="aspect-square rounded bg-muted-foreground/20" />
      </div>
    </div>
  );
}

export function OutlineBoxesPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="grid w-full grid-cols-2 gap-2 p-3">
        <div className="aspect-square rounded border-2 border-muted-foreground/40" />
        <div className="aspect-square rounded border-2 border-muted-foreground/40" />
        <div className="aspect-square rounded border-2 border-muted-foreground/40" />
        <div className="aspect-square rounded border-2 border-muted-foreground/40" />
      </div>
    </div>
  );
}

export function SideLineBoxesPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <div className="flex w-full">
        <div className="h-6 flex-1 rounded border border-l-4 border-muted-foreground/20" />
      </div>
      <div className="flex w-full">
        <div className="h-6 flex-1 rounded border border-l-4 border-muted-foreground/20" />
      </div>
      <div className="flex w-full">
        <div className="h-6 flex-1 rounded border border-l-4 border-muted-foreground/20" />
      </div>
    </div>
  );
}

export function JoinedBoxesPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="w-full overflow-hidden rounded-lg border-2 border-muted-foreground/20">
        <div className="h-8 border-b border-muted-foreground/20" />
        <div className="h-8 border-b border-muted-foreground/20" />
        <div className="h-8" />
      </div>
    </div>
  );
}

export function BoxesWithIconsPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="grid w-full gap-2 overflow-hidden">
        <div className="flex h-6 items-center gap-2 border border-border px-2">
          <div className="h-3 w-3 rounded-sm bg-muted-foreground/40" />
          <div className="h-1.5 flex-1 rounded bg-muted" />
        </div>
        <div className="flex h-6 items-center gap-2 border border-border px-2">
          <div className="h-3 w-3 rounded-sm bg-muted-foreground/40" />
          <div className="h-1.5 flex-1 rounded bg-muted" />
        </div>
        <div className="flex h-6 items-center gap-2 border border-border px-2">
          <div className="h-3 w-3 rounded-sm bg-muted-foreground/40" />
          <div className="h-1.5 flex-1 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function LeafBoxesPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="grid w-full grid-cols-2 gap-2 p-3">
        <div className="aspect-square rounded-tl-xl rounded-br-xl bg-muted-foreground/20" />
        <div className="aspect-square rounded-tl-xl rounded-br-xl bg-muted-foreground/20" />
        <div className="aspect-square rounded-tl-xl rounded-br-xl bg-muted-foreground/20" />
        <div className="aspect-square rounded-tl-xl rounded-br-xl bg-muted-foreground/20" />
      </div>
    </div>
  );
}

export function LargeBulletsPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-3">
      <div className="flex w-full items-center gap-2">
        <div className="mt-0.5 size-3.5 shrink-0 rounded bg-muted-foreground/40" />
        <div className="w-full space-y-0.5">
          <div className="h-1.5 rounded bg-muted-foreground/20" />
          <div className="h-1 w-5/6 rounded bg-muted-foreground/20" />
        </div>
      </div>
      <div className="flex w-full items-center gap-2">
        <div className="mt-0.5 size-3.5 shrink-0 rounded bg-muted-foreground/40" />
        <div className="w-full space-y-0.5">
          <div className="h-1.5 rounded bg-muted-foreground/20" />
          <div className="h-1 w-5/6 rounded bg-muted-foreground/20" />
        </div>
      </div>
      <div className="flex w-full items-center gap-2">
        <div className="mt-0.5 size-3.5 shrink-0 rounded bg-muted-foreground/40" />
        <div className="w-full space-y-0.5">
          <div className="h-1.5 rounded bg-muted-foreground/20" />
          <div className="h-1 w-5/6 rounded bg-muted-foreground/20" />
        </div>
      </div>
      <div className="flex w-full items-center gap-2">
        <div className="mt-0.5 size-3.5 shrink-0 rounded bg-muted-foreground/40" />
        <div className="w-full space-y-0.5">
          <div className="h-1.5 rounded bg-muted-foreground/20" />
          <div className="h-1 w-5/6 rounded bg-muted-foreground/20" />
        </div>
      </div>
    </div>
  );
}

export function SmallBulletsPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-1 p-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex w-full items-center gap-1.5">
          <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
          <div className="w-full space-y-0.5">
            <div className="h-1 flex-1 rounded bg-muted-foreground/20" />
            <div className="h-0.5 w-5/6 flex-1 rounded bg-muted-foreground/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AccentLeftPreview() {
  return (
    <div className="flex h-full w-full gap-2">
      <div className="flex h-full w-1/2 items-center justify-center rounded bg-muted">
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex flex-1 flex-col justify-center space-y-1">
        <div className="h-2.5 w-3/4 rounded bg-muted-foreground/20" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
      </div>
    </div>
  );
}

export function AccentRightPreview() {
  return (
    <div className="flex h-full w-full gap-2">
      <div className="flex flex-1 flex-col justify-center space-y-1 pl-2">
        <div className="h-2.5 w-3/4 rounded bg-muted-foreground/20" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
      </div>
      <div className="flex h-full w-1/2 items-center justify-center rounded bg-muted">
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}

export function AccentTopPreview() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-1/2 w-full items-center justify-center rounded bg-muted">
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex flex-1 flex-col justify-center space-y-1 pl-2">
        <div className="h-2.5 w-3/4 rounded bg-muted-foreground/20" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
      </div>
    </div>
  );
}

export function AccentRightFitPreview() {
  return (
    <div className="flex h-full w-full gap-2">
      <div className="flex flex-1 flex-col justify-center space-y-1 pl-2">
        <div className="h-2.5 w-3/4 rounded bg-muted-foreground/20" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
      </div>
      <div className="flex h-full w-1/2 items-center justify-center rounded bg-muted">
        <div className="grid aspect-square w-1/2 place-items-center rounded border border-primary/50">
          <ImageIcon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export function AccentLeftFitPreview() {
  return (
    <div className="flex h-full w-full gap-2">
      <div className="flex h-full w-1/2 items-center justify-center rounded bg-muted">
        <div className="grid aspect-square w-1/2 place-items-center rounded border border-primary/50">
          <ImageIcon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center space-y-1">
        <div className="h-2.5 w-3/4 rounded bg-muted-foreground/20" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
      </div>
    </div>
  );
}

export function AccentBackgroundPreview() {
  return (
    <div className="relative flex h-full w-full gap-2">
      <div className="absolute inset-0 flex items-center justify-center rounded bg-muted">
        <ImageIcon className="h-4 w-4" />
      </div>
      <div className="z-10 flex flex-1 flex-col justify-center space-y-1 pl-2">
        <div className="h-2.5 w-3/4 rounded bg-primary/60" />
        <div className="h-1.5 w-5/6 rounded bg-primary/60" />
        <div className="h-1.5 w-5/6 rounded bg-primary/60" />
      </div>
    </div>
  );
}

export function BarChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-3">
      <div className="flex h-full w-full items-end justify-center gap-1">
        <div className="h-3/4 w-4 rounded bg-accent" />
        <div className="h-full w-4 rounded bg-accent" />
        <div className="h-full w-4 rounded bg-accent" />
        <div className="h-5/6 w-4 rounded bg-accent" />
        <div className="h-full w-4 rounded bg-accent" />
        <div className="h-3/4 w-4 rounded bg-accent" />
        <div className="h-5/6 w-4 rounded bg-accent" />
      </div>
    </div>
  );
}

export function LineChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-3">
      <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
      <div className="relative flex h-12 items-center justify-center">
        <svg viewBox="0 0 60 30" className="h-full w-full">
          <polyline
            points="5,25 20,15 35,20 50,8"
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/40"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}

export function OriginalCircleStatsPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-2 p-3">
      <div className="flex justify-center gap-2">
        <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/20" />
        <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/20" />
        <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/20" />
      </div>
      <div className="grid w-full grid-cols-3 gap-1">
        <div className="space-y-1">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function TimelinePreview() {
  return (
    <div className="h-full w-full space-y-1 p-3">
      <div className="h-2 w-full rounded bg-muted-foreground/20" />
      <div className="h-2 w-full rounded bg-muted" />
      <div className="h-2 w-full rounded bg-muted" />
      <div className="h-2 w-full rounded bg-muted" />
      <div className="h-2 w-full rounded bg-muted" />
      <div className="h-2 w-full rounded bg-muted" />
      <div className="h-2 w-full rounded bg-muted" />
    </div>
  );
}

export function FourColumnsPreview() {
  return (
    <div className="h-full w-full space-y-2 p-3">
      <div className="h-2 w-full rounded bg-muted-foreground/20" />
      <div className="grid grid-cols-4 gap-1">
        <div className="h-1 rounded bg-muted" />
        <div className="h-1 rounded bg-muted" />
        <div className="h-1 rounded bg-muted" />
        <div className="h-1 rounded bg-muted" />
      </div>
      <div className="grid grid-cols-4 gap-1">
        <div className="h-1 rounded bg-muted" />
        <div className="h-1 rounded bg-muted" />
        <div className="h-1 rounded bg-muted" />
        <div className="h-1 rounded bg-muted" />
      </div>
    </div>
  );
}

export function ThreeImageColumnsPreview() {
  return (
    <div className="h-full w-full space-y-2 p-3">
      <div className="grid grid-cols-3 gap-1">
        <div className="flex aspect-square items-center justify-center rounded bg-muted">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex aspect-square items-center justify-center rounded bg-muted">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex aspect-square items-center justify-center rounded bg-muted">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        <div className="space-y-0.5">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
        <div className="space-y-0.5">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
        <div className="space-y-0.5">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function BlankCardPreview() {
  return <div className="h-full w-full" />;
}

export function TwoColumnWithHeaderPreview() {
  return (
    <div className="h-full w-full space-y-1 p-3">
      <div className="h-2 w-full rounded bg-muted-foreground/20" />
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-muted" />
          <div className="h-1 w-5/6 rounded bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-muted" />
          <div className="h-1 w-5/6 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function ThreeColumnsPreview() {
  return (
    <div className="h-full w-full p-3">
      <div className="grid grid-cols-3 gap-1">
        <div className="space-y-1">
          <div className="h-2 rounded bg-muted-foreground/20" />
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="h-2 rounded bg-muted-foreground/20" />
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="h-2 rounded bg-muted-foreground/20" />
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function ThreeColumnWithHeaderPreview() {
  return (
    <div className="h-full w-full space-y-1 p-3">
      <div className="h-2 w-full rounded bg-muted-foreground/20" />
      <div className="grid grid-cols-3 gap-1">
        <div className="space-y-0.5">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
        <div className="space-y-0.5">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
        <div className="space-y-0.5">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function TitleWithBulletsPreview() {
  return (
    <div className="h-full w-full space-y-1 p-3">
      <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
      <div className="mt-2 space-y-0.5">
        <div className="flex items-center gap-1">
          <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <div className="h-1 flex-1 rounded bg-muted" />
        </div>
        <div className="flex items-center gap-1">
          <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <div className="h-1 flex-1 rounded bg-muted" />
        </div>
        <div className="flex items-center gap-1">
          <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <div className="h-1 flex-1 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function TitleWithBulletsAndImagePreview() {
  return (
    <div className="h-full w-full space-y-1 p-3">
      <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
      <div className="mt-2 flex gap-2">
        <div className="flex-1 space-y-0.5">
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <div className="h-1 flex-1 rounded bg-muted" />
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <div className="h-1 flex-1 rounded bg-muted" />
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

export function ArrowBulletsPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-3">
      <div className="flex w-full items-center gap-2">
        <svg
          className="size-3.5 shrink-0"
          viewBox="0 0 155.139 155.139"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            className="fill-muted-foreground/40"
            points="155.139,77.566 79.18,1.596 79.18,45.978 0,45.978 0,109.155 79.18,109.155 79.18,153.542"
          />
        </svg>
        <div className="w-full space-y-0.5">
          <div className="h-1.5 rounded bg-muted-foreground/20" />
          <div className="h-1 w-5/6 rounded bg-muted-foreground/20" />
        </div>
      </div>
      <div className="flex w-full items-center gap-2">
        <svg
          className="size-3.5 shrink-0"
          viewBox="0 0 155.139 155.139"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            className="fill-muted-foreground/40"
            points="155.139,77.566 79.18,1.596 79.18,45.978 0,45.978 0,109.155 79.18,109.155 79.18,153.542"
          />
        </svg>
        <div className="w-full space-y-0.5">
          <div className="h-1.5 rounded bg-muted-foreground/20" />
          <div className="h-1 w-5/6 rounded bg-muted-foreground/20" />
        </div>
      </div>
      <div className="flex w-full items-center gap-2">
        <svg
          className="size-3.5 shrink-0"
          viewBox="0 0 155.139 155.139"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            className="fill-muted-foreground/40"
            points="155.139,77.566 79.18,1.596 79.18,45.978 0,45.978 0,109.155 79.18,109.155 79.18,153.542"
          />
        </svg>
        <div className="w-full space-y-0.5">
          <div className="h-1.5 rounded bg-muted-foreground/20" />
          <div className="h-1 w-5/6 rounded bg-muted-foreground/20" />
        </div>
      </div>
      <div className="flex w-full items-center gap-2">
        <svg
          className="size-3.5 shrink-0"
          viewBox="0 0 155.139 155.139"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            className="fill-muted-foreground/40"
            points="155.139,77.566 79.18,1.596 79.18,45.978 0,45.978 0,109.155 79.18,109.155 79.18,153.542"
          />
        </svg>
        <div className="w-full space-y-0.5">
          <div className="h-1.5 rounded bg-muted-foreground/20" />
          <div className="h-1 w-5/6 rounded bg-muted-foreground/20" />
        </div>
      </div>
    </div>
  );
}

export function ProcessStepsPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1.5 p-3">
      <div className="w-full space-y-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-1.5">
            <div className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20">
              <div className="h-1 w-1 rounded-full bg-muted-foreground" />
            </div>
            <div className="mt-1 h-1 flex-1 rounded bg-muted-foreground/20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SolidBoxSmallBulletsPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      <div className="w-full space-y-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-1.5">
            <div className="mt-0.5 h-1.5 w-1.5 shrink-0 bg-muted-foreground/40" />
            <div className="h-1 flex-1 rounded bg-muted-foreground/20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TwoImageColumnsPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      <div className="w-full space-y-1">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex aspect-square items-center justify-center rounded bg-muted">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex aspect-square items-center justify-center rounded bg-muted">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function ThreeImageColumnsCardPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      <div className="w-full space-y-1">
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded bg-muted"
            >
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-1 rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FourImageColumnsPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      <div className="w-full space-y-1">
        <div className="grid grid-cols-4 gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-sm bg-muted"
            >
              <ImageIcon className="h-3 w-3 text-muted-foreground" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-0.5 rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ImagesWithTextPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <div className="grid w-full grid-cols-3 gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1">
            <div className="flex aspect-square items-center justify-center rounded bg-muted">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-1 rounded bg-muted" />
            <div className="h-1 w-3/4 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ImageGalleryPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      <div className="w-full space-y-1">
        <div className="space-y-1">
          <div className="h-2 w-full rounded bg-muted-foreground/20" />
          <div className="h-1 w-full rounded bg-muted" />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded bg-muted"
            >
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TeamPhotosPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-3">
      <div className="w-full space-y-2">
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded bg-muted"
            >
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-0.5">
              <div className="h-1 rounded bg-muted" />
              <div className="h-0.5 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TimelineCollectionPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-3">
      <div className="w-full space-y-2">
        <div className="flex gap-1">
          <div className="w-px bg-muted-foreground/20" />
          <div className="flex-1 space-y-1">
            <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
            <div className="h-1 w-full rounded bg-muted" />
            <div className="h-1 w-5/6 rounded bg-muted" />
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-px bg-muted-foreground/20" />
          <div className="flex-1 space-y-1">
            <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
            <div className="h-1 w-full rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LargeBulletListPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      <div className="w-full space-y-1">
        <div className="h-2 w-full rounded bg-muted-foreground/20" />
        <div className="mt-2 space-y-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <div className="h-1 flex-1 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IconsWithTextPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <div className="grid w-full grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1">
            <div className="mx-auto h-4 w-4 rounded-full bg-muted-foreground/40" />
            <div className="h-1 rounded bg-muted" />
            <div className="h-1 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SmallIconsWithTextPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <div className="grid w-full grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1">
            <div className="mx-auto h-3 w-3 rounded-full bg-muted-foreground/40" />
            <div className="h-0.5 rounded bg-muted" />
            <div className="h-0.5 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TimelineSequencePreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="relative flex h-full w-full items-center">
        <div className="absolute top-1/2 left-4 flex -translate-y-1/2 flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full border-2 border-background bg-muted-foreground shadow-sm"
            />
          ))}
        </div>
        <div className="ml-8 flex-1 space-y-2">
          <div className="h-3 w-3/4 rounded bg-muted" />
          <div className="h-3 w-2/3 rounded bg-muted" />
          <div className="h-3 w-3/4 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function MinimalTimelinePreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-4">
      <div className="w-full space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            <div className="h-2 flex-1 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MinimalTimelineWithBoxesPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-4">
      <div className="w-full space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            <div className="h-6 flex-1 rounded border-2 border-muted-foreground/20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArrowsSequencePreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="flex w-full items-center justify-center gap-1">
        <div className="relative flex h-8 flex-1 items-center justify-end bg-muted-foreground/20 pr-2">
          <div className="absolute -right-2 h-0 w-0 border-t-16 border-b-16 border-l-8 border-t-transparent border-b-transparent border-l-muted-foreground/20" />
        </div>
        <div className="relative flex h-8 flex-1 items-center justify-end bg-muted-foreground/20 pr-2">
          <div className="absolute -right-2 h-0 w-0 border-t-16 border-b-16 border-l-8 border-t-transparent border-b-transparent border-l-muted-foreground/20" />
        </div>
        <div className="h-8 flex-1 bg-muted-foreground/20" />
      </div>
    </div>
  );
}

export function PillsSequencePreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="flex w-full items-center justify-center gap-2">
        <div className="h-7 flex-1 rounded-full bg-muted-foreground/20" />
        <div className="h-7 flex-1 rounded-full bg-muted-foreground/20" />
        <div className="h-7 flex-1 rounded-full bg-muted-foreground/20" />
      </div>
    </div>
  );
}

export function SlantedLabelsPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="flex w-full items-center justify-center gap-2">
        <div className="h-8 flex-1 -skew-x-12 transform bg-muted-foreground/20" />
        <div className="h-8 flex-1 -skew-x-12 transform bg-muted-foreground/20" />
        <div className="h-8 flex-1 -skew-x-12 transform bg-muted-foreground/20" />
      </div>
    </div>
  );
}

export function ArrowsPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-3">
      <div className="w-full space-y-2">
        <div className="h-2 w-full rounded bg-muted-foreground/20" />
        <div className="flex items-center gap-1">
          <div className="h-1 flex-1 rounded bg-muted" />
          <div
            className="h-2 w-2 bg-muted-foreground/40"
            style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%)" }}
          />
          <div className="h-1 flex-1 rounded bg-muted" />
          <div
            className="h-2 w-2 bg-muted-foreground/40"
            style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%)" }}
          />
          <div className="h-1 flex-1 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function FunnelWithTextPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <div className="flex w-full gap-2">
        <div className="flex flex-1 flex-col justify-center gap-0.5">
          <div className="h-2 w-full rounded bg-muted-foreground/20" />
          <div className="h-2 w-4/5 rounded bg-muted-foreground/20" />
          <div className="h-2 w-3/5 rounded bg-muted-foreground/20" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-1 w-full rounded bg-muted" />
          <div className="h-1 w-5/6 rounded bg-muted" />
          <div className="h-1 w-full rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function SteppedPyramidPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <div className="flex w-full gap-2">
        <div className="flex flex-1 flex-col items-center justify-center gap-0.5">
          <div className="h-2 w-1/3 rounded bg-muted-foreground/20" />
          <div className="h-2 w-2/3 rounded bg-muted-foreground/20" />
          <div className="h-2 w-full rounded bg-muted-foreground/20" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-1 w-full rounded bg-muted" />
          <div className="h-1 w-5/6 rounded bg-muted" />
          <div className="h-1 w-full rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function PyramidOutsideTextPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      <div className="flex w-full flex-col items-center gap-0.5">
        <div className="h-2 w-1/4 rounded bg-muted-foreground/20" />
        <div className="h-2 w-2/4 rounded bg-muted-foreground/20" />
        <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
        <div className="h-2 w-full rounded bg-muted-foreground/20" />
      </div>
    </div>
  );
}

export function LeftSteppedPyramidPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <div className="flex w-full gap-2">
        <div className="flex flex-1 flex-col justify-center gap-0.5">
          <div className="h-2 w-1/3 rounded bg-muted-foreground/20" />
          <div className="h-2 w-2/3 rounded bg-muted-foreground/20" />
          <div className="h-2 w-full rounded bg-muted-foreground/20" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-1 w-full rounded bg-muted" />
          <div className="h-1 w-5/6 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function ColumnChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-3">
      <div className="w-full space-y-2">
        <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
        <div className="flex h-12 items-end justify-center gap-1">
          <div className="h-8 w-3 rounded-t bg-muted-foreground/20" />
          <div className="h-10 w-3 rounded-t bg-muted-foreground/20" />
          <div className="h-6 w-3 rounded-t bg-muted-foreground/20" />
        </div>
      </div>
    </div>
  );
}

export function PieChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-3">
      <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
      <div className="flex items-center justify-center">
        <svg viewBox="0 0 32 32" className="h-12 w-12">
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="currentColor"
            className="text-muted"
          />
          <circle
            cx="16"
            cy="16"
            r="10"
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/40"
            strokeWidth="12"
            strokeDasharray="25 75"
            transform="rotate(-90 16 16)"
          />
        </svg>
      </div>
    </div>
  );
}

export function DonutChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-3">
      <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
      <div className="flex items-center justify-center">
        <svg viewBox="0 0 32 32" className="h-12 w-12">
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke="currentColor"
            className="text-muted"
            strokeWidth="6"
          />
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/40"
            strokeWidth="6"
            strokeDasharray="25 75"
            transform="rotate(-90 16 16)"
          />
        </svg>
      </div>
    </div>
  );
}

export function BigNumbersPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-2 p-3">
      <div className="h-2 w-full rounded bg-muted-foreground/20" />
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <div className="text-xs font-bold text-muted-foreground">25%</div>
          <div className="h-0.5 rounded bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold text-muted-foreground">3/4</div>
          <div className="h-0.5 rounded bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold text-muted-foreground">50</div>
          <div className="h-0.5 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function BarStatsPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-3">
      <div className="w-full space-y-2">
        <div className="h-2 w-full rounded bg-muted-foreground/20" />
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="h-1 w-full rounded bg-muted" />
            <div className="h-1 w-3/4 rounded bg-muted" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-full rounded bg-muted" />
            <div className="h-1 w-2/3 rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ThreeRowTablePreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      <div className="w-full space-y-1">
        <div className="h-2 w-full rounded bg-muted-foreground/20" />
        <div className="space-y-0.5">
          <div className="h-1 w-full rounded bg-muted" />
          <div className="h-1 w-full rounded bg-muted" />
          <div className="h-1 w-full rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function YouTubeVideoPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-3">
      <div className="w-full space-y-2">
        <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
        <div className="flex h-16 items-center justify-center rounded bg-muted">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function WebpageEmbedPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-3">
      <div className="w-full space-y-2">
        <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
        <div className="flex h-16 items-center justify-center rounded bg-muted">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
            <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function AccordionPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      <div className="w-full space-y-1">
        <div className="space-y-1 rounded border border-muted-foreground/20 p-1.5">
          <div className="h-1.5 w-3/4 rounded bg-muted-foreground/20" />
        </div>
        <div className="space-y-1 rounded border border-muted-foreground/20 p-1.5">
          <div className="h-1.5 w-3/4 rounded bg-muted-foreground/20" />
        </div>
        <div className="space-y-1 rounded border border-muted-foreground/20 p-1.5">
          <div className="h-1.5 w-3/4 rounded bg-muted-foreground/20" />
        </div>
      </div>
    </div>
  );
}

export function TabsPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      <div className="w-full space-y-1">
        <div className="flex gap-1 border-b border-muted-foreground/20 pb-1">
          <div className="h-1.5 w-12 rounded border-b-2 border-muted-foreground/40 bg-muted-foreground/20" />
          <div className="h-1.5 w-12 rounded bg-muted" />
          <div className="h-1.5 w-12 rounded bg-muted" />
        </div>
        <div className="space-y-1 pt-1">
          <div className="h-1 w-full rounded bg-muted" />
          <div className="h-1 w-5/6 rounded bg-muted" />
          <div className="h-1 w-full rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function QuoteCardPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4">
      <div className="text-2xl text-muted-foreground/20">"</div>
      <div className="h-1 w-16 rounded bg-muted" />
      <div className="w-full space-y-1">
        <div className="mx-auto h-1.5 w-4/5 rounded bg-muted" />
        <div className="mx-auto h-1.5 w-3/4 rounded bg-muted" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-muted" />
        <div className="h-1.5 w-12 rounded bg-muted" />
      </div>
    </div>
  );
}

export function ProfileCardPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center gap-2 p-4">
      <div className="h-12 w-12 rounded-full bg-muted" />
      <div className="h-2 w-16 rounded bg-muted-foreground/20" />
      <div className="h-1.5 w-20 rounded bg-muted" />
      <div className="mt-1 w-full space-y-1">
        <div className="h-1.5 w-full rounded bg-muted" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
      </div>
      <div className="mt-2 flex gap-1">
        <div className="h-5 w-5 rounded border-2 border-muted" />
        <div className="h-5 w-5 rounded border-2 border-muted" />
        <div className="h-5 w-5 rounded border-2 border-muted" />
      </div>
    </div>
  );
}

export function PricingCardPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-2 p-4">
      <div className="h-2 w-16 rounded bg-muted" />
      <div className="flex items-baseline gap-1">
        <div className="h-4 w-8 rounded bg-muted-foreground/20" />
        <div className="h-2 w-8 rounded bg-muted" />
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
          <div className="h-1.5 flex-1 rounded bg-muted" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
          <div className="h-1.5 flex-1 rounded bg-muted" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
          <div className="h-1.5 flex-1 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-auto h-7 rounded bg-muted-foreground/20" />
    </div>
  );
}

export function FeatureHighlightPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-2 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted-foreground/20">
        <div className="h-5 w-5 rounded bg-muted-foreground/40" />
      </div>
      <div className="h-2 w-20 rounded bg-muted-foreground/20" />
      <div className="mt-1 space-y-1.5">
        <div className="h-1.5 w-full rounded bg-muted" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
        <div className="h-1.5 w-4/5 rounded bg-muted" />
      </div>
      <div className="mt-2 h-1.5 w-16 rounded bg-muted-foreground/20" />
    </div>
  );
}

export function CountdownPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4">
      <div className="h-2 w-20 rounded bg-muted" />
      <div className="mt-1 flex gap-2">
        <div className="flex flex-col items-center gap-1">
          <div className="h-6 w-6 rounded bg-muted-foreground/20" />
          <div className="h-1 w-4 rounded bg-muted" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="h-6 w-6 rounded bg-muted-foreground/20" />
          <div className="h-1 w-4 rounded bg-muted" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="h-6 w-6 rounded bg-muted-foreground/20" />
          <div className="h-1 w-4 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-1 h-1.5 w-3/4 rounded bg-muted" />
    </div>
  );
}

export function SocialProofPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
      <div className="flex -space-x-2">
        <div className="h-7 w-7 rounded-full border-2 border-background bg-muted-foreground/20" />
        <div className="h-7 w-7 rounded-full border-2 border-background bg-muted-foreground/20" />
        <div className="h-7 w-7 rounded-full border-2 border-background bg-muted-foreground/20" />
      </div>
      <div className="mt-1 flex gap-0.5">
        <div className="h-3 w-3 rounded bg-muted-foreground/20" />
        <div className="h-3 w-3 rounded bg-muted-foreground/20" />
        <div className="h-3 w-3 rounded bg-muted-foreground/20" />
        <div className="h-3 w-3 rounded bg-muted-foreground/20" />
        <div className="h-3 w-3 rounded bg-muted-foreground/20" />
      </div>
      <div className="mt-2 w-full space-y-1">
        <div className="h-1.5 w-full rounded bg-muted" />
        <div className="mx-auto h-1.5 w-4/5 rounded bg-muted" />
      </div>
    </div>
  );
}

export function CTACardPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
      <div className="h-10 w-10 rounded-full bg-muted-foreground/20" />
      <div className="mt-1 h-2 w-20 rounded bg-muted-foreground/20" />
      <div className="w-full space-y-1">
        <div className="h-1.5 w-full rounded bg-muted" />
        <div className="mx-auto h-1.5 w-5/6 rounded bg-muted" />
      </div>
      <div className="mt-2 h-7 w-full rounded bg-primary" />
    </div>
  );
}

export function ComparisonPreview() {
  return (
    <div className="flex h-full w-full gap-2 p-4">
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-2 w-12 rounded bg-muted" />
        <div className="h-16 w-full rounded bg-muted/40" />
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded bg-muted" />
          <div className="h-1.5 w-4/5 rounded bg-muted" />
        </div>
      </div>
      <div className="flex items-center">
        <div className="text-sm text-muted-foreground/40">â†’</div>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-2 w-12 rounded bg-muted" />
        <div className="h-16 w-full rounded bg-muted/40" />
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded bg-muted" />
          <div className="h-1.5 w-4/5 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function KPICardPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <div className="h-1.5 w-16 rounded bg-muted" />
        <div className="h-5 w-5 rounded bg-muted" />
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="h-5 w-12 rounded bg-muted-foreground/20" />
        <div className="flex items-center gap-1">
          <div className="text-xs text-muted-foreground/40">â†‘</div>
          <div className="h-1.5 w-8 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-auto">
        <svg viewBox="0 0 80 20" className="h-5 w-full">
          <polyline
            points="0,15 20,10 40,12 60,5 80,8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground/40"
          />
        </svg>
      </div>
    </div>
  );
}

export function BadgeCardPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-2 p-4">
      <div className="h-4 w-12 rounded-full bg-muted-foreground/20" />
      <div className="h-2 w-24 rounded bg-muted-foreground/20" />
      <div className="mt-1 space-y-1.5">
        <div className="h-1.5 w-full rounded bg-muted" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
        <div className="h-1.5 w-4/5 rounded bg-muted" />
      </div>
    </div>
  );
}

export function StackedBoxesPreview() {
  return (
    <div className="h-full w-full p-3">
      <div className="space-y-1">
        <div className="h-2 w-full rounded bg-muted-foreground/20" />
        <div className="h-1.5 w-full rounded bg-muted" />
        <div className="h-1 w-4/5 rounded bg-muted" />
      </div>
    </div>
  );
}

export function ThreeTimelinesPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      <div className="flex gap-1">
        <div className="w-px bg-muted-foreground/20" />
        <div className="flex-1 space-y-1">
          <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
          <div className="h-1 w-full rounded bg-muted" />
        </div>
      </div>
      <div className="flex gap-1">
        <div className="w-px bg-muted-foreground/20" />
        <div className="flex-1 space-y-1">
          <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
          <div className="h-1 w-full rounded bg-muted" />
        </div>
      </div>
      <div className="flex gap-1">
        <div className="w-px bg-muted-foreground/20" />
        <div className="flex-1 space-y-1">
          <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
          <div className="h-1 w-full rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function CyclePreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle
          cx="30"
          cy="30"
          r="24"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/40"
        />
        <circle
          cx="30"
          cy="10"
          r="4"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="50"
          cy="30"
          r="4"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="30"
          cy="50"
          r="4"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="10"
          cy="30"
          r="4"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <path
          d="M 45 15 L 48 12 L 51 15"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/40"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function FlowerPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle
          cx="30"
          cy="30"
          r="6"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="30"
          cy="15"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/20"
        />
        <circle
          cx="45"
          cy="30"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/20"
        />
        <circle
          cx="30"
          cy="45"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/20"
        />
        <circle
          cx="15"
          cy="30"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/20"
        />
        <circle
          cx="40"
          cy="20"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/20"
        />
        <circle
          cx="40"
          cy="40"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/20"
        />
        <circle
          cx="20"
          cy="40"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/20"
        />
        <circle
          cx="20"
          cy="20"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/20"
        />
      </svg>
    </div>
  );
}

export function CirclePreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle
          cx="30"
          cy="30"
          r="6"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="30"
          cy="30"
          r="14"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/20"
        />
        <circle
          cx="30"
          cy="30"
          r="22"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/20"
        />
      </svg>
    </div>
  );
}

export function RingPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle
          cx="30"
          cy="30"
          r="20"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted-foreground/20"
        />
        <circle
          cx="30"
          cy="10"
          r="3"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="48"
          cy="18"
          r="3"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="48"
          cy="42"
          r="3"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="30"
          cy="50"
          r="3"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="12"
          cy="42"
          r="3"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="12"
          cy="18"
          r="3"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
      </svg>
    </div>
  );
}

export function SemiCirclePreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path
          d="M 10 40 Q 30 10, 50 40"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/20"
          fill="none"
        />
        <circle
          cx="10"
          cy="40"
          r="3"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="23"
          cy="25"
          r="3"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="30"
          cy="20"
          r="3"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="37"
          cy="25"
          r="3"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
        <circle
          cx="50"
          cy="40"
          r="3"
          fill="currentColor"
          className="text-muted-foreground/40"
        />
      </svg>
    </div>
  );
}

export function StaircasePreview() {
  return (
    <div className="flex h-full w-full items-end justify-center gap-0.5 p-3">
      <div className="h-6 w-3 bg-muted-foreground/20" />
      <div className="h-10 w-3 bg-muted-foreground/20" />
      <div className="h-14 w-3 bg-muted-foreground/20" />
      <div className="h-18 w-3 bg-muted-foreground/20" />
    </div>
  );
}

export function SequenceArrowPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 p-3">
      {/* First box */}
      <div className="h-5 w-16 rounded bg-muted-foreground/20" />
      {/* Arrow pointing down */}
      <div
        className="h-0 w-0"
        style={{
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "8px solid hsl(var(--muted-foreground) / 0.2)",
        }}
      />
      {/* Second box */}
      <div className="h-5 w-16 rounded bg-muted-foreground/20" />
      {/* Arrow pointing down */}
      <div
        className="h-0 w-0"
        style={{
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "8px solid hsl(var(--muted-foreground) / 0.2)",
        }}
      />
      {/* Third box */}
      <div className="h-5 w-16 rounded bg-muted-foreground/20" />
    </div>
  );
}

export function ArrowListPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="flex w-full items-center justify-center gap-2">
        {/* Arrow shape 1 */}
        <svg viewBox="0 0 50 24" className="h-8 max-w-[50px] flex-1">
          <path
            d="M0,0 L38,0 L50,12 L38,24 L0,24 Z"
            className="fill-muted-foreground/20"
          />
        </svg>
        {/* Arrow shape 2 */}
        <svg viewBox="0 0 50 24" className="h-8 max-w-[50px] flex-1">
          <path
            d="M0,0 L38,0 L50,12 L38,24 L0,24 Z"
            className="fill-muted-foreground/20"
          />
        </svg>
        {/* Arrow shape 3 */}
        <svg viewBox="0 0 50 24" className="h-8 max-w-[50px] flex-1">
          <path
            d="M0,0 L38,0 L50,12 L38,24 L0,24 Z"
            className="fill-muted-foreground/20"
          />
        </svg>
      </div>
    </div>
  );
}

export function StepsPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 p-3">
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted-foreground/20">
          <div className="text-[8px] font-semibold text-muted-foreground">
            1
          </div>
        </div>
        <div className="h-1 w-8 rounded bg-muted" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted-foreground/20">
          <div className="text-[8px] font-semibold text-muted-foreground">
            2
          </div>
        </div>
        <div className="h-1 w-8 rounded bg-muted" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted-foreground/20">
          <div className="text-[8px] font-semibold text-muted-foreground">
            3
          </div>
        </div>
        <div className="h-1 w-8 rounded bg-muted" />
      </div>
    </div>
  );
}

export function BoxStepsPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-1.5 p-3">
      <div className="flex h-10 flex-1 items-center justify-center rounded border-2 border-muted-foreground/20">
        <div className="text-[8px] font-semibold text-muted-foreground">1</div>
      </div>
      <div className="flex h-10 flex-1 items-center justify-center rounded border-2 border-muted-foreground/20">
        <div className="text-[8px] font-semibold text-muted-foreground">2</div>
      </div>
      <div className="flex h-10 flex-1 items-center justify-center rounded border-2 border-muted-foreground/20">
        <div className="text-[8px] font-semibold text-muted-foreground">3</div>
      </div>
    </div>
  );
}

export function ArrowStepsPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-0.5 p-3">
      <div className="relative flex h-8 w-8 items-center justify-center bg-muted-foreground/20">
        <div className="text-[8px] font-semibold text-muted-foreground">1</div>
        <div className="absolute top-1/2 -right-1 h-0 w-0 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-muted-foreground/20" />
      </div>
      <div className="relative flex h-8 w-8 items-center justify-center bg-muted-foreground/20">
        <div className="text-[8px] font-semibold text-muted-foreground">2</div>
        <div className="absolute top-1/2 -right-1 h-0 w-0 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-muted-foreground/20" />
      </div>
      <div className="flex h-8 w-8 items-center justify-center bg-muted-foreground/20">
        <div className="text-[8px] font-semibold text-muted-foreground">3</div>
      </div>
    </div>
  );
}

export function StepsWithIconsPreview() {
  return (
    <div className="h-full w-full space-y-1.5 p-3">
      <div className="flex items-center gap-2">
        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20">
          <div className="h-1.5 w-1.5 rounded-sm bg-muted-foreground" />
        </div>
        <div className="h-1 flex-1 rounded bg-muted" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20">
          <div className="h-1.5 w-1.5 rounded-sm bg-muted-foreground" />
        </div>
        <div className="h-1 flex-1 rounded bg-muted" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20">
          <div className="h-1.5 w-1.5 rounded-sm bg-muted-foreground" />
        </div>
        <div className="h-1 flex-1 rounded bg-muted" />
      </div>
    </div>
  );
}

export function StatsPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 p-3">
      <div className="space-y-1 text-center">
        <div className="text-lg font-bold text-muted-foreground">42</div>
        <div className="h-0.5 w-6 rounded bg-muted" />
      </div>
      <div className="space-y-1 text-center">
        <div className="text-lg font-bold text-muted-foreground">85%</div>
        <div className="h-0.5 w-6 rounded bg-muted" />
      </div>
      <div className="space-y-1 text-center">
        <div className="text-lg font-bold text-muted-foreground">12K</div>
        <div className="h-0.5 w-6 rounded bg-muted" />
      </div>
    </div>
  );
}

export function CircleStatsPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-2 p-3">
      <div className="flex justify-center gap-2">
        <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/20" />
        <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/20" />
        <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/20" />
      </div>
      <div className="grid grid-cols-3 gap-1">
        <div className="space-y-1">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="h-1 rounded bg-muted" />
          <div className="h-1 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function BarStatsFullPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 p-3">
      <div className="space-y-1">
        <div className="h-1.5 w-full rounded bg-muted-foreground/20" />
        <div className="h-1.5 w-3/4 rounded bg-muted" />
      </div>
      <div className="space-y-1">
        <div className="h-1.5 w-full rounded bg-muted-foreground/20" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
      </div>
      <div className="space-y-1">
        <div className="h-1.5 w-full rounded bg-muted-foreground/20" />
        <div className="h-1.5 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}

export function StarRatingPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-1 p-3">
      {[1, 2, 3].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-6 w-6 fill-muted-foreground/20"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {[4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-6 w-6 fill-muted">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function DotGridStatsPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-3">
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i < 15 ? "bg-muted-foreground/20" : "bg-muted"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function DotLineStatsPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-1 p-3">
      <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
      <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
      <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
      <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
      <div className="h-2 w-2 rounded-full bg-muted" />
      <div className="h-2 w-2 rounded-full bg-muted" />
    </div>
  );
}

export function CircleStatsMiddleBoldPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-3 p-3">
      {/* First circle */}
      <div className="relative">
        <svg viewBox="0 0 40 40" className="h-10 w-10">
          {/* Outer thin ring */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/30"
            strokeWidth="1"
          />
          {/* Main progress track */}
          <circle
            cx="20"
            cy="20"
            r="14"
            fill="none"
            stroke="currentColor"
            className="text-muted"
            strokeWidth="4"
          />
          {/* Progress fill */}
          <circle
            cx="20"
            cy="20"
            r="14"
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/60"
            strokeWidth="4"
            strokeDasharray="55 88"
            transform="rotate(-90 20 20)"
          />
          {/* Inner circle */}
          <circle
            cx="20"
            cy="20"
            r="9"
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/40"
            strokeWidth="1"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-muted-foreground">
          0
        </span>
      </div>
      {/* Second circle */}
      <div className="relative">
        <svg viewBox="0 0 40 40" className="h-10 w-10">
          {/* Outer thin ring */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/30"
            strokeWidth="1"
          />
          {/* Main progress track */}
          <circle
            cx="20"
            cy="20"
            r="14"
            fill="none"
            stroke="currentColor"
            className="text-muted"
            strokeWidth="4"
          />
          {/* Progress fill */}
          <circle
            cx="20"
            cy="20"
            r="14"
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/60"
            strokeWidth="4"
            strokeDasharray="35 88"
            transform="rotate(-90 20 20)"
          />
          {/* Inner circle */}
          <circle
            cx="20"
            cy="20"
            r="9"
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/40"
            strokeWidth="1"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-muted-foreground">
          0
        </span>
      </div>
    </div>
  );
}

export function CircleStatsExternalBoldPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-3">
      <svg viewBox="0 0 32 32" className="h-14 w-14">
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="currentColor"
          className="text-muted"
          strokeWidth="3"
        />
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="currentColor"
          className="text-muted-foreground/20"
          strokeWidth="3"
          strokeDasharray="47 75"
          transform="rotate(-90 16 16)"
        />
        <circle
          cx="16"
          cy="16"
          r="15"
          fill="none"
          stroke="currentColor"
          className="text-muted-foreground/40"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export function QuoteWithMarksPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="flex flex-col items-center gap-2">
        <div className="font-serif text-3xl text-muted-foreground/20">
          &ldquo;
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-24 rounded bg-muted-foreground/20" />
          <div className="h-1.5 w-20 rounded bg-muted-foreground/20" />
        </div>
        <div className="rotate-180 font-serif text-3xl text-muted-foreground/20">
          &ldquo;
        </div>
        <div className="mt-1 h-1 w-16 rounded bg-muted-foreground/40" />
      </div>
    </div>
  );
}

export function TestimonialCardPreview() {
  return (
    <div className="flex h-full w-full flex-col gap-2 p-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-muted-foreground/20" />
        <div className="flex-1 space-y-1">
          <div className="h-1.5 w-16 rounded bg-muted-foreground/40" />
          <div className="h-1 w-12 rounded bg-muted-foreground/20" />
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="h-1.5 w-full rounded bg-muted" />
        <div className="h-1.5 w-5/6 rounded bg-muted" />
        <div className="h-1.5 w-4/5 rounded bg-muted" />
      </div>
    </div>
  );
}

export function SideBorderedQuotePreview() {
  return (
    <div className="flex h-full w-full items-center p-4">
      <div className="flex w-full items-start gap-2">
        <div className="h-16 w-1 rounded bg-muted-foreground/40" />
        <div className="flex-1 space-y-2">
          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded bg-muted-foreground/20" />
            <div className="h-1.5 w-5/6 rounded bg-muted-foreground/20" />
            <div className="h-1.5 w-4/5 rounded bg-muted-foreground/20" />
          </div>
          <div className="h-1 w-16 rounded bg-muted-foreground/40" />
        </div>
      </div>
    </div>
  );
}

export function CenteredQuotePreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
      <div className="h-0.5 w-8 rounded bg-muted-foreground/20" />
      <div className="font-serif text-2xl text-muted-foreground/20">
        &ldquo;
      </div>
      <div className="w-full space-y-1">
        <div className="mx-auto h-1.5 w-3/4 rounded bg-muted-foreground/20" />
        <div className="mx-auto h-1.5 w-2/3 rounded bg-muted-foreground/20" />
      </div>
      <div className="rotate-180 font-serif text-2xl text-muted-foreground/20">
        &ldquo;
      </div>
      <div className="h-0.5 w-8 rounded bg-muted-foreground/20" />
      <div className="mt-1 h-1 w-16 rounded bg-muted-foreground/40" />
    </div>
  );
}

export function BulletsCollectionPreview() {
  return (
    <div className="grid h-full w-full place-items-center space-y-1 p-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-1.5">
          <div className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
          <div className="h-1 flex-1 rounded bg-muted-foreground/20" />
        </div>
      ))}
    </div>
  );
}

export function IconsCollectionPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-3">
      <div className="grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="mx-auto flex h-4 w-4 items-center justify-center rounded-full bg-muted-foreground/40"
          >
            <div className="h-1.5 w-1.5 rounded-sm bg-primary-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// CHART PREVIEW COMPONENTS
// =====================================================

export function AreaChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              className="text-muted-foreground/50"
              style={{ stopColor: "currentColor" }}
            />
            <stop
              offset="100%"
              className="text-muted-foreground/10"
              style={{ stopColor: "currentColor" }}
            />
          </linearGradient>
        </defs>
        <path
          d="M10,60 Q30,40 50,50 T90,30 L90,70 L10,70 Z"
          fill="url(#areaGradient)"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

export function ScatterChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <circle cx="20" cy="50" r="4" className="fill-muted-foreground" />
        <circle cx="35" cy="35" r="4" className="fill-muted-foreground" />
        <circle cx="50" cy="55" r="4" className="fill-muted-foreground" />
        <circle cx="65" cy="25" r="4" className="fill-muted-foreground" />
        <circle cx="80" cy="40" r="4" className="fill-muted-foreground" />
        <circle cx="95" cy="30" r="4" className="fill-muted-foreground" />
        <circle cx="45" cy="45" r="4" className="fill-muted-foreground/60" />
        <circle cx="70" cy="50" r="4" className="fill-muted-foreground/60" />
      </svg>
    </div>
  );
}

export function BubbleChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <circle cx="30" cy="45" r="12" className="fill-muted-foreground/60" />
        <circle cx="60" cy="35" r="18" className="fill-muted-foreground/60" />
        <circle cx="90" cy="50" r="10" className="fill-muted-foreground/60" />
        <circle cx="45" cy="55" r="8" className="fill-muted-foreground/40" />
        <circle cx="75" cy="55" r="6" className="fill-muted-foreground/40" />
      </svg>
    </div>
  );
}

export function HistogramChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <rect
          x="10"
          y="50"
          width="12"
          height="20"
          className="fill-muted-foreground"
        />
        <rect
          x="24"
          y="35"
          width="12"
          height="35"
          className="fill-muted-foreground"
        />
        <rect
          x="38"
          y="20"
          width="12"
          height="50"
          className="fill-muted-foreground"
        />
        <rect
          x="52"
          y="25"
          width="12"
          height="45"
          className="fill-muted-foreground"
        />
        <rect
          x="66"
          y="40"
          width="12"
          height="30"
          className="fill-muted-foreground"
        />
        <rect
          x="80"
          y="55"
          width="12"
          height="15"
          className="fill-muted-foreground"
        />
        <rect
          x="94"
          y="60"
          width="12"
          height="10"
          className="fill-muted-foreground"
        />
      </svg>
    </div>
  );
}

export function RangeBarChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <rect
          x="25"
          y="12"
          width="50"
          height="10"
          rx="2"
          className="fill-muted-foreground"
        />
        <rect
          x="20"
          y="28"
          width="60"
          height="10"
          rx="2"
          className="fill-muted-foreground"
        />
        <rect
          x="35"
          y="44"
          width="40"
          height="10"
          rx="2"
          className="fill-muted-foreground"
        />
        <rect
          x="30"
          y="60"
          width="55"
          height="10"
          rx="2"
          className="fill-muted-foreground"
        />
      </svg>
    </div>
  );
}

export function RangeAreaChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <path
          d="M10,45 Q30,30 50,35 T90,25 L90,55 Q70,50 50,55 T10,60 Z"
          className="fill-muted-foreground/40 stroke-muted-foreground"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export function WaterfallChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <rect
          x="10"
          y="20"
          width="14"
          height="35"
          className="fill-muted-foreground"
        />
        <rect
          x="28"
          y="30"
          width="14"
          height="15"
          className="fill-muted-foreground/60"
        />
        <rect
          x="46"
          y="25"
          width="14"
          height="20"
          className="fill-muted-foreground/60"
        />
        <rect x="64" y="35" width="14" height="25" className="fill-muted/80" />
        <rect
          x="82"
          y="20"
          width="14"
          height="40"
          className="fill-muted-foreground"
        />
        <line
          x1="24"
          y1="55"
          x2="28"
          y2="55"
          className="stroke-muted-foreground"
          strokeWidth="1"
          strokeDasharray="2"
        />
        <line
          x1="42"
          y1="45"
          x2="46"
          y2="45"
          className="stroke-muted-foreground"
          strokeWidth="1"
          strokeDasharray="2"
        />
        <line
          x1="60"
          y1="45"
          x2="64"
          y2="45"
          className="stroke-muted-foreground"
          strokeWidth="1"
          strokeDasharray="2"
        />
        <line
          x1="78"
          y1="60"
          x2="82"
          y2="60"
          className="stroke-muted-foreground"
          strokeWidth="1"
          strokeDasharray="2"
        />
      </svg>
    </div>
  );
}

export function BoxPlotChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <line
          x1="25"
          y1="15"
          x2="25"
          y2="65"
          className="stroke-muted-foreground"
          strokeWidth="1"
        />
        <rect
          x="15"
          y="25"
          width="20"
          height="25"
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <line
          x1="15"
          y1="40"
          x2="35"
          y2="40"
          className="stroke-muted-foreground"
          strokeWidth="2"
        />
        <line
          x1="25"
          y1="15"
          x2="25"
          y2="25"
          className="stroke-muted-foreground"
          strokeWidth="1"
        />
        <line
          x1="25"
          y1="50"
          x2="25"
          y2="65"
          className="stroke-muted-foreground"
          strokeWidth="1"
        />

        <line
          x1="65"
          y1="20"
          x2="65"
          y2="60"
          className="stroke-muted-foreground"
          strokeWidth="1"
        />
        <rect
          x="55"
          y="30"
          width="20"
          height="20"
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <line
          x1="55"
          y1="38"
          x2="75"
          y2="38"
          className="stroke-muted-foreground"
          strokeWidth="2"
        />

        <line
          x1="100"
          y1="10"
          x2="100"
          y2="70"
          className="stroke-muted-foreground"
          strokeWidth="1"
        />
        <rect
          x="90"
          y="22"
          width="20"
          height="30"
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <line
          x1="90"
          y1="35"
          x2="110"
          y2="35"
          className="stroke-muted-foreground"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export function CandlestickChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <line
          x1="20"
          y1="15"
          x2="20"
          y2="60"
          className="stroke-muted-foreground"
          strokeWidth="1"
        />
        <rect
          x="15"
          y="25"
          width="10"
          height="20"
          className="fill-muted-foreground"
        />

        <line
          x1="40"
          y1="20"
          x2="40"
          y2="55"
          className="stroke-muted-foreground"
          strokeWidth="1"
        />
        <rect
          x="35"
          y="30"
          width="10"
          height="15"
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />

        <line
          x1="60"
          y1="10"
          x2="60"
          y2="50"
          className="stroke-muted-foreground"
          strokeWidth="1"
        />
        <rect
          x="55"
          y="18"
          width="10"
          height="22"
          className="fill-muted-foreground"
        />

        <line
          x1="80"
          y1="25"
          x2="80"
          y2="65"
          className="stroke-muted-foreground"
          strokeWidth="1"
        />
        <rect
          x="75"
          y="35"
          width="10"
          height="18"
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />

        <line
          x1="100"
          y1="20"
          x2="100"
          y2="58"
          className="stroke-muted-foreground"
          strokeWidth="1"
        />
        <rect
          x="95"
          y="28"
          width="10"
          height="20"
          className="fill-muted-foreground"
        />
      </svg>
    </div>
  );
}

export function OHLCChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <g className="stroke-muted-foreground" strokeWidth="1.5">
          <line x1="20" y1="15" x2="20" y2="60" />
          <line x1="15" y1="25" x2="20" y2="25" />
          <line x1="20" y1="50" x2="25" y2="50" />
        </g>
        <g className="stroke-muted-foreground" strokeWidth="1.5">
          <line x1="45" y1="20" x2="45" y2="55" />
          <line x1="40" y1="30" x2="45" y2="30" />
          <line x1="45" y1="45" x2="50" y2="45" />
        </g>
        <g className="stroke-muted-foreground" strokeWidth="1.5">
          <line x1="70" y1="10" x2="70" y2="50" />
          <line x1="65" y1="18" x2="70" y2="18" />
          <line x1="70" y1="40" x2="75" y2="40" />
        </g>
        <g className="stroke-muted-foreground" strokeWidth="1.5">
          <line x1="95" y1="25" x2="95" y2="65" />
          <line x1="90" y1="35" x2="95" y2="35" />
          <line x1="95" y1="55" x2="100" y2="55" />
        </g>
      </svg>
    </div>
  );
}

export function RadarLineChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <polygon
          points="60,10 95,30 85,65 35,65 25,30"
          fill="none"
          className="stroke-muted"
          strokeWidth="1"
        />
        <polygon
          points="60,25 80,35 75,55 45,55 40,35"
          fill="none"
          className="stroke-muted"
          strokeWidth="1"
        />
        <polygon
          points="60,20 85,32 78,58 42,58 35,32"
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <circle cx="60" cy="20" r="2" className="fill-muted-foreground" />
        <circle cx="85" cy="32" r="2" className="fill-muted-foreground" />
        <circle cx="78" cy="58" r="2" className="fill-muted-foreground" />
        <circle cx="42" cy="58" r="2" className="fill-muted-foreground" />
        <circle cx="35" cy="32" r="2" className="fill-muted-foreground" />
      </svg>
    </div>
  );
}

export function RadarAreaChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <polygon
          points="60,10 95,30 85,65 35,65 25,30"
          fill="none"
          className="stroke-muted"
          strokeWidth="1"
        />
        <polygon
          points="60,20 85,32 78,58 42,58 35,32"
          className="fill-muted-foreground/30 stroke-muted-foreground"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

export function NightingaleChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <path
          d="M60,40 L60,10 A30,30 0 0,1 85,25 Z"
          className="fill-muted-foreground"
        />
        <path
          d="M60,40 L85,25 A30,30 0 0,1 90,55 Z"
          className="fill-muted-foreground/60"
        />
        <path d="M60,40 L90,55 A30,30 0 0,1 60,70 Z" className="fill-muted" />
        <path
          d="M60,40 L60,70 A30,30 0 0,1 30,55 Z"
          className="fill-muted-foreground/70"
        />
        <path
          d="M60,40 L30,55 A30,30 0 0,1 35,25 Z"
          className="fill-muted-foreground/50"
        />
        <path
          d="M60,40 L35,25 A30,30 0 0,1 60,10 Z"
          className="fill-muted/70"
        />
      </svg>
    </div>
  );
}

export function RadialColumnChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <circle
          cx="60"
          cy="40"
          r="28"
          fill="none"
          className="stroke-muted"
          strokeWidth="8"
        />
        <path
          d="M60,12 A28,28 0 0,1 88,40"
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="8"
        />
        <path
          d="M88,40 A28,28 0 0,1 60,68"
          fill="none"
          className="stroke-muted-foreground/60"
          strokeWidth="8"
        />
      </svg>
    </div>
  );
}

export function RadialBarChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 60 60" className="h-full w-full max-w-[50px]">
        {/* Background tracks */}
        <circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          className="stroke-muted"
          strokeWidth="5"
        />
        <circle
          cx="30"
          cy="30"
          r="18"
          fill="none"
          className="stroke-muted"
          strokeWidth="5"
        />
        <circle
          cx="30"
          cy="30"
          r="10"
          fill="none"
          className="stroke-muted"
          strokeWidth="5"
        />
        {/* Data arcs - starting from top (270deg = -90deg) going clockwise */}
        {/* Outer ring - 75% */}
        <circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="122.5 163.4"
          strokeDashoffset="40.8"
          transform="rotate(-90 30 30)"
        />
        {/* Middle ring - 60% */}
        <circle
          cx="30"
          cy="30"
          r="18"
          fill="none"
          className="stroke-muted-foreground/70"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="67.9 113.1"
          strokeDashoffset="28.3"
          transform="rotate(-90 30 30)"
        />
        {/* Inner ring - 85% */}
        <circle
          cx="30"
          cy="30"
          r="10"
          fill="none"
          className="stroke-muted-foreground/50"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="53.4 62.8"
          strokeDashoffset="15.7"
          transform="rotate(-90 30 30)"
        />
      </svg>
    </div>
  );
}

export function SunburstChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <circle cx="60" cy="40" r="10" className="fill-muted-foreground" />
        <path
          d="M60,28 A12,12 0 0,1 72,40 L82,40 A22,22 0 0,0 60,18 Z"
          className="fill-muted-foreground/60"
        />
        <path
          d="M72,40 A12,12 0 0,1 60,52 L60,62 A22,22 0 0,0 82,40 Z"
          className="fill-muted"
        />
        <path
          d="M60,52 A12,12 0 0,1 48,40 L38,40 A22,22 0 0,0 60,62 Z"
          className="fill-muted-foreground/60"
        />
        <path
          d="M48,40 A12,12 0 0,1 60,28 L60,18 A22,22 0 0,0 38,40 Z"
          className="fill-muted-foreground/40"
        />
      </svg>
    </div>
  );
}

export function TreemapChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <rect
          x="10"
          y="10"
          width="50"
          height="35"
          rx="2"
          className="fill-muted-foreground"
        />
        <rect
          x="65"
          y="10"
          width="45"
          height="20"
          rx="2"
          className="fill-muted-foreground/60"
        />
        <rect
          x="65"
          y="35"
          width="20"
          height="35"
          rx="2"
          className="fill-muted"
        />
        <rect
          x="90"
          y="35"
          width="20"
          height="35"
          rx="2"
          className="fill-muted-foreground/50"
        />
        <rect
          x="10"
          y="50"
          width="25"
          height="20"
          rx="2"
          className="fill-muted-foreground/70"
        />
        <rect
          x="40"
          y="50"
          width="20"
          height="20"
          rx="2"
          className="fill-muted/70"
        />
      </svg>
    </div>
  );
}

export function HeatmapChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <rect
          x="10"
          y="10"
          width="18"
          height="18"
          className="fill-muted-foreground/90"
        />
        <rect
          x="32"
          y="10"
          width="18"
          height="18"
          className="fill-muted-foreground/50"
        />
        <rect
          x="54"
          y="10"
          width="18"
          height="18"
          className="fill-muted-foreground/30"
        />
        <rect
          x="76"
          y="10"
          width="18"
          height="18"
          className="fill-muted-foreground/70"
        />
        <rect
          x="98"
          y="10"
          width="18"
          height="18"
          className="fill-muted-foreground/40"
        />
        <rect
          x="10"
          y="32"
          width="18"
          height="18"
          className="fill-muted-foreground/40"
        />
        <rect
          x="32"
          y="32"
          width="18"
          height="18"
          className="fill-muted-foreground/80"
        />
        <rect
          x="54"
          y="32"
          width="18"
          height="18"
          className="fill-muted-foreground/60"
        />
        <rect
          x="76"
          y="32"
          width="18"
          height="18"
          className="fill-muted-foreground/20"
        />
        <rect
          x="98"
          y="32"
          width="18"
          height="18"
          className="fill-muted-foreground/90"
        />
        <rect
          x="10"
          y="54"
          width="18"
          height="18"
          className="fill-muted-foreground/60"
        />
        <rect
          x="32"
          y="54"
          width="18"
          height="18"
          className="fill-muted-foreground/30"
        />
        <rect
          x="54"
          y="54"
          width="18"
          height="18"
          className="fill-muted-foreground/90"
        />
        <rect
          x="76"
          y="54"
          width="18"
          height="18"
          className="fill-muted-foreground/50"
        />
        <rect
          x="98"
          y="54"
          width="18"
          height="18"
          className="fill-muted-foreground/70"
        />
      </svg>
    </div>
  );
}

export function SankeyChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <path
          d="M10,15 C40,15 40,20 70,20 L70,35 C40,35 40,30 10,30 Z"
          className="fill-muted-foreground/60"
        />
        <path
          d="M10,35 C40,35 40,45 70,45 L70,55 C40,55 40,45 10,45 Z"
          className="fill-muted-foreground/40"
        />
        <path
          d="M10,50 C40,50 40,60 70,60 L70,70 C40,70 40,60 10,60 Z"
          className="fill-muted/60"
        />
        <path
          d="M75,20 C95,20 95,15 110,15 L110,25 C95,25 95,30 75,30 Z"
          className="fill-muted-foreground/60"
        />
        <path
          d="M75,45 C95,45 95,35 110,35 L110,55 C95,55 95,55 75,55 Z"
          className="fill-muted-foreground/40"
        />
        <path
          d="M75,60 C95,60 95,60 110,60 L110,70 C95,70 95,70 75,70 Z"
          className="fill-muted/60"
        />
      </svg>
    </div>
  );
}

export function ChordChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <circle
          cx="60"
          cy="40"
          r="30"
          fill="none"
          className="stroke-muted"
          strokeWidth="6"
        />
        <path
          d="M35,20 Q60,50 85,20"
          fill="none"
          className="stroke-muted-foreground/60"
          strokeWidth="2"
        />
        <path
          d="M30,50 Q55,30 90,50"
          fill="none"
          className="stroke-muted-foreground/40"
          strokeWidth="2"
        />
        <path
          d="M45,65 Q60,35 75,65"
          fill="none"
          className="stroke-muted/60"
          strokeWidth="2"
        />
        <circle cx="35" cy="20" r="4" className="fill-muted-foreground" />
        <circle cx="85" cy="20" r="4" className="fill-muted-foreground" />
        <circle cx="30" cy="50" r="4" className="fill-muted-foreground/60" />
        <circle cx="90" cy="50" r="4" className="fill-muted-foreground/60" />
        <circle cx="45" cy="65" r="4" className="fill-muted" />
        <circle cx="75" cy="65" r="4" className="fill-muted" />
      </svg>
    </div>
  );
}

export function FunnelChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <path
          d="M15,10 L105,10 L90,25 L30,25 Z"
          className="fill-muted-foreground"
        />
        <path
          d="M30,28 L90,28 L80,43 L40,43 Z"
          className="fill-muted-foreground/60"
        />
        <path d="M40,46 L80,46 L70,61 L50,61 Z" className="fill-muted" />
        <path
          d="M50,64 L70,64 L65,75 L55,75 Z"
          className="fill-muted-foreground/50"
        />
      </svg>
    </div>
  );
}

export function ConeFunnelChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <ellipse
          cx="60"
          cy="12"
          rx="45"
          ry="6"
          className="fill-muted-foreground"
        />
        <path
          d="M15,12 Q20,40 60,75 Q100,40 105,12"
          className="fill-muted-foreground/30"
        />
        <ellipse
          cx="60"
          cy="30"
          rx="35"
          ry="5"
          className="fill-muted-foreground/50"
        />
        <ellipse cx="60" cy="50" rx="22" ry="4" className="fill-muted/50" />
      </svg>
    </div>
  );
}

export function PyramidChartPreview2() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <path
          d="M60,5 L100,70 L20,70 Z"
          fill="none"
          className="stroke-muted"
          strokeWidth="1"
        />
        <path d="M60,5 L70,25 L50,25 Z" className="fill-muted-foreground" />
        <path
          d="M50,25 L70,25 L80,45 L40,45 Z"
          className="fill-muted-foreground/60"
        />
        <path d="M40,45 L80,45 L100,70 L20,70 Z" className="fill-muted" />
      </svg>
    </div>
  );
}

export function RadialGaugeChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <path
          d="M20,60 A40,40 0 0,1 100,60"
          fill="none"
          className="stroke-muted"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M20,60 A40,40 0 0,1 75,22"
          fill="none"
          className="stroke-muted-foreground"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="60" cy="60" r="4" className="fill-muted-foreground" />
        <line
          x1="60"
          y1="60"
          x2="70"
          y2="30"
          className="stroke-muted-foreground"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export function LinearGaugeChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <rect
          x="10"
          y="35"
          width="100"
          height="10"
          rx="5"
          className="fill-muted"
        />
        <rect
          x="10"
          y="35"
          width="65"
          height="10"
          rx="5"
          className="fill-muted-foreground"
        />
        <text x="10" y="60" fontSize="8" className="fill-muted-foreground">
          0
        </text>
        <text x="55" y="60" fontSize="8" className="fill-muted-foreground">
          50
        </text>
        <text x="100" y="60" fontSize="8" className="fill-muted-foreground">
          100
        </text>
      </svg>
    </div>
  );
}

export function CombinationChartPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <rect
          x="15"
          y="40"
          width="12"
          height="25"
          className="fill-muted-foreground"
        />
        <rect
          x="35"
          y="30"
          width="12"
          height="35"
          className="fill-muted-foreground"
        />
        <rect
          x="55"
          y="45"
          width="12"
          height="20"
          className="fill-muted-foreground"
        />
        <rect
          x="75"
          y="35"
          width="12"
          height="30"
          className="fill-muted-foreground"
        />
        <rect
          x="95"
          y="50"
          width="12"
          height="15"
          className="fill-muted-foreground"
        />
        <polyline
          points="21,35 41,25 61,40 81,30 101,45"
          fill="none"
          className="stroke-muted-foreground/60"
          strokeWidth="2"
        />
        <circle cx="21" cy="35" r="3" className="fill-muted-foreground/60" />
        <circle cx="41" cy="25" r="3" className="fill-muted-foreground/60" />
        <circle cx="61" cy="40" r="3" className="fill-muted-foreground/60" />
        <circle cx="81" cy="30" r="3" className="fill-muted-foreground/60" />
        <circle cx="101" cy="45" r="3" className="fill-muted-foreground/60" />
      </svg>
    </div>
  );
}

export function PyramidPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 100 80" className="h-full w-full">
        {/* Pyramid shape with 4 layers */}
        {/* Top triangle */}
        <polygon
          points="50,5 42,22 58,22"
          className="fill-muted-foreground/80"
        />
        {/* Second layer trapezoid */}
        <polygon
          points="42,24 58,24 66,41 34,41"
          className="fill-muted-foreground/60"
        />
        {/* Third layer trapezoid */}
        <polygon
          points="34,43 66,43 74,60 26,60"
          className="fill-muted-foreground/40"
        />
        {/* Bottom layer trapezoid */}
        <polygon
          points="26,62 74,62 82,79 18,79"
          className="fill-muted-foreground/30"
        />
        {/* Layer text placeholders */}
        <rect
          x="62"
          y="10"
          width="25"
          height="3"
          rx="1"
          className="fill-muted"
        />
        <rect
          x="70"
          y="30"
          width="20"
          height="3"
          rx="1"
          className="fill-muted"
        />
        <rect
          x="78"
          y="49"
          width="15"
          height="3"
          rx="1"
          className="fill-muted"
        />
        <rect
          x="86"
          y="68"
          width="10"
          height="3"
          rx="1"
          className="fill-muted"
        />
      </svg>
    </div>
  );
}

export function VerticalFunnelPreview() {
  return (
    <div className="grid h-full w-full place-items-center p-3">
      <svg viewBox="0 0 100 80" className="h-full w-full">
        {/* Funnel shape (inverted pyramid) with 4 layers */}
        {/* Top layer (widest) */}
        <polygon
          points="18,5 82,5 74,22 26,22"
          className="fill-muted-foreground/80"
        />
        {/* Second layer */}
        <polygon
          points="26,24 74,24 66,41 34,41"
          className="fill-muted-foreground/60"
        />
        {/* Third layer */}
        <polygon
          points="34,43 66,43 58,60 42,60"
          className="fill-muted-foreground/40"
        />
        {/* Bottom triangle (narrowest) */}
        <polygon
          points="42,62 58,62 50,79"
          className="fill-muted-foreground/30"
        />
        {/* Layer text placeholders */}
        <rect
          x="86"
          y="10"
          width="10"
          height="3"
          rx="1"
          className="fill-muted"
        />
        <rect
          x="78"
          y="30"
          width="15"
          height="3"
          rx="1"
          className="fill-muted"
        />
        <rect
          x="70"
          y="49"
          width="20"
          height="3"
          rx="1"
          className="fill-muted"
        />
        <rect
          x="62"
          y="68"
          width="25"
          height="3"
          rx="1"
          className="fill-muted"
        />
      </svg>
    </div>
  );
}

// Quote Previews
export function LargeQuotePreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-3">
      <div className="flex h-10 max-w-full items-center gap-2">
        {/* Opening quote mark */}
        <div className="font-serif text-2xl leading-none text-muted-foreground/30">
          "
        </div>
        <div className="flex h-5 w-20 flex-1 flex-col items-center space-y-1">
          <div className="h-1 w-full rounded bg-muted-foreground/20" />
          <div className="h-1 w-5/6 rounded bg-muted-foreground/20" />
        </div>
        {/* Closing quote mark */}
        <div className="font-serif text-2xl leading-none text-muted-foreground/30">
          "
        </div>
      </div>
    </div>
  );
}

export function SideQuoteWithIconPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-3">
      <div className="w-full rounded-r border-l-4 border-muted-foreground/40 bg-muted/30 py-2 pl-3">
        {/* Quote icon */}
        <div className="mb-1 font-serif text-xs text-muted-foreground/50">
          "
        </div>
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-muted-foreground/20 italic" />
          <div className="h-1 w-5/6 rounded bg-muted-foreground/20" />
          <div className="h-1 w-4/5 rounded bg-muted-foreground/20" />
        </div>
        <div className="mt-2 h-0.5 w-1/4 rounded bg-muted" />
      </div>
    </div>
  );
}

export function SimpleSideQuotePreview() {
  return (
    <div className="flex h-full w-full items-center justify-center p-3">
      <div className="w-full border-l-4 border-muted-foreground/40 py-1 pl-3">
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-muted-foreground/20" />
          <div className="h-1 w-5/6 rounded bg-muted-foreground/20" />
        </div>
        <div className="mt-2 h-0.5 w-1/4 rounded bg-muted" />
      </div>
    </div>
  );
}
