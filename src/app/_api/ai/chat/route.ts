import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { chatRequestSchema } from "@/lib/validations";
import type { ChatMessage, Expense } from "@/types";

const CHAT_FILE = "chat-history.json";
const PROFILE_FILE = "profile.json";
const EXPENSES_FILE = "expenses.json";

const SYSTEM_INSTRUCTION = `
You are the AI Financial Advisor for "AI Finance".
Your goal is to provide educational guidance only.
You must NEVER:
- Recommend specific stocks to buy or sell.
- Predict stock prices or market movements.
- Guarantee returns on any investment.

You are allowed to:
- Explain what stocks, ETFs, mutual funds, and SIPs are.
- Explain budgeting rules (like 50/30/20).
- Analyze the user's provided spending habits and suggest optimizations.

Use the provided user context to personalize your responses, but maintain a professional, educational tone.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = chatRequestSchema.parse(body);

    // Read context data
    const profile = await readData(PROFILE_FILE).catch(() => ({}));
    const expenses = await readData<Expense[]>(EXPENSES_FILE).catch(() => [] as Expense[]);
    const history = await readData<ChatMessage[]>(CHAT_FILE).catch(() => [] as ChatMessage[]);

    // Save user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    history.push(userMessage);
    await writeData(CHAT_FILE, history);

    let aiResponseContent = "I'm sorry, I cannot process your request right now.";

    try {
      const promptContext = `
      User Profile Context:
      ${JSON.stringify(profile)}
      
      Recent Expenses Context:
      ${JSON.stringify(expenses.slice(0, 5))}
      
      User's Message: ${message}
      `;

      const ollamaResponse = await fetch("http://127.0.0.1:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2",
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            { role: "user", content: promptContext }
          ],
          stream: false,
        }),
      });

      if (ollamaResponse.ok) {
        const result = await ollamaResponse.json();
        aiResponseContent = result.message?.content || "No response generated.";
      } else {
        console.error("Ollama API Error:", ollamaResponse.statusText);
        aiResponseContent = "I encountered an error connecting to local AI. Is Ollama running with the llama3.2 model?";
      }
    } catch (ollamaError) {
      console.error("Ollama API Error:", ollamaError);
      aiResponseContent = "I encountered an error connecting to local AI. Please ensure Ollama is installed and running on port 11434.";
    }

    // Save AI response
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponseContent,
      timestamp: new Date().toISOString(),
    };
    history.push(aiMessage);
    await writeData(CHAT_FILE, history);

    return NextResponse.json(aiMessage);

  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const history = await readData(CHAT_FILE);
    return NextResponse.json(history);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}


