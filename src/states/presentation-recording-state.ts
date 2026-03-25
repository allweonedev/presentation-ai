"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
type NullableStream = MediaStream | null;

interface OverlayPosition {
  overlayX: number; // px relative to viewport left
  overlayY: number; // px relative to viewport top
}

interface PresentationRecordingState extends OverlayPosition {
  // UI flags
  wantsToRecord: boolean;
  isRecording: boolean;
  isStarting: boolean;
  isStopping: boolean;
  // device toggles
  webcamEnabled: boolean;
  micEnabled: boolean;

  // device selection
  selectedVideoDeviceId: string | null;
  selectedAudioDeviceId: string | null;

  // media + recorder
  camStream: NullableStream;
  micStream: NullableStream;
  composedStream: NullableStream; // canvas video + audio tracks
  blobUrl: string | null;

  // mutators
  setWantsToRecord: (b: boolean) => void;
  setWebcamEnabled: (v: boolean) => void;
  setMicEnabled: (v: boolean) => void;
  setSelectedVideoDevice: (id: string | null) => void;
  setSelectedAudioDevice: (id: string | null) => void;
  setOverlayPosition: (x: number, y: number) => void;

  setCamStream: (s: NullableStream) => void;
  setMicStream: (s: NullableStream) => void;
  setComposedStream: (s: NullableStream) => void;
  setBlobUrl: (url: string | null) => void;
  setIsStarting: (v: boolean) => void;
  setIsStopping: (v: boolean) => void;
  beginRecording: () => void;
  endRecording: () => void;
  reset: () => void;
}

export const usePresentationRecordingState =
  create<PresentationRecordingState>()(
    persist(
      (set, get) => ({
        // defaults
        wantsToRecord: false,
        isRecording: false,
        isStarting: false,
        isStopping: false,
        webcamEnabled: true,
        micEnabled: true,
        selectedVideoDeviceId: null,
        selectedAudioDeviceId: null,
        overlayX: 0,
        overlayY: 0,
        overlayWidth: 240,
        camStream: null,
        micStream: null,
        composedStream: null,
        blobUrl: null,

        setWantsToRecord: (b) =>
          set((state) => {
            if (!b) {
              state.reset();
            }

            return { wantsToRecord: b };
          }),
        setWebcamEnabled: (v) => set({ webcamEnabled: v }),
        setMicEnabled: (v) => set({ micEnabled: v }),
        setSelectedVideoDevice: (id) => set({ selectedVideoDeviceId: id }),
        setSelectedAudioDevice: (id) => set({ selectedAudioDeviceId: id }),
        setOverlayPosition: (x, y) => set({ overlayX: x, overlayY: y }),
        setCamStream: (s) => set({ camStream: s }),
        setMicStream: (s) => set({ micStream: s }),
        setComposedStream: (s) => set({ composedStream: s }),
        setBlobUrl: (url) => set({ blobUrl: url }),
        setIsStarting: (v) => set({ isStarting: v }),
        setIsStopping: (v) => set({ isStopping: v }),

        beginRecording: () => set({ isRecording: true }),
        endRecording: () => set({ isRecording: false }),

        reset: () => {
          const { camStream, micStream, composedStream, blobUrl } = get();
          camStream?.getTracks().forEach((t) => t.stop());
          micStream?.getTracks().forEach((t) => t.stop());
          composedStream?.getTracks().forEach((t) => t.stop());
          if (blobUrl) URL.revokeObjectURL(blobUrl);
          set({
            wantsToRecord: false,
            isRecording: false,
            isStarting: false,
            isStopping: false,
            camStream: null,
            micStream: null,
            composedStream: null,
            blobUrl: null,
          });
        },
      }),
      {
        name: "presentation-recording-state-storage",
        partialize: (state) => ({
          webcamEnabled: state.webcamEnabled,
          micEnabled: state.micEnabled,
          selectedVideoDeviceId: state.selectedVideoDeviceId,
          selectedAudioDeviceId: state.selectedAudioDeviceId,
          overlayX: state.overlayX,
          overlayY: state.overlayY,
        }),
      },
    ),
  );
