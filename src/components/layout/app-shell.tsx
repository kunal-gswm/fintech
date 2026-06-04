"use client";

import { useEffect } from "react";
import { Navbar } from "./navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "./bottom-nav";
import { LocalLLMService } from "@/services/local-llm.service";

export function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Notify Capgo OTA updater that the app successfully booted
    import('@capgo/capacitor-updater').then((mod) => {
      mod.CapacitorUpdater.notifyAppReady().catch(console.error);
    }).catch(() => {
      // Ignored on web
    });

    // Preload the AI model in the background so it's ready instantly when the user navigates to the chat
    LocalLLMService.initialize().catch(console.error);
  }, []);

  return (
    <TooltipProvider delay={0}>
      <div className="min-h-screen bg-background">
        <div className="flex min-h-[100dvh] flex-col">
          <Navbar />
          {/* Add dynamic padding bottom to account for bottom nav + safe area */}
          <main className="flex-1 p-4 md:p-6 pb-[calc(var(--bottom-nav-height)+16px)]">{children}</main>
        </div>
        
        {/* Bottom Nav visible on all screens now that we are mobile-first */}
        <BottomNav />
      </div>
    </TooltipProvider>
  );
}
