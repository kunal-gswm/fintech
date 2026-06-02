"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import { categoryData } from "@/lib/mock-data";

export function CategoryBreakdownChart() {
  const total = categoryData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Category Breakdown</h3>
        <p className="text-xs text-muted-foreground">
          Where your money went this month
        </p>
      </div>
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  padding: "8px 12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-lg font-bold">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <div className="grid w-full gap-2">
          {categoryData.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium">
                  ₹{cat.value.toLocaleString("en-IN")}
                </span>
                <span className="w-10 text-right text-xs text-muted-foreground">
                  {((cat.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
