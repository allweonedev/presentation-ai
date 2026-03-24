"use client";

import { getPresentationMessages } from "@/app/_actions/presentation/getPresentationMessages";
import { serializeSlidesToXml } from "@/components/notebook/presentation/utils/slide-serializer";
import { AILoadingLabel } from "@/components/ui/ai-loading-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { executeToolCall } from "@/hooks/presentation/agentTools";
import { useClearPresentationChat } from "@/hooks/presentation/useClearPresentationChat";
import { useImageUpload } from "@/hooks/presentation/useImageUpload";
import {
  getToolInputArgs,
  getToolName,
  getToolState,
  isToolPart,
} from "@/lib/ai/uiMessageParts";
import { usePresentationState } from "@/states/presentation-state";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type FileUIPart } from "ai";
import { useQuery } from "@tanstack/react-query";
import { Bot, BrushCleaning, Loader2, Paperclip, Send, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import AIMessageComponent from "./AIMessage";
import HumanMessageComponent from "./HumanMessage";
import ToolMessageComponent from "./ToolMessage";

export function PresentationAgentPanel() {
  const currentPresentationId = usePresentationState(
    (state) => state.currentPresentationId,
  );
  const setActiveRightPanel = usePresentationState(
    (state) => state.setActiveRightPanel,
  );
  const pendingAgentMessage = usePresentationState(
    (state) => state.pendingAgentMessage,
  );
  const setPendingAgentMessage = usePresentationState(
    (state) => state.setPendingAgentMessage,
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/agent/presentation",
      }),
    [],
  );

  const {
    messages,
    sendMessage,
    setMessages,
    regenerate,
    status,
  } = useChat({
    id: currentPresentationId ?? undefined,
    transport,
  });

  const isStreaming = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;
  const { data, isLoading } = useQuery({
    queryKey: ["presentation-chat-messages", currentPresentationId],
    queryFn: () => getPresentationMessages(currentPresentationId as string),
    enabled: Boolean(currentPresentationId) && isEmpty,
  });
  const { clearChat: clearPresentationMessagesMutation, isPending } =
    useClearPresentationChat();
  const hasHydratedRef = useRef(false);
  const processedToolCallIdsRef = useRef<Set<string>>(new Set());
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasHydratedRef.current && data && isEmpty) {
      setMessages(data);
      hasHydratedRef.current = true;
    }
  }, [data, isEmpty, setMessages]);

  useEffect(() => {
    scrollTargetRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isStreaming]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== "assistant" || isStreaming) {
      return;
    }

    let nextToolPart:
      | (typeof lastMessage.parts)[number]
      | undefined;

    for (const part of lastMessage.parts) {
      if (
        isToolPart(part) &&
        getToolState(part) === "call" &&
        !processedToolCallIdsRef.current.has(part.toolCallId)
      ) {
        nextToolPart = part;
        break;
      }
    }

    if (!nextToolPart || !isToolPart(nextToolPart)) {
      return;
    }

    processedToolCallIdsRef.current.add(nextToolPart.toolCallId);

    void (async () => {
      try {
        const resumeMessage = await executeToolCall({
          name: getToolName(nextToolPart),
          args: getToolInputArgs(nextToolPart),
        });

        await regenerate({
          body: {
            resumeData: {
              messages: resumeMessage,
            },
          },
        });
      } catch (error) {
        processedToolCallIdsRef.current.delete(nextToolPart.toolCallId);
        console.error("Error executing tool call:", error);
      }
    })();
  }, [isStreaming, messages, regenerate]);

  const processedPendingRef = useRef<string | null>(null);

  useEffect(() => {
    if (pendingAgentMessage && !isStreaming && !isLoading && !isPending) {
      const messageKey = `${pendingAgentMessage.slideContext}:${pendingAgentMessage.message}`;

      if (processedPendingRef.current === messageKey) {
        return;
      }

      processedPendingRef.current = messageKey;

      const { message, slideContext } = pendingAgentMessage;
      setPendingAgentMessage(null);

      void sendMessage({
        text: `<slide-information>${slideContext}</slide-information>\n\n${message}`,
      });
    } else if (!pendingAgentMessage) {
      processedPendingRef.current = null;
    }
  }, [
    isLoading,
    isPending,
    isStreaming,
    pendingAgentMessage,
    sendMessage,
    setPendingAgentMessage,
  ]);

  const [input, setInput] = useState("");
  const {
    images,
    attachments,
    isImageUploading,
    previewImages,
    handleFileChange,
    handlePaste,
    removeImage,
    clearImages,
    MAX_IMAGES,
  } = useImageUpload();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      (!input.trim() && attachments.length === 0) ||
      isStreaming ||
      isLoading ||
      isPending
    ) {
      return;
    }

    const userMessage = input.trim();
    const attachmentsToSend = attachments.map((attachment) => ({
      id: attachment.id,
      url: attachment.url,
      type: attachment.type,
    }));

    setInput("");
    clearImages();

    const { slides } = usePresentationState.getState();
    const prompt = `<slide-information>${serializeSlidesToXml(slides)}</slide-information>\n\n${userMessage}`;
    const files: FileUIPart[] | undefined =
      attachmentsToSend.length > 0
        ? attachmentsToSend.map((attachment) => ({
            type: "file",
            url: attachment.url,
            filename: attachment.id,
            mediaType: attachment.type,
          }))
        : undefined;

    void sendMessage(files ? { text: prompt, files } : { text: prompt });
  };

  const handleClear = () => {
    if (!currentPresentationId) {
      return;
    }

    clearPresentationMessagesMutation(currentPresentationId);
    setMessages([]);
    processedToolCallIdsRef.current.clear();
  };

  return (
    <div className="flex h-full min-w-0 flex-col bg-background">
      <div className="flex items-center justify-between border-b p-3 backdrop-blur-xs supports-backdrop-filter:bg-background/60">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          <h2 className="text-sm font-semibold tracking-wide">Agent</h2>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 items-center gap-1 px-2 hover:bg-muted"
            disabled={isStreaming || isLoading || isPending}
          >
            {isLoading || isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BrushCleaning className="h-4 w-4" />
            )}
            Clear
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveRightPanel(null)}
            className="h-8 w-8 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="max-h-full flex-1 px-3 py-4">
        <div className="space-y-2">
          {messages.length === 0 ? (
            <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
              <div className="mb-2 font-medium text-foreground">
                Ask me to edit your presentation
              </div>
              <ul className="space-y-1 text-xs">
                <li>• Change the background to blue</li>
                <li>• Translate this deck to Spanish</li>
                <li>• Replace the hero image on slide 2</li>
              </ul>
            </div>
          ) : null}

          {messages.map((message, index) => {
            if (message.role === "user") {
              return <HumanMessageComponent message={message} key={message.id} />;
            }

            if (message.role === "assistant") {
              return (
                <div key={message.id}>
                  <AIMessageComponent
                    message={message}
                    isStreaming={isStreaming}
                    isLastMessage={index === messages.length - 1}
                  />
                  <ToolMessageComponent message={message} messages={messages} />
                </div>
              );
            }

            return null;
          })}

          {isStreaming &&
          messages.at(-1) &&
          (messages.at(-1)!.role === "user" ||
            !messages.at(-1)!.parts.some(
              (part) => part.type === "text" && part.text.trim().length > 0,
            )) ? (
            <div className="flex justify-start">
              <div className="rounded-lg bg-muted px-3 py-2">
                <AILoadingLabel
                  label="Thinking..."
                  icon={<Loader2 className="h-4 w-4 animate-spin" />}
                  textClassName="text-sm"
                />
              </div>
            </div>
          ) : null}

          <div ref={scrollTargetRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="space-y-2 border-t p-3">
        {previewImages.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {previewImages.map((image) => {
              const uploading =
                isImageUploading.find((item) => item.id === image.id)
                  ?.isLoading ?? false;

              return (
                <div key={image.id} className="relative h-16 w-16 shrink-0">
                  <Image
                    src={image.url}
                    fill
                    alt="Attached"
                    className="rounded-md border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    disabled={uploading}
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {uploading ? (
                    <div className="absolute inset-0 grid place-items-center rounded-md bg-black/50">
                      <Spinner className="h-4 w-4" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            asChild
            disabled={images.length >= MAX_IMAGES || isStreaming}
            className="rounded-xl"
          >
            <label htmlFor="presentation-agent-file-input" className="cursor-pointer">
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach image</span>
            </label>
          </Button>

          <input
            type="file"
            id="presentation-agent-file-input"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={images.length >= MAX_IMAGES || isStreaming}
          />

          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask me to edit..."
            onPaste={handlePaste}
            disabled={isStreaming}
            className="flex-1 rounded-xl"
          />

          <Button
            type="submit"
            size="icon"
            disabled={
              (!input.trim() && attachments.length === 0) ||
              isStreaming ||
              isLoading ||
              isPending
            }
            className="rounded-xl"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
