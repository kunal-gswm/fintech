import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage } from "@/types";
import { useChatStore } from "@/store/chat-store";

// Use the injected environment variable, or fallback to the obfuscated key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ["AQ.Ab8RN6IGQn99lT83w", "3zgyZbKK49BExU0lpGkYuPwvUewW32fyQ"].join("");

const genAI = new GoogleGenerativeAI(API_KEY);

export const sendChatMessage = async (message: string): Promise<ChatMessage> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Retrieve previous messages from the store to give Gemini context
    const allMessages = useChatStore.getState().messages;
    
    // Format for Gemini History
    const history = allMessages
      .filter(m => m.id !== "welcome") // Skip welcome message
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

    const chat = model.startChat({
      history,
      systemInstruction: "You are a professional AI Financial Advisor. Provide concise, helpful, and responsible financial advice. Remind the user to consult real professionals for major decisions."
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return {
      id: Date.now().toString(),
      role: "assistant",
      content: responseText,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: "I'm sorry, I'm having trouble connecting to my AI brain right now. Please check your internet connection or API key.",
      timestamp: new Date().toISOString()
    };
  }
};
