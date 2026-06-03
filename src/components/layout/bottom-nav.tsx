"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PieChart, MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { NativeService } from "@/services/native.service";

const NAV_ITEMS = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: PieChart,
  },
  {
    name: "AI Advisor",
    href: "/assistant",
    icon: MessageSquare,
  },
  {
    name: "Profile",
    href: "/settings",
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on specific full-screen pages if necessary (e.g., login, onboarding)
  const hiddenPaths = ["/login", "/signup", "/onboarding"];
  if (hiddenPaths.includes(pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center justify-around bg-background/80 backdrop-blur-xl border-t border-border px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.2)]">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => NativeService.hapticLight()}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] font-medium">{item.name}</span>
              
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
