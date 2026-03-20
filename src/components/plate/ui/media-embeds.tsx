"use client";

import {
  Code,
  Figma,
  Image as ImageIcon,
  Link,
  MapPin,
  Play,
  Twitter,
  Video,
  Youtube,
} from "lucide-react";
import { KEYS, type TElement } from "platejs";

// NOTE: These are React components now!
import { type ReactElement } from "react";

export interface EmbedConfig {
  name: string;
  urlPattern: RegExp;
  embedUrlGenerator: (url: string) => string;
  icon?: string;
}

export type EmbedTypeConfigItem = {
  name: string;
  icon: ReactElement;
  description: string;
  placeholder: string;
  urlPattern: RegExp;
  embedUrlGenerator: (url: string) => string;
};

// Filtered EMBED_CONFIGS that only includes embed types defined in mediaEmbedItems
export const EMBED_CONFIGS: Record<string, EmbedConfig> = {
  youtube: {
    name: "YouTube",
    // Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/v/, youtube.com/shorts/
    urlPattern:
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
    embedUrlGenerator: (url: string) => {
      const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
      );
      const videoId = match?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    },
  },
  vimeo: {
    name: "Vimeo",
    // Supports: vimeo.com/123456, vimeo.com/video/123456, player.vimeo.com/video/123456
    urlPattern: /vimeo\.com\/(?:video\/)?(\d+)/i,
    embedUrlGenerator: (url: string) => {
      const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
      const videoId = match?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    },
  },
  loom: {
    name: "Loom",
    // Supports: loom.com/share/, loom.com/embed/
    urlPattern: /loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i,
    embedUrlGenerator: (url: string) => {
      const match = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
      const videoId = match?.[1];
      return videoId ? `https://www.loom.com/embed/${videoId}` : url;
    },
  },
  twitter: {
    name: "Twitter/X",
    // Supports both twitter.com and x.com
    urlPattern: /(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/i,
    embedUrlGenerator: (url: string) => {
      // Normalize to x.com format
      return url.replace("twitter.com", "x.com");
    },
  },
  figma: {
    name: "Figma",
    // Supports: figma.com/file/, figma.com/proto/, figma.com/design/
    urlPattern: /figma\.com\/(?:file|proto|design)\/([a-zA-Z0-9]+)/i,
    embedUrlGenerator: (url: string) => {
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
    },
  },
  maps: {
    name: "Google Maps",
    urlPattern: /google\.com\/maps/i,
    embedUrlGenerator: (url: string) => {
      // Extract coordinates or place info if available
      const placeMatch = url.match(/place\/([^/]+)/);
      const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

      if (placeMatch) {
        return `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(placeMatch[1] || "")}`;
      } else if (coordMatch) {
        return `https://www.google.com/maps/embed/v1/view?key=&center=${coordMatch[1]},${coordMatch[2]}&zoom=14`;
      }

      // Fallback: try to convert to embed format
      return url.replace("/maps/", "/maps/embed/");
    },
  },
  codepen: {
    name: "CodePen",
    urlPattern: /codepen\.io\/([^/]+)\/(?:pen|embed)\/([a-zA-Z0-9]+)/i,
    embedUrlGenerator: (url: string) => {
      const match = url.match(
        /codepen\.io\/([^/]+)\/(?:pen|embed)\/([a-zA-Z0-9]+)/i,
      );
      const username = match?.[1];
      const penId = match?.[2];
      return username && penId
        ? `https://codepen.io/${username}/embed/${penId}?default-tab=result`
        : url;
    },
  },
  website: {
    name: "Website",
    urlPattern: /^https?:\/\/.+/i,
    embedUrlGenerator: (url: string) => url,
  },
  image: {
    name: "Image",
    urlPattern: /^https?:\/\/.+/i,
    embedUrlGenerator: (url: string) => url,
  },
};

export type MediaEmbedItem = {
  key: string;
  label: string;
  embedType: string;
  icon: ReactElement;
  description: string;
};

