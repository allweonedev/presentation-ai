import { clearPresentationChat } from "@/app/_actions/notebook/presentation/clearPresentationChat";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useClearPresentationChat() {
  const { mutate: clearChatMutation, isPending } = useMutation({
    mutationFn: (presentationId: string) =>
      clearPresentationChat(presentationId),
    onError: () => {
      toast.error("Failed to clear presentation chat");
    },
  });
  return { clearChat: clearChatMutation, isPending };
}
