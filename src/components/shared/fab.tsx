"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function FAB() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  // Hide entirely on AI Assistant screen to prevent blocking the chat input
  if (pathname === "/assistant") return null;

  const actions = [
    { label: "Add Expense", icon: "➕" },
    { label: "Add Income", icon: "💰" },
    { label: "Add Goal", icon: "🎯" },
  ];

  return (
    <div ref={ref} className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom)+16px)] right-4 z-50">
      <AnimatePresence>
        {open && (
          <div className="absolute bottom-16 right-0 flex flex-col items-end gap-3 pb-2">
            {actions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: (actions.length - 1 - i) * 0.05 }}
                className="flex items-center gap-2 rounded-full bg-[#0A0A0A] border border-[#262626] px-4 py-2 shadow-lg hover:bg-[#1A1A1A] transition-colors"
                onClick={() => {
                  setOpen(false);
                  // Action routing could be added here
                }}
              >
                <span className="text-sm font-medium text-[#E2E8F0] whitespace-nowrap">{action.label}</span>
                <span className="text-base leading-none">{action.icon}</span>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E5B80B] text-[#0F172A] shadow-lg transition-transform active:scale-95"
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <Plus className="h-6 w-6 stroke-[2.5px]" />
        </motion.div>
      </button>
    </div>
  );
}
