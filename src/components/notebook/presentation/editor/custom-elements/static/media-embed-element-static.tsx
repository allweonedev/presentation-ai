import type * as React from "react";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import { Tweet } from "react-tweet";

import { type TMediaEmbedElement } from "platejs";
import { SlateElement, type SlateElementProps } from "platejs/static";

import { embedTypeConfig } from "@/components/plate/ui/media-embeds";
import { cn } from "@/lib/utils";
import { Video } from "lucide-react";

// Extended properties for media embed elements
interface MediaEmbedProps {
  provider?: string;
  url?: string;
  id?: string;
  align?: "center" | "left" | "right";
}

// Static placeholder for media embed (no interactivity)
function MediaEmbedPlaceholderStatic({
  embedType,
  className,
}: {
  embedType: string;
  className?: string;
}) {
  const config =
    embedTypeConfig[embedType as keyof typeof embedTypeConfig] ||
    embedTypeConfig.youtube;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg border-2 border-dashed",
        className,
      )}
    >
      <div className="relative flex min-h-[200px] flex-col items-center justify-center space-y-4 p-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30 text-3xl shadow-xs">
            {config?.icon || <Video className="h-8 w-8" />}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-muted-foreground">
              {config?.name || "Media Embed"}
            </h3>
            <p className="text-sm text-muted-foreground">No URL provided</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Static renderer for media embed element
export function MediaEmbedElementStatic(
  props: SlateElementProps<TMediaEmbedElement & MediaEmbedProps>,
) {
  const element = props.element;

  const align = element.align || "center";
  const provider = element.provider || "";
  const url = element.url || "";
  const id = element.id || "";

  // Determine embed type and if we should show placeholder
  const shouldShowPlaceholder = !url || url.trim() === "";
  const isTweet = provider === "twitter";
  const isVideo = provider && ["youtube", "vimeo", "loom"].includes(provider);
  const isYoutube = provider === "youtube";

  const containerStyles: React.CSSProperties = {
    display: "flex",
    justifyContent:
      align === "left"
        ? "flex-start"
        : align === "right"
          ? "flex-end"
          : "center",
  };

  return (
    <SlateElement {...props} className={cn("py-2.5", props.className)}>
      <figure
        className="group relative m-0 w-full cursor-default"
        contentEditable={false}
      >
        <div style={containerStyles}>
          <div className="w-full max-w-full">
            {shouldShowPlaceholder ? (
              <MediaEmbedPlaceholderStatic
                embedType={provider || "youtube"}
                className="w-full"
              />
            ) : isVideo ? (
              isYoutube ? (
                <LiteYouTubeEmbed
                  id={id}
                  title="youtube"
                  wrapperClass={cn(
                    "rounded-sm",
                    "relative block cursor-pointer bg-black bg-cover bg-center contain-content",
                    "[&.lyt-activated]:before:absolute [&.lyt-activated]:before:top-0 [&.lyt-activated]:before:h-[60px] [&.lyt-activated]:before:w-full [&.lyt-activated]:before:bg-top [&.lyt-activated]:before:bg-repeat-x [&.lyt-activated]:before:pb-[50px] [&.lyt-activated]:before:[transition:all_0.2s_cubic-bezier(0,0,0.2,1)]",
                    "[&.lyt-activated]:before:bg-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==)]",
                    'after:block after:pb-(--aspect-ratio) after:content-[""]',
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
              ) : (
                <div
                  className={cn(
                    provider === "vimeo" && "pb-[75%]",
                    provider === "youku" && "pb-[56.25%]",
                    provider === "dailymotion" && "pb-[56.0417%]",
                    provider === "coub" && "pb-[51.25%]",
                  )}
                >
                  <iframe
                    className={cn(
                      "absolute top-0 left-0 size-full rounded-sm",
                      isVideo && "border-0",
                    )}
                    title="embed"
                    src={url}
                    allowFullScreen
                  />
                </div>
              )
            ) : isTweet ? (
              <div className="[&_.react-tweet-theme]:my-0">
                <Tweet id={id} />
              </div>
            ) : provider === "image" ? (
              // Image embed - display as img with proper sizing
              // biome-ignore lint/performance/noImgElement: This is necessary to support different image URL formats
              <img
                src={url}
                alt="Embedded image"
                className="h-auto w-full rounded-sm object-contain"
              />
            ) : (
              // Fallback for other embed types (figma, maps, codepen, website)
              <div className="relative w-full pb-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 size-full rounded-sm border-0"
                  title={`${provider || "embed"} embed`}
                  src={url}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}
          </div>
        </div>
      </figure>
      {props.children}
    </SlateElement>
  );
}


