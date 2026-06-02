"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, LayoutDashboard, HeartPulse, Receipt, BarChart3, Target, GraduationCap, BotMessageSquare, FileText, Settings, BookOpen } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SEARCH_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, category: "Pages" },
  { title: "Financial Health", href: "/financial-health", icon: HeartPulse, category: "Pages" },
  { title: "Expense Ledger", href: "/expenses", icon: Receipt, category: "Pages" },
  { title: "Analytics", href: "/analytics", icon: BarChart3, category: "Pages" },
  { title: "Goals", href: "/goals", icon: Target, category: "Pages" },
  { title: "Learning Hub", href: "/learning", icon: GraduationCap, category: "Pages" },
  { title: "AI Assistant", href: "/assistant", icon: BotMessageSquare, category: "Pages" },
  { title: "Reports", href: "/reports", icon: FileText, category: "Pages" },
  { title: "Settings", href: "/settings", icon: Settings, category: "Pages" },
  
  // Quick Articles
  { title: "Understanding Mutual Funds", href: "/learning/understanding-mutual-funds", icon: BookOpen, category: "Articles" },
  { title: "Building an Emergency Fund", href: "/learning/emergency-funds", icon: BookOpen, category: "Articles" },
  { title: "Basics of ETFs", href: "/learning/understanding-etfs", icon: BookOpen, category: "Articles" },
];

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Reset query when modal closes
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filteredItems = SEARCH_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-xl top-[10%] translate-y-0">
        <div className="flex items-center border-b px-4">
          <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, articles, tools..."
            className="flex h-14 w-full rounded-md bg-transparent py-3 text-base outline-none border-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
            autoFocus
          />
        </div>
        
        <ScrollArea className="max-h-[60vh]">
          {filteredItems.length === 0 ? (
            <div className="py-14 px-4 text-center text-sm text-muted-foreground">
              No results found for "{query}".
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  onClick={() => handleSelect(item.href)}
                  className="w-full justify-start font-normal h-12"
                >
                  <item.icon className="mr-3 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
