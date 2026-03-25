"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import { Tweet } from "react-tweet";

import { type TMediaEmbedElement } from "platejs";
import { type PlateElementProps } from "platejs/react";

// Extended properties for media embed elements
interface MediaEmbedProps {
  provider?: string;
  url?: string;
  id?: string;
}

import { MediaEmbedPlugin } from "@platejs/media/react";
import { ResizableProvider, useResizableValue } from "@platejs/resizable";
import {
  PlateElement,
  useElement,
  useFocused,
  useReadOnly,
  useSelected,
  withHOC,
} from "platejs/react";

import { cn } from "@/lib/utils";

import { Caption, CaptionTextarea } from "./caption";
import { MediaEmbedPlaceholder } from "./media-embed-placeholder";
import { extractEmbedId, generateEmbedUrl } from "./media-embeds";
import { MediaToolbar } from "./media-toolbar";
import {
  mediaResizeHandleVariants,
  Resizable,
  ResizeHandle,
} from "./resize-handle";

export const MediaEmbedElement = withHOC(
  ResizableProvider,
  function MediaEmbedElement(props: PlateElementProps<TMediaEmbedElement>) {
    const element = useElement<TMediaEmbedElement>();
    const focused = useFocused();
    const selected = useSelected();
    const readOnly = useReadOnly();
    const width = useResizableValue("width");

    // Get properties directly from element
    const align = (element.align as "center" | "left" | "right") || "center";
    const elementWithProps = element as TMediaEmbedElement & MediaEmbedProps;
    const provider = elementWithProps.provider || "";
    const url = elementWithProps.url || "";
    const id = elementWithProps.id || "";

    // Determine embed type and if we should show placeholder
    const shouldShowPlaceholder = !url || url.trim() === "";
    const isTweet = provider === "twitter";
    const isVideo = provider && ["youtube", "vimeo", "loom"].includes(provider);
    const isYoutube = provider === "youtube";

    // Handle URL submission from placeholder
    const handleUrlSubmit = (inputUrl: string) => {
      // Convert URL to embed format using the existing logic
      const embedUrl = generateEmbedUrl(inputUrl, provider || "");
      const extractedId = extractEmbedId(inputUrl, provider || "");
      console.log("embedUrl", embedUrl);
      console.log("extractedId", extractedId);
      // Update the element with the converted URL and extracted ID
      const editor = props.editor;
      const path = props.path;
      if (editor && path) {
        // Update the entire element with the converted URL, provider, and ID
        editor.tf.setNodes(
          {
            ...element,
            url: embedUrl,
            provider: provider || "",
            id: extractedId || "",
          },
          { at: path },
        );
      }
    };

    return (
      <MediaToolbar plugin={MediaEmbedPlugin}>
        <PlateElement className="py-2.5" {...props}>
          <figure
            className="group relative m-0 w-full cursor-default"
            contentEditable={false}
          >
            <Resizable
              align={align}
              options={{
                align,
                maxWidth: isTweet ? 550 : "100%",
                minWidth: isTweet ? 300 : 100,
              }}
            >
              <ResizeHandle
                className={mediaResizeHandleVariants({ direction: "left" })}
                options={{ direction: "left" }}
              />

              {shouldShowPlaceholder ? (
                <MediaEmbedPlaceholder
                  embedType={provider || "youtube"}
                  onUrlSubmit={handleUrlSubmit}
                  className="w-full"
                />
              ) : isVideo ? (
                isYoutube ? (
                  <LiteYouTubeEmbed
                    id={id}
                    title="youtube"
                    wrapperClass={cn(
                      "rounded-sm",
                      focused && selected && "ring-2 ring-ring ring-offset-2",
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
                        focused && selected && "ring-2 ring-ring ring-offset-2",
                      )}
                      title="embed"
                      src={url}
                      allowFullScreen
                    />
                  </div>
                )
              ) : isTweet ? (
                <div
                  className={cn(
                    "[&_.react-tweet-theme]:my-0",
                    !readOnly &&
                      selected &&
                      "[&_.react-tweet-theme]:ring-2 [&_.react-tweet-theme]:ring-ring [&_.react-tweet-theme]:ring-offset-2",
                  )}
                >
                  <Tweet id={id} />
                </div>
              ) : provider === "image" ? (
                // Image embed - display as img with proper sizing
                // biome-ignore lint/performance/noImgElement: This is necessary to support different image URL formats
                <img
                  src={url}
                  alt="Embedded image"
                  className={cn(
                    "h-auto w-full rounded-sm object-contain",
                    focused && selected && "ring-2 ring-ring ring-offset-2",
                  )}
                />
              ) : (
                // Fallback for other embed types (figma, maps, codepen, website)
                <div className="relative w-full pb-[56.25%]">
                  <iframe
                    className={cn(
                      "absolute top-0 left-0 size-full rounded-sm border-0",
                      focused && selected && "ring-2 ring-ring ring-offset-2",
                    )}
                    title={`${provider || "embed"} embed`}
                    src={url}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              )}

              <ResizeHandle
                className={mediaResizeHandleVariants({ direction: "right" })}
                options={{ direction: "right" }}
              />
            </Resizable>

            <Caption style={{ width }} align={align}>
              <CaptionTextarea placeholder="Write a caption..." />
            </Caption>
          </figure>

          {props.children}
        </PlateElement>
      </MediaToolbar>
    );
  },
);
