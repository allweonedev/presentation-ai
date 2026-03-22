import { usePresentationRecordingState } from "@/states/presentation-recording-state";
import { usePresentationState } from "@/states/presentation-state";
import { toPng } from "html-to-image";
import { startTransition, useCallback, useEffect, useRef } from "react";

export function useRecording() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef(false);
  const lastSlideImageRef = useRef<string | null>(null);
  const slideDimensionsRef = useRef<{ width: number; height: number } | null>(
    null,
  );

  const overlayX = usePresentationRecordingState((s) => s.overlayX);
  const overlayY = usePresentationRecordingState((s) => s.overlayY);

  const beginRecording = usePresentationRecordingState((s) => s.beginRecording);
  const endRecording = usePresentationRecordingState((s) => s.endRecording);
  const setIsStarting = usePresentationRecordingState((s) => s.setIsStarting);
  const setIsStopping = usePresentationRecordingState((s) => s.setIsStopping);
  const setBlobUrl = usePresentationRecordingState((s) => s.setBlobUrl);
  const currentSlideId = usePresentationState((s) => s.currentSlideId);
  /* slides unused */

  const camStream = usePresentationRecordingState((s) => s.camStream);
  // Fixed canvas dimensions
  const CANVAS_WIDTH = 1920;
  const CANVAS_HEIGHT = 1080;

  // Initialize canvas and video element
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas") as HTMLCanvasElement;
      canvasRef.current.width = CANVAS_WIDTH;
      canvasRef.current.height = CANVAS_HEIGHT;
    }

    if (!videoElementRef.current) {
      videoElementRef.current = document.querySelector(
        ".presentation-webcam-overlay",
      ) as HTMLVideoElement;
    }
  }, []);

  // Calculate fitted dimensions for letterboxing
  const calculateFittedDimensions = useCallback(
    (srcWidth: number, srcHeight: number) => {
      const canvasAspect = CANVAS_WIDTH / CANVAS_HEIGHT;
      const srcAspect = srcWidth / srcHeight;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (srcAspect > canvasAspect) {
        // Source is wider - fit to width
        drawWidth = CANVAS_WIDTH;
        drawHeight = CANVAS_WIDTH / srcAspect;
        offsetX = 0;
        offsetY = (CANVAS_HEIGHT - drawHeight) / 2;
      } else {
        // Source is taller - fit to height
        drawHeight = CANVAS_HEIGHT;
        drawWidth = CANVAS_HEIGHT * srcAspect;
        offsetX = (CANVAS_WIDTH - drawWidth) / 2;
        offsetY = 0;
      }

      return { drawWidth, drawHeight, offsetX, offsetY };
    },
    [],
  );

  // Capture content element to canvas
  const captureContentToCanvas = useCallback(async () => {
    if (!canvasRef.current) return;

    await document.fonts.ready;
    if (!currentSlideId) return;

    const contentElement = document.querySelector(
      `.slide-container-${currentSlideId}`,
    ) as HTMLElement;

    if (!contentElement) return;

    // Get actual slide dimensions
    const rect = contentElement.getBoundingClientRect();
    slideDimensionsRef.current = {
      width: rect.width,
      height: rect.height,
    };

    try {
      const options = {
        quality: 1,
        pixelRatio: 2,
        skipAutoScale: false,
        cacheBust: true,
        filter: (node: HTMLElement) => {
          if (node.tagName === "use") return false;
          if (node.tagName === "IFRAME") return false;
          if (node.tagName === "VIDEO") return false;
          return true;
        },
      };

      try {
        const screenshot = await toPng(contentElement, {
          ...options,
          onImageErrorHandler: (error) => {
            console.error("Error capturing image:", error);
          },
        });

        lastSlideImageRef.current = screenshot;
      } catch (error) {
        console.error("Error converting html to PNG:", error);
      }
    } catch (error) {
      console.error("Error capturing content:", error);
    }
  }, [currentSlideId]);

  // Draw video overlay on canvas with rounded corners
  const drawVideoOverlay = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!videoElementRef.current) return;
      const video = videoElementRef.current;
      const rect = video.getBoundingClientRect();
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        const width = 320;
        const height = 180;
        const x = rect.left;
        const y = rect.top;
        const radius = 12;

        // Calculate aspect ratios for object-fit: cover behavior
        const videoAspect = video.videoWidth / video.videoHeight;
        const targetAspect = width / height;

        let sx = 0,
          sy = 0,
          sWidth = video.videoWidth,
          sHeight = video.videoHeight;

        if (videoAspect > targetAspect) {
          // Video is wider - crop sides
          sWidth = video.videoHeight * targetAspect;
          sx = (video.videoWidth - sWidth) / 2;
        } else {
          // Video is taller - crop top/bottom
          sHeight = video.videoWidth / targetAspect;
          sy = (video.videoHeight - sHeight) / 2;
        }

        ctx.save();
        // Create rounded rectangle clipping path
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radius,
          y + height,
        );
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();

        // Draw cropped video using 9-parameter drawImage
        ctx.drawImage(video, sx, sy, sWidth, sHeight, x, y, width, height);

        ctx.restore();
        // Draw border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radius,
          y + height,
        );
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.stroke();
      }
    },
    [overlayX, overlayY],
  );
  // Animation loop - composite slide + video overlay with letterboxing
  const renderLoop = useCallback(() => {
    if (!isRecordingRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Fill entire canvas with black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw the last captured slide image with letterboxing
    if (lastSlideImageRef.current && slideDimensionsRef.current) {
      const image = new Image();
      image.src = lastSlideImageRef.current;

      // Calculate fitted dimensions
      const { drawWidth, drawHeight, offsetX, offsetY } =
        calculateFittedDimensions(
          slideDimensionsRef.current.width,
          slideDimensionsRef.current.height,
        );

      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

      // Draw video overlay on top with proper positioning
      drawVideoOverlay(ctx);
    }

    // Continue loop
    animationFrameRef.current = requestAnimationFrame(renderLoop);
  }, [drawVideoOverlay, calculateFittedDimensions]);

  // Update slide content when slide changes
  useEffect(() => {
    if (isRecordingRef.current) {
      startTransition(() => {
        captureContentToCanvas();
      });
    }
  }, [currentSlideId, captureContentToCanvas]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (isRecordingRef.current) return;
    setIsStarting(true);
    initializeCanvas();

    // Capture initial content
    await captureContentToCanvas();

    // Wait for video to be ready
    if (videoElementRef.current) {
      await videoElementRef.current.play().catch(console.error);
    }

    // Get canvas stream
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasStream = canvas.captureStream(30);

    // We only mark recording begun after stream capture is ready
    isRecordingRef.current = true;
    renderLoop();
    beginRecording();

    // Add audio track if available
    if (camStream) {
      const audioTracks = camStream.getAudioTracks();
      if (audioTracks.length > 0) {
        canvasStream.addTrack(audioTracks[0]!);
      }
    }

    // Create MediaRecorder
    const mediaRecorder = new MediaRecorder(canvasStream, {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: 2500000,
    });

    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsStarting(false);

    return true;
  }, [
    beginRecording,
    initializeCanvas,
    captureContentToCanvas,
    renderLoop,
    camStream,
    setIsStarting,
  ]);

  // Stop recording
  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      setIsStopping(true);
      if (!isRecordingRef.current || !mediaRecorderRef.current) {
        endRecording();
        setIsStopping(false);
        resolve(null);
        return;
      }

      isRecordingRef.current = false;

      // Stop animation loop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Stop media recorder
      const mediaRecorder = mediaRecorderRef.current;

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        chunksRef.current = [];
        setBlobUrl(URL.createObjectURL(blob));
        endRecording();
        setIsStopping(false);
        resolve(blob);
      };

      // Give a short grace period to flush final frames before stopping
      // and ensure all tracks are ended after stop to avoid early cutoff
      try {
        mediaRecorder.requestData?.();
      } catch {}
      mediaRecorder.stop();
    });
  }, [endRecording, setBlobUrl, setIsStopping]);

  // Cleanup
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
    }

    isRecordingRef.current = false;
    lastSlideImageRef.current = null;
    slideDimensionsRef.current = null;
  }, []);

  return {
    start: startRecording,
    stop: stopRecording,
    cleanup,
  };
}
