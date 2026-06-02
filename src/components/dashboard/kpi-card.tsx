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
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { kpiData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PiggyBank,
  CreditCard,
  Wallet,
  TrendingUp,
  HeartPulse,
};

const colorMap: Record<string, { icon: string; bg: string }> = {
  "Total Savings": { icon: "text-emerald-600", bg: "bg-emerald-500/10" },
  "Monthly Expenses": { icon: "text-amber-600", bg: "bg-amber-500/10" },
  "Monthly Income": { icon: "text-blue-600", bg: "bg-blue-500/10" },
  "Savings Rate": { icon: "text-violet-600", bg: "bg-violet-500/10" },
  "Health Score": { icon: "text-pink-600", bg: "bg-pink-500/10" },
};

export function KPICards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {kpiData.map((kpi, i) => {
        const Icon = iconMap[kpi.icon] || TrendingUp;
        const colors = colorMap[kpi.title] || {
          icon: "text-blue-600",
          bg: "bg-blue-500/10",
        };
        const isPositive = kpi.trend > 0;

        return (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="group relative overflow-hidden p-5 transition-all duration-300 hover:shadow-md hover:shadow-primary/5">
              <div className="flex items-start justify-between">
                <div className={cn("rounded-xl p-2.5", colors.bg)}>
                  <Icon className={cn("h-5 w-5", colors.icon)} />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    isPositive
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-red-500/10 text-red-600"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(kpi.trend)}%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  <AnimatedCounter
                    value={kpi.value}
                    prefix={kpi.prefix}
                    suffix={kpi.suffix}
                    decimals={kpi.suffix === "%" ? 1 : 0}
                  />
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {kpi.trendLabel}
                </p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
