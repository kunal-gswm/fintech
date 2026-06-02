"use client";

import {
  AreaChart,
  Area,
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

export function ExpenseTrendChart() {
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

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Monthly Expense Trend</h3>
          <p className="text-xs text-muted-foreground">
            Income vs Expenses over the last 12 months
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Expenses</span>
          </div>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="expenseGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
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
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
              ]}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#2563EB"
              strokeWidth={2}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
