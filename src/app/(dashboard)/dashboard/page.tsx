"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { KPICards } from "@/components/dashboard/kpi-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AiMonthlyReview } from "@/components/dashboard/ai-monthly-review";

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Welcome back, Arjun. Here's your financial overview."
        />

        <ErrorBoundary fallbackMessage="Failed to load AI Monthly Review">
          <AiMonthlyReview />
        </ErrorBoundary>

        <ErrorBoundary fallbackMessage="Failed to load Key Performance Indicators">
          <KPICards />
        </ErrorBoundary>

        <div className="grid gap-6">
          <ErrorBoundary fallbackMessage="Failed to load Activity Feed">
            <ActivityFeed />
          </ErrorBoundary>
        </div>
      </div>
    </PageTransition>
  );
}
