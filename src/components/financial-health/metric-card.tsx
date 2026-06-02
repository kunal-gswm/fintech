"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  PiggyBank,
  Shield,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { HealthMetric } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PiggyBank,
  Shield,
  TrendingUp,
  AlertTriangle,
};

const statusColors = {
  excellent: { text: "text-emerald-600", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
  good: { text: "text-blue-600", bg: "bg-blue-500/10", bar: "bg-blue-500" },
  fair: { text: "text-amber-600", bg: "bg-amber-500/10", bar: "bg-amber-500" },
  poor: { text: "text-red-600", bg: "bg-red-500/10", bar: "bg-red-500" },
};

export function MetricCard({
  metric,
  index,
}: {
  metric: HealthMetric;
  index: number;
}) {
  const Icon = iconMap[metric.icon] || TrendingUp;
  const colors = statusColors[metric.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div className={cn("rounded-xl p-2.5", colors.bg)}>
            <Icon className={cn("h-5 w-5", colors.text)} />
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
              colors.bg,
              colors.text
            )}
          >
            {metric.status}
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold">{metric.title}</h3>
          <div className="mt-2 flex items-center gap-2">
            <Progress
              value={(metric.score / metric.maxScore) * 100}
              className="h-2"
            />
            <span className="text-sm font-bold">
              {metric.score}/{metric.maxScore}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {metric.description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
