"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Moon,
  Sun,
  Menu,
  User,
  LogOut,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSidebarStore } from "@/store/sidebar-store";
import { useThemeStore } from "@/store/theme-store";
import { SearchDialog } from "@/components/shared/search-dialog";
import { cn } from "@/lib/utils";


export function Navbar() {
  const { setMobileOpen } = useSidebarStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border/40 bg-background/70 px-4 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(212,175,55,0.03)] md:px-6 transition-colors duration-300">


      {/* Mobile Branding */}
      <div className="flex flex-1 items-center gap-2 lg:hidden pl-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm text-sm">
          E
        </div>
        <span className="text-lg font-bold tracking-tight">Expanda</span>
      </div>

      {/* Search */}
      <div className="relative hidden flex-1 md:block md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search transactions, goals, articles..."
          className="h-9 pl-9 bg-muted/50 border-0 focus-visible:ring-1 cursor-pointer"
          readOnly
          onClick={() => setSearchOpen(true)}
        />
      </div>

      {/* Mobile search icon */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)}>
        <Search className="h-5 w-5" />
      </Button>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <div className="ml-auto flex items-center gap-1">

        {/* Profile Dropdown */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "relative h-9 w-9 rounded-full ring-2 ring-border overflow-hidden" })}>
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatar.jpg" alt="User Avatar" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Arjun Kumar</span>
                    <span className="text-xs text-muted-foreground">
                      arjun@example.com
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
