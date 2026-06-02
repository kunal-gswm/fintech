import { create } from "zustand";
import type { ChatMessage } from "@/types";
import { sendChatMessage } from "@/services/chat.service";

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  addMessage: (message: ChatMessage) => void;
  sendMessage: (content: string) => Promise<void>;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm your AI financial advisor. How can I help you today?",
  timestamp: new Date().toISOString(),
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [welcomeMessage],
  isTyping: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  sendMessage: async (content) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, userMsg], isTyping: true }));
    try {
      const aiResponse = await sendChatMessage(content);
      set((state) => ({ messages: [...state.messages, aiResponse] }));
    } catch (e) {
      console.error("Chat error:", e);
    } finally {
      set({ isTyping: false });
    }
  },
  setTyping: (typing) => set({ isTyping: typing }),
  clearMessages: () =>
    set({
      messages: [welcomeMessage],
    }),
}));
