"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { HealthScoreRing } from "@/components/financial-health/health-score-ring";
import { MetricCard } from "@/components/financial-health/metric-card";
import { Card } from "@/components/ui/card";
import { healthMetrics } from "@/lib/mock-data";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const recommendations = [
  {
    title: "Build Your Emergency Fund",
    description: "You're 2 months short of the recommended 6-month emergency fund. Increase monthly allocation by ₹5,000.",
    priority: "high",
  },
  {
    title: "Review Insurance Coverage",
    description: "Consider a term life insurance policy for better risk coverage. This could improve your Risk Level score by 20 points.",
    priority: "medium",
  },
  {
    title: "Start a Debt Fund SIP",
    description: "Adding a debt fund will improve portfolio diversification. Recommended: ₹3,000/month in a short-duration debt fund.",
    priority: "low",
  },
];

const priorityColors = {
  high: "border-l-red-500 bg-red-500/5",
  medium: "border-l-amber-500 bg-amber-500/5",
  low: "border-l-blue-500 bg-blue-500/5",
};

export default function FinancialHealthPage() {
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
            <HealthScoreRing score={78} />
          </Card>

          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {healthMetrics.map((metric, i) => (
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
            {recommendations.map((rec) => (
              <Card
                key={rec.title}
                className={`border-l-4 p-5 ${priorityColors[rec.priority as keyof typeof priorityColors]}`}
              >
                <h3 className="text-sm font-semibold">{rec.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {rec.description}
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
