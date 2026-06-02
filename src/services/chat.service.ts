import { apiClient } from "@/lib/api-client";
import type { ChatMessage } from "@/types";

export const sendChatMessage = (message: string) => {
  return apiClient<ChatMessage>("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
};
