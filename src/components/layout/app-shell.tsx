"use client";

import { Navbar } from "./navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
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
