import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readData, writeData } from "@/lib/db";
import { chatRequestSchema } from "@/lib/validations";

const CHAT_FILE = "chat-history.json";
const PROFILE_FILE = "profile.json";
const EXPENSES_FILE = "expenses.json";

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

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
    const expenses = await readData(EXPENSES_FILE).catch(() => []);
    const history = await readData<any[]>(CHAT_FILE).catch(() => []);

    // Save user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    history.push(userMessage);
    await writeData(CHAT_FILE, history);

    let aiResponseContent = "I'm sorry, I cannot process your request right now.";

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Build context prompt
        const prompt = `
        ${SYSTEM_INSTRUCTION}
        
        User Profile Context:
        ${JSON.stringify(profile)}
        
        Recent Expenses Context:
        ${JSON.stringify(expenses.slice(0, 5))}
        
        User's Message: ${message}
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        aiResponseContent = response.text();
      } catch (geminiError) {
        console.error("Gemini API Error:", geminiError);
        aiResponseContent = "I encountered an error while trying to generate a response. Please check the API configuration.";
      }
    } else {
      aiResponseContent = "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.";
    }

    // Save AI response
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponseContent,
      timestamp: new Date().toISOString(),
    };
    history.push(aiMessage);
    await writeData(CHAT_FILE, history);

    return NextResponse.json({ message: aiMessage });

  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
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
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}
