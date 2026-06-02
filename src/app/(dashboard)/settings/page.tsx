"use client";
import * as React from "react";

import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Bell,
  Camera,
} from "lucide-react";
import { useThemeStore } from "@/store/theme-store";

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          description="Manage your account and preferences."
        />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="w-full justify-start bg-muted/50 p-1">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Sliders className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="theme" className="gap-2">
              <Palette className="h-4 w-4" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile">
            <Card className="p-6">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <p className="text-sm text-muted-foreground">
                Update your personal details
              </p>
              <Separator className="my-6" />

              <div className="mb-8 flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                      AK
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-1 -right-1 rounded-full border-2 border-card bg-primary p-1.5 text-primary-foreground">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <p className="font-medium">Arjun Kumar</p>
                  <p className="text-sm text-muted-foreground">
                    arjun@example.com
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue="Arjun" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue="Kumar" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" defaultValue="arjun@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" defaultValue="+91 98765 43210" />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Financial Preferences */}
          <TabsContent value="preferences">
            <Card className="p-6">
              <h3 className="text-lg font-semibold">Financial Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Customize your financial settings
              </p>
              <Separator className="my-6" />

              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select defaultValue="inr">
                      <SelectTrigger>
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
                    <Input type="number" defaultValue="50000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Savings Goal (%)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Fund Target (months)</Label>
                    <Input type="number" defaultValue="6" />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto-categorize expenses</p>
                    <p className="text-xs text-muted-foreground">
                      Use AI to automatically categorize your expenses
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Weekly spending digest</p>
                    <p className="text-xs text-muted-foreground">
                      Receive a weekly summary of your spending
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Theme */}
          <TabsContent value="theme">
            <Card className="p-6">
              <h3 className="text-lg font-semibold">Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Customize how the app looks and feels
              </p>
              <Separator className="my-6" />

              <div className="grid gap-4 sm:grid-cols-2 max-w-md">
                <button
                  onClick={() => setTheme("light")}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    mounted && theme === "light"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="mb-3 h-20 rounded-lg bg-white border border-gray-200">
                    <div className="h-4 rounded-t-lg bg-gray-100" />
                  </div>
                  <p className="text-sm font-medium">Light</p>
                  <p className="text-xs text-muted-foreground">
                    Clean and bright
                  </p>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    mounted && theme === "dark"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="mb-3 h-20 rounded-lg bg-gray-900 border border-gray-700">
                    <div className="h-4 rounded-t-lg bg-gray-800" />
                  </div>
                  <p className="text-sm font-medium">Dark</p>
                  <p className="text-xs text-muted-foreground">
                    Easy on the eyes
                  </p>
                </button>
              </div>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card className="p-6">
              <h3 className="text-lg font-semibold">Security</h3>
              <p className="text-sm text-muted-foreground">
                Manage your account security settings
              </p>
              <Separator className="my-6" />

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Change Password</h4>
                  <div className="max-w-md space-y-3">
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
                    <Button>Update Password</Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Two-factor authentication
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Biometric login</p>
                    <p className="text-xs text-muted-foreground">
                      Use fingerprint or face recognition
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="p-6">
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Choose what notifications you receive
              </p>
              <Separator className="my-6" />

              <div className="space-y-5">
                {[
                  {
                    title: "Expense alerts",
                    desc: "Get notified when you add or approach budget limits",
                    checked: true,
                  },
                  {
                    title: "Goal milestones",
                    desc: "Celebrate when you hit savings milestones",
                    checked: true,
                  },
                  {
                    title: "Monthly reports",
                    desc: "Receive your monthly financial summary",
                    checked: true,
                  },
                  {
                    title: "AI insights",
                    desc: "Get personalized AI-powered recommendations",
                    checked: true,
                  },
                  {
                    title: "Security alerts",
                    desc: "Important security notifications about your account",
                    checked: true,
                  },
                  {
                    title: "Marketing emails",
                    desc: "Product updates and feature announcements",
                    checked: false,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch defaultChecked={item.checked} />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
