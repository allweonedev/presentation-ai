"use client";

import { useState, type ImgHTMLAttributes } from "react";

interface ImageWithFallbackProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "onError"
> {
  src: string;
  fallbackSrc?: string;
  fallbackElement?: React.ReactNode;
}

/**
 * An image component that tries the primary src first, then falls back to fallbackSrc if it fails.
 * If both fail (or no fallbackSrc is provided), it renders the fallbackElement.
 */
export function ImageWithFallback({
  src,
  fallbackSrc,
  fallbackElement,
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  const handleError = () => {
    if (!triedFallback && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setTriedFallback(true);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return fallbackElement ?? null;
  }

  return (
    /* biome-ignore lint/performance/noImgElement: Intentionally using img for external URLs with fallback mechanism */
    <img src={currentSrc} alt={alt} onError={handleError} {...props} />
  );
}

/**
 * Generates the alternative extension URL for an image.
 * If the image ends with .png, returns .jpg version and vice versa.
 * Handles URLs with query parameters.
 */
export function getAlternateImageUrl(imageUrl: string): string {
  // Remove query parameters for extension check, but preserve them
  const parts = imageUrl.split("?");
  const baseUrl = parts[0];
  const queryParams = parts[1];

  if (!baseUrl) {
    return "";
  }

  if (baseUrl.endsWith(".png")) {
    const newBase = `${baseUrl.slice(0, -4)}.jpg`;
    return queryParams ? `${newBase}?${queryParams}` : newBase;
  }

  if (baseUrl.endsWith(".jpg") || baseUrl.endsWith(".jpeg")) {
    const extension = baseUrl.endsWith(".jpeg") ? ".jpeg" : ".jpg";
    const newBase = `${baseUrl.slice(0, -extension.length)}.png`;
    return queryParams ? `${newBase}?${queryParams}` : newBase;
  }

  // If no known extension, return empty string
  return "";
}
