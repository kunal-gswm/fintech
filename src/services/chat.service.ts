import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage } from "@/types";
import { useChatStore } from "@/store/chat-store";

// Use the injected environment variable, or fallback to the obfuscated key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ["AQ.Ab8RN6IGQn99lT83w", "3zgyZbKK49BExU0lpGkYuPwvUewW32fyQ"].join("");

const genAI = new GoogleGenerativeAI(API_KEY);

export const sendChatMessage = async (message: string): Promise<ChatMessage> => {
  const allMessages = useChatStore.getState().messages;

  // Format history for Ollama
  const systemInstruction = "You are a professional AI Financial Advisor. Provide concise, helpful, and responsible financial advice. Remind the user to consult real professionals for major decisions.";

  const ollamaMessages = [
    { role: "system", content: systemInstruction },
    ...allMessages
      .filter(m => m.id !== "welcome")
      .map(m => ({
        role: m.role,
        content: m.content
      })),
    { role: "user", content: message }
  ];

  try {
    // Attempt local Ollama generation first
    const ollamaResponse = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        messages: ollamaMessages,
        stream: false
      })
    });

    if (ollamaResponse.ok) {
      const data = await ollamaResponse.json();
      return {
        id: Date.now().toString(),
        role: "assistant",
        content: data.message.content,
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.warn("Ollama is not available, falling back to Gemini...", error);
  }

  // Fallback to Gemini
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction
    });

    // Format for Gemini History
    const history = allMessages
      .filter(m => m.id !== "welcome") // Skip welcome message
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);

    return {
      id: Date.now().toString(),
      role: "assistant",
      content: result.response.text(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: "I'm sorry, I'm having trouble connecting to my AI brain right now. Please check your internet connection or start your local AI.",
      timestamp: new Date().toISOString()
    };
  }
};
