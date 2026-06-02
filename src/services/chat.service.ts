import { apiClient } from "@/lib/api-client";
import type { ChatMessage } from "@/types";

export const sendChatMessage = (message: string) => {
  return apiClient<ChatMessage>("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
    timeout: 60000, // Allow 60s for LLM generation
  });
};
