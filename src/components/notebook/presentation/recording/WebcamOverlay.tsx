"use client";

import { cn } from "@/lib/utils";
import { usePresentationRecordingState } from "@/states/presentation-recording-state";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export function WebcamOverlay() {
  const {
    wantsToRecord,
    webcamEnabled,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    setOverlayPosition,
    setCamStream,
  } = usePresentationRecordingState();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  console.log("WebcamOverlay", wantsToRecord, webcamEnabled);
  // Get camera stream when setup opens and webcam is enabled
  const getCameraStream = useCallback(async () => {
    if (!webcamEnabled || !wantsToRecord) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedVideoDeviceId
          ? { deviceId: { exact: selectedVideoDeviceId } }
          : true,

        audio: selectedAudioDeviceId
          ? { deviceId: { exact: selectedAudioDeviceId } }
          : true,
      });
      setLocalStream(stream);
      setCamStream(stream);
    } catch (err) {
      console.error("Failed to get camera stream:", err);
    }
  }, [
    webcamEnabled,
    wantsToRecord,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    setCamStream,
  ]);

  useEffect(() => {
    if (wantsToRecord && webcamEnabled) {
      getCameraStream();
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
    };
  }, [wantsToRecord, webcamEnabled, selectedVideoDeviceId, getCameraStream]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (localStream && webcamEnabled) {
      v.srcObject = localStream;
      v.muted = true;
      v.playsInline = true;
      v.play().catch(() => {});
    }
  }, [localStream, webcamEnabled]);

  if (!wantsToRecord || !webcamEnabled || !localStream) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{
        top: 0,
        left: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
      }}
      onDragEnd={(_, info) => {
        console.log(info.point);
        setOverlayPosition(
          Math.max(0, info.point.x),
          Math.max(0, info.point.y),
        );
      }}
      className={cn(
        "fixed z-999999 overflow-hidden rounded-xl border border-border shadow-xs",
        "aspect-video w-80 bg-background/50 backdrop-blur-sm supports-backdrop-filter:bg-background/40",
      )}
    >
      <video
        ref={videoRef}
        className="presentation-webcam-overlay block h-auto w-full"
      />
    </motion.div>
  );
}

export default WebcamOverlay;
