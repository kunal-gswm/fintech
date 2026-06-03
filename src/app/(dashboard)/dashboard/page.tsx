"use client";

import { PageTransition } from "@/components/shared/page-transition";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { KPICards } from "@/components/dashboard/kpi-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AiMonthlyReview } from "@/components/dashboard/ai-monthly-review";
import { Sparkles, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-8 pb-4">
        {/* Premium Welcome Card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 p-8 shadow-2xl shadow-indigo-500/20 border border-indigo-400/20">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/10 shadow-sm mb-4">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                <span>AI Insights Active</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome back, Arjun
              </h1>
              <p className="mt-2 text-indigo-100 max-w-md text-sm sm:text-base">
                Your financial portfolio is looking healthy today. Let's review your recent activity and optimize your savings.
              </p>
            </div>
            
            <div className="hidden sm:block">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-inner p-1">
                <Avatar className="h-full w-full">
                  <AvatarImage src="/avatar.jpg" />
                  <AvatarFallback className="bg-indigo-900/50 text-white text-lg font-semibold">AK</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>

        {/* AI Monthly Review Section */}
        <div className="relative z-20 -mt-8 sm:-mt-10 px-2 sm:px-4">
          <ErrorBoundary fallbackMessage="Failed to load AI Monthly Review">
            <AiMonthlyReview />
          </ErrorBoundary>
        </div>

        {/* KPI Cards Container */}
        <div className="pt-2">
          <div className="mb-5 flex items-center justify-between px-2">
            <h2 className="text-xl font-bold tracking-tight">Overview</h2>
          </div>
          <ErrorBoundary fallbackMessage="Failed to load Key Performance Indicators">
            <KPICards />
          </ErrorBoundary>
        </div>

        {/* Activity Feed Container */}
        <div className="grid gap-6 pt-2">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
            <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline group">
              View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <ErrorBoundary fallbackMessage="Failed to load Activity Feed">
            <ActivityFeed />
          </ErrorBoundary>
        </div>
      </div>
    </PageTransition>
  );
}
