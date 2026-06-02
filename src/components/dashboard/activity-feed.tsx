"use client";

import { CreditCard, Target, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockActivities } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CreditCard,
  Target,
  Sparkles,
};

const typeColors = {
  expense: "border-amber-500/30 bg-amber-500/10",
  goal: "border-emerald-500/30 bg-emerald-500/10",
  ai_recommendation: "border-violet-500/30 bg-violet-500/10",
};

const typeIconColors = {
  expense: "text-amber-600",
  goal: "text-emerald-600",
  ai_recommendation: "text-violet-600",
};

export function ActivityFeed() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Recent Activity</h3>
          <p className="text-xs text-muted-foreground">
            Latest transactions and updates
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {mockActivities.length} items
        </Badge>
      </div>
      <ScrollArea className="h-[360px]">
        <div className="space-y-3 pr-4">
          {mockActivities.map((activity) => {
            const Icon = iconMap[activity.icon] || CreditCard;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
              >
                <div
                  className={cn(
                    "mt-0.5 shrink-0 rounded-lg border p-2",
                    typeColors[activity.type]
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      typeIconColors[activity.type]
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{activity.title}</p>
                    {activity.amount && (
                      <span className="shrink-0 text-sm font-semibold text-amber-600">
                        -₹{activity.amount.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
