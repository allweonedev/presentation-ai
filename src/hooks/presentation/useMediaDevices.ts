"use client";

import { useEffect, useState } from "react";

export interface MediaDevice {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

export function useMediaDevices() {
  const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshDevices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Request permissions first to get device labels
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (err) {
        console.warn("Could not get permissions for device enumeration:", err);
      }

      const devices = await navigator.mediaDevices.enumerateDevices();

      const video = devices
        .filter((device) => device.kind === "videoinput")
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 8)}`,
          kind: device.kind,
        }));

      const audio = devices
        .filter((device) => device.kind === "audioinput")
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${device.deviceId.slice(0, 8)}`,
          kind: device.kind,
        }));

      console.log("Found video devices:", video);
      console.log("Found audio devices:", audio);
      setVideoDevices(video);
      setAudioDevices(audio);
    } catch (err) {
      console.error("Error enumerating devices:", err);
      setError("Failed to load devices");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDevices();

    // Listen for device changes
    const handleDeviceChange = () => {
      refreshDevices();
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange,
      );
    };
  }, []);

  return {
    videoDevices,
    audioDevices,
    isLoading,
    error,
    refreshDevices,
  };
}
