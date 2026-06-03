"use client";

import { motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { useSidebarStore } from "@/store/sidebar-store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();

  return (
    <TooltipProvider delay={0}>
      <div className="min-h-screen bg-background">
        {/* Sidebar is hidden on lg breakpoints and below */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <motion.div
          initial={false}
          animate={{ marginLeft: isCollapsed ? 72 : 256 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex min-h-[100dvh] flex-col max-lg:!ml-0"
        >
          <Navbar />
          {/* Add padding bottom on mobile to account for bottom nav */}
          <main className="flex-1 p-4 md:p-6 pb-24 lg:pb-6">{children}</main>
        </motion.div>
        
        {/* Bottom Nav visible only on mobile */}
        <BottomNav />
      </div>
    </TooltipProvider>
  );
}
