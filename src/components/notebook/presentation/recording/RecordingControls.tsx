"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMediaDevices } from "@/hooks/presentation/useMediaDevices";
import { useRecording } from "@/hooks/presentation/useRecording";
import { cn } from "@/lib/utils";
import { usePresentationRecordingState } from "@/states/presentation-recording-state";
import { motion } from "motion/react";
import {
  Check,
  ChevronDown,
  Loader2,
  Mic,
  MicOff,
  Square,
  Video,
  VideoOff,
} from "lucide-react";

export function RecordingControls() {
  const {
    isRecording,
    isStarting,
    isStopping,
    webcamEnabled,
    micEnabled,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    setWebcamEnabled,
    setMicEnabled,
    setSelectedVideoDevice,
    setSelectedAudioDevice,
  } = usePresentationRecordingState();

  const { start, stop } = useRecording();
  const { videoDevices, audioDevices, isLoading } = useMediaDevices();

  const isDeviceSelected = (
    deviceId: string,
    selectedId: string | null,
    devices: typeof videoDevices | typeof audioDevices,
  ) => {
    // If a device is explicitly selected, check if it matches
    if (selectedId) {
      return selectedId === deviceId;
    }
    // If no device is selected, mark the first device as default
    return devices.length > 0 && devices[0]?.deviceId === deviceId;
  };

  return (
    <TooltipProvider>
      <motion.div
        drag
        dragMomentum={false}
        className={cn(
          "fixed z-1000",
          "rounded-2xl border bg-background/95 backdrop-blur-md",
          "px-3 py-2.5 shadow-xl",
          "cursor-move select-none",
          "bottom-6 left-1/2 -translate-x-1/2",
        )}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-2">
          {/* Video ButtonGroup */}
          <ButtonGroup className="rounded-full">
            <Button
              size="sm"
              onClick={() => setWebcamEnabled(!webcamEnabled)}
              className={cn("h-9 w-9 p-0")}
            >
              {webcamEnabled ? (
                <Video className="h-4 w-4" />
              ) : (
                <VideoOff className="h-4 w-4 text-red-500" />
              )}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  className="h-9 w-8 p-0"
                  aria-label="Select camera"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="center"
                className="z-9999 w-64 rounded-xl border p-0 shadow-lg"
                side="top"
                sideOffset={12}
              >
                <div className="border-b bg-muted/50 px-3 py-2.5">
                  <div className="text-xs font-semibold text-foreground">
                    Camera
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {isLoading ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                      Loading devices...
                    </div>
                  ) : videoDevices.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                      No cameras found
                    </div>
                  ) : (
                    videoDevices.map((device) => (
                      <button
                        key={device.deviceId}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
                          "transition-colors hover:bg-accent",
                          "focus-visible:bg-accent focus-visible:outline-hidden",
                        )}
                        onClick={() => {
                          setSelectedVideoDevice(device.deviceId);
                        }}
                      >
                        <span className="flex-1 truncate text-foreground">
                          {device.label}
                        </span>
                        {isDeviceSelected(
                          device.deviceId,
                          selectedVideoDeviceId,
                          videoDevices,
                        ) && (
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </ButtonGroup>

          {/* Audio ButtonGroup */}
          <ButtonGroup>
            <Button
              size="sm"
              onClick={() => setMicEnabled(!micEnabled)}
              className={cn("h-9 w-9 p-0")}
            >
              {micEnabled ? (
                <Mic className="h-4 w-4" />
              ) : (
                <MicOff className="h-4 w-4 text-red-500" />
              )}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  className="h-9 w-8 p-0"
                  aria-label="Select microphone"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="center"
                className="z-9999 w-64 rounded-xl border p-0 shadow-lg"
                side="top"
                sideOffset={12}
              >
                <div className="border-b bg-muted/50 px-3 py-2.5">
                  <div className="text-xs font-semibold text-foreground">
                    Microphone
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {isLoading ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                      Loading devices...
                    </div>
                  ) : audioDevices.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                      No microphones found
                    </div>
                  ) : (
                    audioDevices.map((device) => (
                      <button
                        key={device.deviceId}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
                          "transition-colors hover:bg-accent",
                          "focus-visible:bg-accent focus-visible:outline-hidden",
                        )}
                        onClick={() => {
                          setSelectedAudioDevice(device.deviceId);
                        }}
                      >
                        <span className="flex-1 truncate text-foreground">
                          {device.label}
                        </span>
                        {isDeviceSelected(
                          device.deviceId,
                          selectedAudioDeviceId,
                          audioDevices,
                        ) && (
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </ButtonGroup>

          <div className="mx-1 h-5 w-px bg-border" />

          {isRecording ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => stop()}
              disabled={isStopping}
              className="h-9 gap-2 rounded-lg px-3"
            >
              {isStopping ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-xs font-medium">Stopping...</span>
                </>
              ) : (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span className="text-xs font-medium">Stop</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => start()}
              disabled={isStarting}
              className="h-9 gap-2 rounded-lg px-4"
            >
              {isStarting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span className="text-xs font-medium">Starting...</span>
                </>
              ) : (
                <>
                  <Video className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Start Recording</span>
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
}

export default RecordingControls;
