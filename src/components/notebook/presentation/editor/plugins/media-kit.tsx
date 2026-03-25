"use client";

import { CaptionPlugin } from "@platejs/caption/react";
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from "@platejs/media/react";
import { KEYS } from "platejs";

import { AudioElement } from "@/components/plate/ui/media-audio-node";
import { MediaEmbedElement } from "@/components/plate/ui/media-embed-node";
import { FileElement } from "@/components/plate/ui/media-file-node";
import { PlaceholderElement } from "@/components/plate/ui/media-placeholder-node";
import { MediaUploadToast } from "@/components/plate/ui/media-upload-toast";
import { VideoElement } from "@/components/plate/ui/media-video-node";
import { PresentationImageElement } from "../custom-elements/presentation-image-element";

export const MediaKit = [
  ImagePlugin.configure({
    options: { disableUploadInsert: true },
    render: {
      // afterEditable: MediaPreviewDialog,
      node: PresentationImageElement,
    },
  }),
  MediaEmbedPlugin.withComponent(MediaEmbedElement),
  VideoPlugin.withComponent(VideoElement),
  AudioPlugin.withComponent(AudioElement),
  FilePlugin.withComponent(FileElement),
  PlaceholderPlugin.configure({
    options: { disableEmptyPlaceholder: true },
    render: { afterEditable: MediaUploadToast, node: PlaceholderElement },
  }),
  CaptionPlugin.configure({
    options: {
      query: {
        allow: [KEYS.img, KEYS.video, KEYS.audio, KEYS.file, KEYS.mediaEmbed],
      },
    },
  }),
];
