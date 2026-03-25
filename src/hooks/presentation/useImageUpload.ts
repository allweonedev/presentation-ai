"use client";

import { useUploadThing } from "@/hooks/globals/useUploadthing";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";

export type PreviewImage = { id: string; file: File };
export type Attachment = { id: string; url: string; type: string };
export type IsImageUploading = { id: string; isLoading: boolean };
export type ImagePreview = { id: string; url: string };

const MAX_IMAGES = 3;

export function useImageUpload() {
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isImageUploading, setIsImageUploading] = useState<IsImageUploading[]>(
    [],
  );
  const [previewImages, setPreviewImages] = useState<ImagePreview[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  // Generate preview URLs when images change
  useEffect(() => {
    let active = true;
    const loadImages = async () => {
      const urls = await Promise.all(
        images.map(
          (image) =>
            new Promise<ImagePreview>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () =>
                resolve({ id: image.id, url: reader.result as string });
              reader.onerror = reject;
              reader.readAsDataURL(image.file);
            }),
        ),
      );
      if (active) {
        setPreviewImages(urls);
      }
    };
    void loadImages();
    return () => {
      active = false;
    };
  }, [images]);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const acceptedFiles = files.filter((f) => f.type.startsWith("image/"));
      if (acceptedFiles.length === 0) return;

      // Limit to MAX_IMAGES
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const filesToAdd = acceptedFiles.slice(0, remaining);

      const id = nanoid();
      const fileType = filesToAdd[0]?.type || "image/unknown";

      setImages((prev) => [
        ...prev,
        ...filesToAdd.map((file) => ({ id, file })),
      ]);
      setIsImageUploading((prev) => [...prev, { id, isLoading: true }]);

      try {
        const response = await startUpload(filesToAdd);
        const newAttachments =
          response?.map((image) => ({
            id,
            url: image.ufsUrl,
            type: fileType,
          })) ?? [];

        setIsImageUploading((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isLoading: false } : item,
          ),
        );
        setAttachments((prev) => [...prev, ...newAttachments]);
      } catch (error) {
        console.error("Upload failed", error);
        setIsImageUploading((prev) => prev.filter((item) => item.id !== id));
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    },
    [images.length, startUpload],
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      await handleFiles(Array.from(files));
      event.target.value = "";
    },
    [handleFiles],
  );

  const handlePaste = useCallback(
    async (event: React.ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (const item of items) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        event.preventDefault();
        await handleFiles(files);
      }
    },
    [handleFiles],
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setAttachments((prev) => prev.filter((att) => att.id !== id));
    setIsImageUploading((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setAttachments([]);
    setIsImageUploading([]);
    setPreviewImages([]);
  }, []);

  return {
    images,
    attachments,
    isImageUploading,
    previewImages,
    handleFileChange,
    handlePaste,
    removeImage,
    clearImages,
    MAX_IMAGES,
  };
}
