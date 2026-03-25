"use client";

import {
  extractYouTubeVideoId,
  generateEmbedUrl,
  getEmbedConfig,
} from "@/components/plate/ui/media-embeds";
import { cn } from "@/lib/utils";
import { useState } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";

interface EmbedRendererProps {
  embedType: string;
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

export function EmbedRenderer({
  embedType,
  url,
  className,
  style,
}: EmbedRendererProps) {
  const [hasError, setHasError] = useState(false);
  const config = getEmbedConfig(embedType);

  if (!config) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted/30 p-4",
          className,
        )}
        style={style}
      >
        <p className="text-sm text-muted-foreground">
          Unsupported embed type: {embedType}
        </p>
      </div>
    );
  }

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted/30 p-4",
          className,
        )}
        style={style}
      >
        <div className="text-center">
          <p className="mb-2 text-sm text-muted-foreground">
            Failed to load embed
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Open {config.name} link
          </a>
        </div>
      </div>
    );
  }

  if (embedType === "image") {
    const embedUrl = generateEmbedUrl(url, embedType);
    return (
      // biome-ignore lint/performance/noImgElement: This is necessary to support image embeds
      <img
        src={embedUrl}
        alt={config.name}
        className={cn("h-full w-full object-contain", className)}
        style={style}
        onError={handleError}
      />
    );
  }

  // Specia handling for YouTube using LiteYouTubeEmbed
  if (embedType === "youtube") {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return (
        <div
          className={cn(
            "flex items-center justify-center bg-muted/30 p-4",
            className,
          )}
          style={style}
        >
          <p className="text-sm text-muted-foreground">Invalid YouTube URL</p>
        </div>
      );
    }

    return (
      <div
        className={cn("relative overflow-hidden rounded-md", className)}
        style={style}
      >
        <LiteYouTubeEmbed
          id={videoId}
          title="youtube"
          wrapperClass={cn(
            "absolute! inset-0! h-full! w-full!",
            "cursor-pointer bg-black bg-cover bg-center",
            "[&.lyt-activated]:before:absolute [&.lyt-activated]:before:top-0 [&.lyt-activated]:before:h-[60px] [&.lyt-activated]:before:w-full [&.lyt-activated]:before:bg-top [&.lyt-activated]:before:bg-repeat-x [&.lyt-activated]:before:pb-[50px] [&.lyt-activated]:before:[transition:all_0.2s_cubic-bezier(0,0,0.2,1)]",
            "[&.lyt-activated]:before:bg-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==)]",
            "[&_>_iframe]:absolute [&_>_iframe]:top-0 [&_>_iframe]:left-0 [&_>_iframe]:size-full",
            "[&_>_.lty-playbtn]:z-1 [&_>_.lty-playbtn]:h-[46px] [&_>_.lty-playbtn]:w-[70px] [&_>_.lty-playbtn]:rounded-[14%] [&_>_.lty-playbtn]:bg-[#212121] [&_>_.lty-playbtn]:opacity-80 [&_>_.lty-playbtn]:[transition:all_0.2s_cubic-bezier(0,0,0.2,1)]",
            "[&:hover_>_.lty-playbtn]:bg-[red] [&:hover_>_.lty-playbtn]:opacity-100",
            '[&_>_.lty-playbtn]:before:border-y-11 [&_>_.lty-playbtn]:before:border-r-0 [&_>_.lty-playbtn]:before:border-l-19 [&_>_.lty-playbtn]:before:border-[transparent_transparent_transparent_#fff] [&_>_.lty-playbtn]:before:content-[""]',
            "[&_>_.lty-playbtn]:absolute [&_>_.lty-playbtn]:top-1/2 [&_>_.lty-playbtn]:left-1/2 [&_>_.lty-playbtn]:transform-[translate3d(-50%,-50%,0)]",
            "[&_>_.lty-playbtn]:before:absolute [&_>_.lty-playbtn]:before:top-1/2 [&_>_.lty-playbtn]:before:left-1/2 [&_>_.lty-playbtn]:before:transform-[translate3d(-50%,-50%,0)]",
            "[&.lyt-activated]:cursor-[unset]",
            "[&.lyt-activated]:before:pointer-events-none [&.lyt-activated]:before:opacity-0",
            "[&.lyt-activated_>_.lty-playbtn]:pointer-events-none [&.lyt-activated_>_.lty-playbtn]:opacity-0!",
          )}
        />
      </div>
    );
  }

  // For other embed types, use regular iframe
  const embedUrl = generateEmbedUrl(url, embedType);

  return (
    <iframe
      src={embedUrl}
      className={cn("h-full w-full border-0", className)}
      style={style}
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      onError={handleError}
      title={`${config.name} embed`}
    />
  );
}
