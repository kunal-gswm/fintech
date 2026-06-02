import { create } from "zustand";
import type { ChatMessage } from "@/types";
import { mockChatMessages } from "@/lib/mock-data";

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: mockChatMessages,
  isTyping: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (typing) => set({ isTyping: typing }),
  clearMessages: () =>
    set({
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hello! I'm your AI financial advisor. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ],
    }),
}));
