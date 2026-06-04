import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import type { ChatMessage } from "@/types";
import { sendChatMessage, sendChatMessageStreaming } from "@/services/chat.service";

const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  streamingContent: string;
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

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [welcomeMessage],
      isTyping: false,
      streamingContent: "",
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      sendMessage: async (content) => {
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: "user",
          content,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ messages: [...state.messages, userMsg], isTyping: true, streamingContent: "" }));

        // Try streaming first (on-device LLM)
        const streamed = await sendChatMessageStreaming(
          content,
          // onChunk — update streaming content live
          (chunk) => {
            set((state) => ({ streamingContent: state.streamingContent + chunk }));
          },
          // onDone — commit the full response as a message
          (fullResponse) => {
            const aiMsg: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: fullResponse,
              timestamp: new Date().toISOString(),
            };
            set((state) => ({
              messages: [...state.messages, aiMsg],
              isTyping: false,
              streamingContent: "",
            }));
          },
          // onError — fall through to non-streaming
          (error) => {
            console.warn("Streaming failed, will fall back:", error);
          },
        );

        // If streaming was used successfully, we're done
        if (streamed) return;

        // Fallback: non-streaming (Gemini)
        try {
          const aiResponse = await sendChatMessage(content);
          set((state) => ({ messages: [...state.messages, aiResponse] }));
        } catch (e) {
          console.error("Chat error:", e);
        } finally {
          set({ isTyping: false, streamingContent: "" });
        }
      },
      setTyping: (typing) => set({ isTyping: typing }),
      clearMessages: () =>
        set({
          messages: [welcomeMessage],
          streamingContent: "",
        }),
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => idbStorage),
    }
  )
);

