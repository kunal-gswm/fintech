"use client";

import { motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { useSidebarStore } from "@/store/sidebar-store";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <motion.div
          initial={false}
          animate={{ marginLeft: isCollapsed ? 72 : 256 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex min-h-screen flex-col max-lg:!ml-0"
        >
          <Navbar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
