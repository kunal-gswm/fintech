"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/shared/page-transition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Sparkles,
  User,
  RotateCcw,
  BotMessageSquare,
} from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import { suggestedPrompts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-muted-foreground/40"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

export default function AssistantPage() {
  const { messages, isTyping, addMessage, setTyping, clearMessages } =
    useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const message = text || input.trim();
    if (!message) return;

    addMessage({
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    });
    setInput("");
    setTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(message),
        timestamp: new Date().toISOString(),
      });
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white">
              <BotMessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Financial Advisor</h1>
              <p className="text-xs text-muted-foreground">
                Ask anything about your finances
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearMessages}
            className="gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New Chat
          </Button>
        </div>

        {/* Chat Area */}
        <Card className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef}>
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" && "flex-row-reverse"
                    )}
                  >
                    <Avatar className="mt-1 h-8 w-8 shrink-0">
                      <AvatarFallback
                        className={cn(
                          "text-xs font-medium",
                          msg.role === "assistant"
                            ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        {msg.role === "assistant" ? (
                          <Sparkles className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        msg.role === "assistant"
                          ? "bg-muted text-foreground"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <Avatar className="mt-1 h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl bg-muted px-4 py-2">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Prompts */}
          {messages.length <= 3 && (
            <div className="border-t px-4 py-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Suggested
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about budgeting, investments, taxes..."
                className="min-h-[52px] resize-none pr-14"
                rows={1}
              />
              <Button
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8 rounded-lg"
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              AI can make mistakes. Verify important financial decisions with a certified advisor.
            </p>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}

function generateResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("saving") || lower.includes("save")) {
    return "Based on your current income of ₹85,000 and expenses of ₹42,350, you're saving 50.2% of your income — that's excellent!\n\nHere are some ways to boost your savings further:\n\n1. **Optimize food spending** — You spent ₹3,270 on food delivery. Meal prepping could save ₹1,500/month.\n2. **Review subscriptions** — Check for unused streaming services.\n3. **Automate savings** — Set up auto-transfers on salary day.\n\nWould you like me to create a detailed savings plan?";
  }
  if (lower.includes("invest") || lower.includes("sip") || lower.includes("mutual")) {
    return "Great question! Based on your risk profile and savings rate, here's what I recommend:\n\n**Current Investments:**\n- SIP in HDFC Equity Fund: ₹5,000/month\n- PPF: ₹10,000/month\n\n**Suggestions:**\n1. Increase equity SIP by ₹3,000 (you can afford it)\n2. Start a debt fund SIP of ₹2,000 for portfolio balance\n3. Consider Nifty 50 index fund for passive exposure\n\nYour total monthly investment capacity is around ₹20,000-25,000 while maintaining a healthy emergency fund. Shall I break this down further?";
  }
  if (lower.includes("budget") || lower.includes("spend")) {
    return "Here's your spending analysis for December:\n\n**50/30/20 Rule Assessment:**\n- **Needs (50%):** ₹21,175 — ✅ On track\n- **Wants (30%):** ₹12,705 — ✅ On track\n- **Savings (20%):** ₹42,650 — 🌟 Exceeding target!\n\n**Top optimization opportunities:**\n1. Shopping (₹9,398) — Implement a 48-hour rule\n2. Food delivery (₹3,270) — Reduce by cooking more\n3. Transportation (₹2,130) — Consider monthly passes\n\nWould you like a customized budget for January?";
  }
  if (lower.includes("tax")) {
    return "Here's your tax optimization guide for FY 2025-26:\n\n**Section 80C (₹1.5L limit):**\n- PPF: ₹1,20,000 ✅\n- ELSS SIP: Consider starting ₹30,000/year\n\n**Section 80D (Health Insurance):**\n- Self: Up to ₹25,000 deduction\n- Parents: Additional ₹50,000 if senior citizens\n\n**Other deductions:**\n- NPS (80CCD): Additional ₹50,000\n- Home loan interest (24b): Up to ₹2L\n\nEstimated tax savings potential: ₹45,000-65,000. Want me to create a tax-saving investment plan?";
  }
  return "That's a great question! Let me analyze your financial data to give you a personalized answer.\n\nBased on your profile:\n- Monthly income: ₹85,000\n- Monthly expenses: ₹42,350\n- Savings rate: 50.2%\n- Financial health score: 78/100\n\nYour finances are in good shape overall. Your strongest area is your savings rate, and the biggest opportunity for improvement is building your emergency fund to 6 months of expenses.\n\nWould you like me to dive deeper into any specific area — budgeting, investments, tax planning, or goal tracking?";
}
