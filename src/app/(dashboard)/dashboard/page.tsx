"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
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

        <KPICards />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ExpenseTrendChart />
          </div>
          <CategoryBreakdownChart />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SavingsGrowthChart />
          <ActivityFeed />
        </div>
      </div>
    </PageTransition>
  );
}
