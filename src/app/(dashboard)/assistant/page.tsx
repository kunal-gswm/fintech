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
  const { messages, isTyping, streamingContent, clearMessages } =
    useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, streamingContent]);

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
                          ? "bg-blue-500/10 text-blue-900 dark:bg-blue-500/20 dark:text-blue-100"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm prose-slate dark:prose-invert break-words max-w-none">
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
                  <div className="max-w-[80%] rounded-2xl bg-blue-500/10 text-blue-900 dark:bg-blue-500/20 dark:text-blue-100 px-4 py-3 text-sm leading-relaxed">
                    <div className="prose prose-sm prose-slate dark:prose-invert break-words max-w-none">
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


