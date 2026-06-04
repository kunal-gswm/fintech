"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/shared/page-transition";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { KPICards } from "@/components/dashboard/kpi-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AiMonthlyReview } from "@/components/dashboard/ai-monthly-review";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-8 pb-4">
        

        {/* AI Monthly Review Section */}
        <div className="px-1">
          <ErrorBoundary fallbackMessage="Failed to load AI Monthly Review">
            <AiMonthlyReview />
          </ErrorBoundary>
        </div>

        {/* KPI Cards Container */}
        <div className="pt-2">
          <div className="mb-4 flex items-center justify-between px-2">
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
            <Link href="/expenses" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline group">
              View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <ErrorBoundary fallbackMessage="Failed to load Activity Feed">
            <ActivityFeed />
          </ErrorBoundary>
        </div>
      </div>
    </PageTransition>
  );
}
