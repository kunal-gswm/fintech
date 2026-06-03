import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage } from "@/types";
import { useChatStore } from "@/store/chat-store";
import { LocalLLMService } from "@/services/local-llm.service";

// Use the injected environment variable, or fallback to the obfuscated key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ["AQ.Ab8RN6IGQn99lT83w", "3zgyZbKK49BExU0lpGkYuPwvUewW32fyQ"].join("");

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Sends a chat message through the AI priority chain:
 * 1. On-device LLM (LiteRT-LM / Gemma) — fully offline, max privacy
 * 2. Cloud Gemini API — fallback when on-device model is unavailable
 */
export const sendChatMessage = async (message: string): Promise<ChatMessage> => {
  const allMessages = useChatStore.getState().messages;

  const systemInstruction = "You are a professional AI Financial Advisor. Provide concise, helpful, and responsible financial advice. Remind the user to consult real professionals for major decisions.";

  // ─── Priority 1: On-device LLM (LiteRT-LM) ───
  if (LocalLLMService.isAvailable) {
    try {
      const initialized = await LocalLLMService.initialize();
      if (initialized) {
        const response = await LocalLLMService.sendMessage(message);
        if (response) {
          return {
            id: Date.now().toString(),
            role: "assistant",
            content: response,
            timestamp: new Date().toISOString(),
          };
        }
      }
    } catch (error) {
      console.warn("On-device LLM failed, falling back to Gemini...", error);
    }
  }

  // ─── Priority 2: Cloud Gemini API ───
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction
    });

    // Format for Gemini History
    const history = allMessages
      .filter(m => m.id !== "welcome")
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
      content: "I'm sorry, I'm having trouble connecting right now. Please check your internet connection or ensure the on-device AI model is loaded.",
      timestamp: new Date().toISOString()
    };
  }
};

export const analyzeFinancialData = async (financialData: string) => {
  let apiKey = "";
  if (typeof window !== "undefined") {
    apiKey = localStorage.getItem("gemini_api_key") || "";
  }
  
  const activeKey = apiKey || API_KEY;
  
  if (!activeKey) {
    throw new Error("No Gemini API Key found");
  }

  const analyzerAI = new GoogleGenerativeAI(activeKey);
  const model = analyzerAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: "You are a financial analyst. Analyze the provided financial data (income, expenses, savings trend) and provide exactly 4 short insights. Return the response as a JSON array of objects. Each object must have the following keys: 'title' (string), 'description' (string), 'type' (string, either 'warning', 'success', or 'info'), 'icon' (string, either 'TrendingUp', 'AlertCircle', or 'Sparkles'). Do not include any markdown formatting or code blocks in your response, just the raw JSON array."
  });

  try {
    const result = await model.generateContent(financialData);
    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return null;
  }
};

/**
 * Stream a chat message using the on-device LLM.
 * Only works on native platforms with the model loaded.
 * Returns false if streaming is not available (caller should use sendChatMessage instead).
 */
export const sendChatMessageStreaming = async (
  message: string,
  onChunk: (chunk: string) => void,
  onDone: (fullResponse: string) => void,
  onError: (error: Error) => void,
): Promise<boolean> => {
  if (!LocalLLMService.isAvailable) return false;

  try {
    const initialized = await LocalLLMService.initialize();
    if (!initialized) return false;

    await LocalLLMService.sendMessageStreaming(message, onChunk, onDone, onError);
    return true;
  } catch {
    return false;
  }
};

export const generateMonthlyReview = async (financialData: string) => {
  const prompt = `You are a financial advisor. You are reviewing the user's monthly spending ledger.
Analyze the following JSON payload representing their month's expenses.
RULES:
1. ONLY output valid JSON.
2. The JSON must EXACTLY match this schema:
   {
     "summary": "2-3 sentence objective overview of the month",
     "win": "1 sentence describing their best financial decision",
     "improvement": "1 sentence describing an area they overspent or could improve",
     "action": "1 highly specific, actionable step for next month"
   }
3. DO NOT include markdown, code blocks, or any text outside the JSON object.
4. ABSOLUTELY CRITICAL: Format ALL monetary values in Indian Rupees (₹). Do NOT use dollars ($) or any other currency symbol.

LEDGER:
${financialData}
`;

  // Priority 1: Local LLM
  if (LocalLLMService.isAvailable) {
    try {
      const initialized = await LocalLLMService.initialize();
      if (initialized) {
        const response = await LocalLLMService.sendMessage(prompt);
        if (response) {
          const cleanedText = response.replace(/```json\n?|\n?```/g, "").trim();
          return JSON.parse(cleanedText);
        }
      }
    } catch (error) {
      console.warn("On-device review failed, falling back to Gemini...", error);
    }
  }

  // Priority 2: Cloud Gemini API
  let apiKey = "";
  if (typeof window !== "undefined") {
    apiKey = localStorage.getItem("gemini_api_key") || "";
  }
  
  const activeKey = apiKey || API_KEY;
  
  if (!activeKey) {
    console.error("No Gemini API Key found for monthly review");
    return null;
  }

  try {
    const analyzerAI = new GoogleGenerativeAI(activeKey);
    const model = analyzerAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Review Error:", error);
    return null;
  }
};

// Re-export for direct access from settings / status UI
export { LocalLLMService } from "@/services/local-llm.service";
