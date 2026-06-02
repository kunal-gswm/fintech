"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { HealthScoreRing } from "@/components/financial-health/health-score-ring";
import { MetricCard } from "@/components/financial-health/metric-card";
import { Card } from "@/components/ui/card";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHealth } from "@/services/health.service";
import type { HealthMetric } from "@/types";


const priorityColors: Record<string, string> = {
  high: "border-l-red-500 bg-red-500/5",
  medium: "border-l-amber-500 bg-amber-500/5",
  low: "border-l-blue-500 bg-blue-500/5",
};

export default function FinancialHealthPage() {
  const [healthData, setHealthData] = useState<{score: number; metrics: HealthMetric[]; recommendations: string[]} | null>(null);

  useEffect(() => {
    getHealth().then(setHealthData).catch(console.error);
  }, []);

  if (!healthData) return <div className="flex h-64 items-center justify-center">Loading health...</div>;
  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Financial Health"
          description="A comprehensive view of your financial well-being."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Score Ring */}
          <Card className="flex items-center justify-center p-8 lg:row-span-2">
            <HealthScoreRing score={healthData.score} />
          </Card>

          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {healthData.metrics?.map((metric: HealthMetric, i: number) => (
              <MetricCard key={metric.title} metric={metric} index={i} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            AI Recommendations
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {healthData.recommendations?.map((rec: string, i: number) => (
              <Card
                key={i}
                className={`border-l-4 p-5 ${priorityColors[i % 3 === 0 ? "high" : i % 3 === 1 ? "medium" : "low"]}`}
              >
                <h3 className="text-sm font-semibold">Tip</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {rec}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 -ml-2 h-8 text-xs"
                >
                  Learn more
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
