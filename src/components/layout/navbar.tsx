"use client";

import { useEffect } from "react";
import {
  Search,
  Bell,
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { mockNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { setMobileOpen } = useSidebarStore();
  const { theme, toggleTheme } = useThemeStore();
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      {/* Search */}
      <div className="relative hidden flex-1 md:block md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search transactions, goals, articles..."
          className="h-9 pl-9 bg-muted/50 border-0 focus-visible:ring-1"
        />
      </div>

      {/* Mobile search icon */}
      <Button variant="ghost" size="icon" className="md:hidden">
        <Search className="h-5 w-5" />
      </Button>

      <div className="ml-auto flex items-center gap-1">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "relative h-9 w-9" })}>
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b px-4 py-3">
              <h4 className="text-sm font-semibold">Notifications</h4>
              <p className="text-xs text-muted-foreground">
                You have {unreadCount} unread notifications
              </p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "border-b px-4 py-3 last:border-0 transition-colors hover:bg-muted/50",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                        notification.type === "success" && "bg-emerald-500",
                        notification.type === "warning" && "bg-amber-500",
                        notification.type === "info" && "bg-blue-500"
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {notification.description}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/70">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-9 w-9 rounded-full ring-2 ring-border overflow-hidden" })}>
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatar.jpg" alt="User Avatar" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Arjun Kumar</span>
                <span className="text-xs text-muted-foreground">
                  arjun@example.com
                </span>
              </div>
            </DropdownMenuLabel>
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
    </header>
  );
}
