"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/shared/page-transition";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
import { LocalLLMService } from "@/services/local-llm.service";
import { cn } from "@/lib/utils";



function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-2 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2.5 w-2.5 rounded-full bg-muted-foreground/60"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

const PREDEFINED_PROMPTS = [
  "Analyze my recent expenses and give tips",
  "How can I improve my health score?",
  "Suggest a 50/30/20 budget for my income",
  "What is an emergency fund?"
];

export default function AssistantPage() {
  const { messages, isTyping, streamingContent, clearMessages } =
    useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, streamingContent]);

  // Poll LLM status so the badge updates as the model loads
  const [llmStatus, setLlmStatus] = useState(LocalLLMService.status);
  useEffect(() => {
    // Check immediately via microtask to avoid sync setState warning
    Promise.resolve().then(() => setLlmStatus(LocalLLMService.status));
    // Then poll every 2s to catch async init changes
    const interval = setInterval(() => {
      setLlmStatus(LocalLLMService.status);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const submitMessage = async (message: string) => {
    await useChatStore.getState().sendMessage(message);
  };

  const handleSend = (text?: string) => {
    const message = text || input.trim();
    if (!message) return;

    setInput("");
    submitMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto flex h-[calc(100dvh-130px)] flex-col max-w-4xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white">
              <BotMessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Financial Advisor</h1>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  Ask anything about your finances
                </p>
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  llmStatus.ready
                    ? "bg-emerald-500/15 text-emerald-400"
                    : llmStatus.error
                      ? "bg-slate-500/15 text-slate-400"
                      : "bg-amber-500/15 text-amber-400"
                )}>
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    llmStatus.ready
                      ? "bg-emerald-400 animate-pulse"
                      : llmStatus.error
                        ? "bg-slate-400"
                        : "bg-amber-400 animate-pulse"
                  )} />
                  {llmStatus.ready ? "On-Device" : llmStatus.error ? "Cloud" : "Loading…"}
                </span>
              </div>
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
          <ScrollArea className="flex-1 min-h-0 px-4 py-4" ref={scrollRef}>
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
                          ? "bg-slate-500/10 text-slate-200"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm prose-invert break-words max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap break-words break-all">{msg.content}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Streaming content from on-device LLM */}
              {streamingContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <Avatar className="mt-1 h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[80%] rounded-2xl bg-slate-500/10 text-slate-200 px-4 py-3 text-sm leading-relaxed">
                    <div className="prose prose-sm prose-invert break-words max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingContent + "▍"}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Typing indicator (shown when waiting for non-streaming response) */}
              {isTyping && !streamingContent && (
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

          {/* Predefined Prompts */}
          {messages.length === 0 && (
            <div className="px-4 pb-2">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_PROMPTS.map((prompt, i) => (
                  <Button
                    key={i}
                    variant="secondary"
                    size="sm"
                    className="h-auto py-1.5 px-3 text-xs font-normal bg-primary/10 hover:bg-primary/20 text-primary border-0"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="relative rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 focus-within:ring-offset-background">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about budgeting, investments, taxes..."
                className="min-h-[52px] resize-none pr-14 bg-muted/50 border-0 focus-visible:ring-0 shadow-none rounded-xl"
                rows={1}
              />
              <Button
                size="icon"
                className="absolute bottom-1 right-1 h-11 w-11 rounded-lg"
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
              >
                <Send className="h-5 w-5" />
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


