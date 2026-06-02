"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { KPICards } from "@/components/dashboard/kpi-card";
import { ExpenseTrendChart } from "@/components/dashboard/expense-trend-chart";
import { CategoryBreakdownChart } from "@/components/dashboard/category-breakdown-chart";
import { SavingsGrowthChart } from "@/components/dashboard/savings-growth-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Welcome back, Arjun. Here's your financial overview."
        />

        <ErrorBoundary fallbackMessage="Failed to load Key Performance Indicators">
          <KPICards />
        </ErrorBoundary>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ErrorBoundary fallbackMessage="Failed to load Expense Trends">
              <ExpenseTrendChart />
            </ErrorBoundary>
          </div>
          <ErrorBoundary fallbackMessage="Failed to load Category Breakdown">
            <CategoryBreakdownChart />
          </ErrorBoundary>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ErrorBoundary fallbackMessage="Failed to load Savings Growth">
            <SavingsGrowthChart />
          </ErrorBoundary>
          <ErrorBoundary fallbackMessage="Failed to load Activity Feed">
            <ActivityFeed />
          </ErrorBoundary>
        </div>
      </div>
    </PageTransition>
  );
}
