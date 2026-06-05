"use client";
import * as React from "react";

import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Sliders,
  Palette,
  ShieldCheck,
  Camera,
  ChevronRight,
  ChevronLeft,
  LogOut
} from "lucide-react";
import { useThemeStore } from "@/store/theme-store";
import { NativeService } from "@/services/native.service";

type Section = "profile" | "preferences" | "security" | null;

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<Section>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);



  const menuItems = [
    { id: "profile", label: "Profile", icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "preferences", label: "Preferences", icon: Sliders, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: "security", label: "Security", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ] as const;

  if (activeSection) {
    return (
      <PageTransition>
        <div className="space-y-4">
          <div className="flex items-center gap-3 pt-2">
            <Button variant="ghost" size="icon" onClick={() => { NativeService.hapticLight(); setActiveSection(null); }}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold capitalize">{activeSection}</h1>
          </div>

          <div className="px-4 pb-8 space-y-6">
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                        AK
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 rounded-full border-2 border-background bg-primary p-2 text-primary-foreground shadow-sm">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg">Arjun Kumar</p>
                    <p className="text-sm text-muted-foreground">arjun@example.com</p>
                  </div>
                </div>

                <div className="space-y-4 rounded-xl border bg-card p-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue="Arjun" className="bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="Kumar" className="bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue="arjun@example.com" className="bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input type="tel" defaultValue="+91 98765 43210" className="bg-transparent" />
                  </div>
                </div>
                <Button className="w-full" size="lg">Save Profile</Button>
              </div>
            )}

            {activeSection === "preferences" && (
              <div className="space-y-6">
                <div className="space-y-4 rounded-xl border bg-card p-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select defaultValue="inr">
                      <SelectTrigger className="bg-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inr">₹ INR — Indian Rupee</SelectItem>
                        <SelectItem value="usd">$ USD — US Dollar</SelectItem>
                        <SelectItem value="eur">€ EUR — Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Budget Limit</Label>
                    <Input type="number" defaultValue="50000" className="bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <Label>Savings Goal (%)</Label>
                    <Input type="number" defaultValue="30" className="bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Fund Target (months)</Label>
                    <Input type="number" defaultValue="6" className="bg-transparent" />
                  </div>
                </div>

                <div className="space-y-4 rounded-xl border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-categorize</p>
                      <p className="text-xs text-muted-foreground">Use AI to sort expenses</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly digest</p>
                      <p className="text-xs text-muted-foreground">Receive a summary</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button className="w-full" size="lg">Save Preferences</Button>
              </div>
            )}



            {activeSection === "security" && (
              <div className="space-y-6">
                <div className="space-y-4 rounded-xl border bg-card p-4">
                  <h4 className="font-medium">Change Password</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" />
                    </div>
                    <Button className="w-full mt-2">Update Password</Button>
                  </div>
                </div>

                <div className="space-y-4 rounded-xl border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-factor Auth</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer</p>
                    </div>
                    <Switch />
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6 pb-8">
        <PageHeader title="Settings" description="Manage your preferences." />

        <div className="space-y-2">
          <div className="rounded-2xl border bg-card overflow-hidden">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => { NativeService.hapticLight(); setActiveSection(item.id); }}
                  className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-accent/50 active:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.bg}`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.id !== "profile" && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                </button>
                {index < menuItems.length - 1 && <Separator className="ml-14" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button variant="outline" className="w-full text-destructive hover:text-destructive gap-2 h-12 rounded-xl">
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Version 1.3.0
        </p>
      </div>
    </PageTransition>
  );
}
