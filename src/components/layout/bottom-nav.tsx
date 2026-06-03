"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, PieChart, MessageSquare, User, Grid, Target, BookOpen, FileText, CreditCard, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NativeService } from "@/services/native.service";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const MAIN_NAV = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Analytics", href: "/analytics", icon: PieChart },
];

const RIGHT_NAV = [
  { name: "AI Advisor", href: "/assistant", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

const ALL_MENU_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: Home, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Expenses", href: "/expenses", icon: CreditCard, color: "text-amber-500", bg: "bg-amber-500/10" },
  { name: "Analytics", href: "/analytics", icon: PieChart, color: "text-violet-500", bg: "bg-violet-500/10" },
  { name: "Goals", href: "/goals", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "AI Assistant", href: "/assistant", icon: MessageSquare, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { name: "Learning", href: "/learning", icon: BookOpen, color: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Reports", href: "/reports", icon: FileText, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Settings", href: "/settings", icon: User, color: "text-slate-500", bg: "bg-slate-500/10" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide bottom nav on specific full-screen pages
  const hiddenPaths = ["/login", "/signup", "/onboarding"];
  if (hiddenPaths.includes(pathname)) return null;

  const NavButton = ({ item }: { item: any }) => {
    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
    return (
      <Link
        href={item.href}
        onPointerDown={() => NativeService.hapticLight()}
        className={cn(
          "relative flex flex-col items-center justify-center w-14 h-full min-h-[44px] gap-1 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
        <span className="text-[10px] font-medium leading-tight">{item.name}</span>
        
        {isActive && (
          <motion.div
            layoutId="bottomNavIndicator"
            className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  const handleMenuClick = (href: string) => {
    NativeService.hapticLight();
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)] bg-background border-t border-border shadow-[0_-4px_30px_rgba(0,0,0,0.05)]">
        <div className="flex h-16 items-center justify-around px-2 relative">
          
          {MAIN_NAV.map((item) => (
            <NavButton key={item.name} item={item} />
          ))}

          {/* Central Menu FAB */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger className="relative -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background transition-transform active:scale-95">
              <Grid className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh] rounded-t-3xl px-6 pb-8 pt-6">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
              </SheetHeader>
              
              <div className="grid grid-cols-4 gap-y-8 gap-x-4">
                {ALL_MENU_ITEMS.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleMenuClick(item.href)}
                    className="flex flex-col items-center gap-3 transition-opacity active:opacity-70"
                  >
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", item.bg)}>
                      <item.icon className={cn("h-6 w-6", item.color)} />
                    </div>
                    <span className="text-xs font-medium text-foreground">{item.name}</span>
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {RIGHT_NAV.map((item) => (
            <NavButton key={item.name} item={item} />
          ))}

        </div>
      </div>
    </>
  );
}
