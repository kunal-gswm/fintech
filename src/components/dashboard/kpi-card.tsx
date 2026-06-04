"use client";

import { motion } from "framer-motion";
import {
  PiggyBank,
  CreditCard,
  Wallet,
  TrendingUp,
  TrendingDown,
  HeartPulse,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getProfile } from "@/services/profile.service";
import { getHealth } from "@/services/health.service";
import { getAnalytics } from "@/services/analytics.service";
import { useExpenseStore } from "@/store/expense-store";
import { cn } from "@/lib/utils";
import { SkeletonCard } from "@/components/ui/skeleton-loaders";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PiggyBank,
  CreditCard,
  Wallet,
  TrendingUp,
  HeartPulse,
};

const colorMap: Record<string, { icon: string; bg: string }> = {
  "Monthly Saving": { icon: "text-emerald-600", bg: "bg-emerald-500/10" },
  "Avg Monthly Expense": { icon: "text-amber-600", bg: "bg-amber-500/10" },
  "Monthly Income": { icon: "text-blue-600", bg: "bg-blue-500/10" },
  "Health Score": { icon: "text-pink-600", bg: "bg-pink-500/10" },
};

export function KPICards() {
  const [data, setData] = useState<{title: string; value: number; prefix?: string; suffix?: string; icon: string;}[]>([]);
  
  // [FIX: DESYNC-001] Subscribe to expense store changes to trigger KPI refetch
  // We only care about the length to avoid deep object comparisons
  const expenseCount = useExpenseStore(state => state.expenses.length);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getProfile(), getHealth(), getAnalytics()])
      .then(([profile, health, analytics]) => {
        if (cancelled) return;
        
        const currentMonthData = analytics.monthlyTrend?.[analytics.monthlyTrend.length - 1];
        const income = currentMonthData ? currentMonthData.income : (profile.monthlyIncome || 85000);
        const expenses = currentMonthData ? currentMonthData.expenses : (analytics.totalSpent || 42350);
        
        setData([
          {
            title: "Monthly Income",
            value: income,
            prefix: "₹",
            icon: "Wallet",
          },
          {
            title: "Health Score",
            value: health.score || 78,
            suffix: "/100",
            icon: "HeartPulse",
          },
          {
            title: "Avg Monthly Expense",
            value: expenses,
            prefix: "₹",
            icon: "CreditCard",
          },
          {
            title: "Monthly Saving",
            value: (income - expenses),
            prefix: "₹",
            icon: "PiggyBank",
          }
        ]);
      })
      .catch(console.error);

      return () => {
        cancelled = true;
      };
  }, [expenseCount]); // Depend on expenseCount so mutations trigger a sync

  if (data.length === 0) {
    return (
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible sm:px-0 sm:mx-0 hide-scrollbar">
        <div className="shrink-0 w-[85%] snap-center sm:w-auto"><SkeletonCard /></div>
        <div className="shrink-0 w-[85%] snap-center sm:w-auto"><SkeletonCard /></div>
        <div className="shrink-0 w-[85%] snap-center sm:w-auto"><SkeletonCard /></div>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible sm:px-0 sm:mx-0 hide-scrollbar">
      {data.map((kpi, i) => {
        const Icon = iconMap[kpi.icon] || TrendingUp;
        const colors = colorMap[kpi.title] || {
          icon: "text-blue-600",
          bg: "bg-blue-500/10",
        };
        return (
          <motion.div
            key={kpi.title}
            className="shrink-0 w-[85%] snap-center sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="group relative overflow-hidden p-5 transition-all duration-300 hover:shadow-md hover:shadow-primary/5">
              <div className="flex items-start justify-between">
                <div className={cn("rounded-xl p-2.5", colors.bg)}>
                  <Icon className={cn("h-5 w-5", colors.icon)} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {kpi.prefix}{kpi.value.toLocaleString('en-IN', { minimumFractionDigits: kpi.suffix === '%' ? 1 : 0, maximumFractionDigits: kpi.suffix === '%' ? 1 : 0 })}{kpi.suffix}
                </p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
