"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getAnalytics } from "@/services/analytics.service";
import type { MonthlyData } from "@/types";

export function SavingsGrowthChart() {
  const [data, setData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    getAnalytics().then((res) => {
      setData(
        (res.monthlyTrend || []).map((m: {month: string; income: number; expenses: number}) => ({
          ...m,
          savings: m.income - m.expenses,
        }))
      );
    }).catch(console.error);
  }, []);

  const cumulativeData = data.reduce(
    (acc, d) => {
      const prev = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
      const savings = (d.income || 0) - (d.expenses || 0);
      acc.push({ month: d.month, savings, cumulative: prev + savings });
      return acc;
    },
    [] as { month: string; savings: number; cumulative: number }[]
  );

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Savings Growth</h3>
          <p className="text-xs text-muted-foreground">
            Cumulative savings over the year
          </p>
        </div>
        <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
          ₹{cumulativeData[cumulativeData.length - 1]?.cumulative.toLocaleString("en-IN")} total
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={cumulativeData}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="savingsLineGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94A3B8" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
              formatter={(value, name) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                name === "cumulative" ? "Total Saved" : "Monthly",
              ]}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#10B981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