export const mediaEmbedItems: MediaEmbedItem[] = [
  {
    key: "youtube",
    label: "YouTube",
    embedType: "youtube",
    icon: <Youtube className="h-7 w-7" />,
    description: "Embed YouTube videos",
  },
  {
    key: "vimeo",
    label: "Vimeo",
    embedType: "vimeo",
    icon: <Video className="h-7 w-7" />,
    description: "Embed Vimeo videos",
  },
  {
    key: "loom",
    label: "Loom",
    embedType: "loom",
    icon: <Play className="h-7 w-7" />,
    description: "Embed Loom recordings",
  },
  {
    key: "twitter",
    label: "Twitter",
    embedType: "twitter",
    icon: <Twitter className="h-7 w-7" />,
    description: "Embed Twitter posts",
  },
  {
    key: "figma",
    label: "Figma",
    embedType: "figma",
    icon: <Figma className="h-7 w-7" />,
    description: "Embed Figma designs",
  },
  {
    key: "maps",
    label: "Google Maps",
    embedType: "maps",
    icon: <MapPin className="h-7 w-7" />,
    description: "Embed Google Maps",
  },
  {
    key: "codepen",
    label: "CodePen",
    embedType: "codepen",
    icon: <Code className="h-7 w-7" />,
    description: "Embed CodePen demos",
  },
  {
    key: "image",
    label: "Image",
    embedType: "image",
    icon: <ImageIcon className="h-7 w-7" />,
    description: "Embed an image from a URL",
  },
  {
    key: "website",
    label: "Website",
    embedType: "website",
    icon: <Link className="h-7 w-7" />,
    description: "Embed any website link",
  },
];

export function createMediaEmbedNode(embedType: string): TElement {
  return {
    type: KEYS.mediaEmbed,
    url: "",
    provider: embedType,
    id: "",
    children: [{ text: "" }],
  } as TElement;
}

// Create embedTypeConfig that combines mediaEmbedItems with EMBED_CONFIGS
export const embedTypeConfig = mediaEmbedItems.reduce(
  (config, item) => {
    const embedConfig = EMBED_CONFIGS[item.embedType];
    if (embedConfig) {
      config[item.embedType] = {
        name: item.label,
        icon: item.icon,
        description: item.description,
        placeholder: `Enter ${item.label} URL...`,
        urlPattern: embedConfig.urlPattern,
        embedUrlGenerator: embedConfig.embedUrlGenerator,
      };
    }
    return config;
  },
  {} as Record<string, EmbedTypeConfigItem>,
);

// Utility functions for embed handling
export function detectEmbedType(url: string): string | null {
  for (const [type, config] of Object.entries(EMBED_CONFIGS)) {
    if (config.urlPattern.test(url)) {
      return type;
    }
  }
  return null;
}

export function generateEmbedUrl(url: string, embedType?: string): string {
  // Auto-detect if type not provided
  const type = embedType || detectEmbedType(url);
  if (!type) return url;

  const config = EMBED_CONFIGS[type];
  if (!config) return url;

  return config.embedUrlGenerator(url);
}

export function isValidEmbedUrl(url: string, embedType?: string): boolean {
  // Auto-detect if type not provided
  const type = embedType || detectEmbedType(url);
  if (!type) return false;

  const config = EMBED_CONFIGS[type];
  if (!config) return false;

  return config.urlPattern.test(url);
}

export function getEmbedConfig(embedType: string): EmbedConfig | null {
  return EMBED_CONFIGS[embedType] || null;
}

export function getAllEmbedTypes(): Array<{
  type: string;
  config: EmbedConfig;
}> {
  return Object.entries(EMBED_CONFIGS).map(([type, config]) => ({
    type,
    config,
  }));
}

export function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
  );
  return match?.[1] || null;
}

export function extractTwitterTweetId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/i);
  return match?.[2] || null;
}

export function extractLoomVideoId(url: string): string | null {
  const match = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
  return match?.[1] || null;
}

export function extractVimeoVideoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return match?.[1] || null;
}

export function extractCodePenId(url: string): string | null {
  const match = url.match(
    /codepen\.io\/([^/]+)\/(?:pen|embed)\/([a-zA-Z0-9]+)/i,
  );
  return match?.[2] || null;
}

export function extractEmbedId(url: string, embedType?: string): string | null {
  const type = embedType || detectEmbedType(url);
  if (!type) return null;

  switch (type) {
    case "youtube":
      return extractYouTubeVideoId(url);
    case "twitter":
      return extractTwitterTweetId(url);
    case "loom":
      return extractLoomVideoId(url);
    case "vimeo":
      return extractVimeoVideoId(url);
    case "codepen":
      return extractCodePenId(url);
    default:
      return null;
  }
}
