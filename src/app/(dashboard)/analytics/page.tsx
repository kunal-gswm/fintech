"use client";
import { useState, useEffect } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getAnalytics } from "@/services/analytics.service";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const barColors = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#EF4444", "#84CC16"];

const aiInsights = [
  {
    title: "Food spending trending up",
    description: "Your food & dining expenses have increased 15% month-over-month. Consider meal planning to reduce costs.",
    type: "warning" as const,
    icon: TrendingUp,
  },
  {
    title: "Great savings consistency",
    description: "You've maintained a 50%+ savings rate for 3 consecutive months. Keep up the excellent habit!",
    type: "success" as const,
    icon: TrendingUp,
  },
  {
    title: "Subscription optimization",
    description: "You're paying for 3 streaming services totaling ₹1,847/month. Consider consolidating to save ₹800/month.",
    type: "info" as const,
    icon: AlertCircle,
  },
  {
    title: "Investment opportunity",
    description: "Based on your savings rate, you can increase your SIP by ₹5,000 without impacting your lifestyle budget.",
    type: "info" as const,
    icon: Sparkles,
  },
];

const insightStyles = {
  warning: "border-l-amber-500 bg-amber-500/5",
  success: "border-l-emerald-500 bg-emerald-500/5",
  info: "border-l-blue-500 bg-blue-500/5",
};

const insightIconStyles = {
  warning: "text-amber-600 bg-amber-500/10",
  success: "text-emerald-600 bg-emerald-500/10",
  info: "text-blue-600 bg-blue-500/10",
};

export default function AnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [data, setData] = useState<{ categoryBreakdown: { name: string; value: number; color: string }[]; monthlyTrend: { month: string; income: number; expenses: number }[] } | null>(null);

  useEffect(() => {
    getAnalytics(selectedMonth).then((res) => {
      const categories = res.categoryBreakdown.map((c: { name: string; value: number }, i: number) => ({
        ...c,
        color: barColors[i % barColors.length],
      }));
      setData({ ...res, categoryBreakdown: categories });
    }).catch(console.error);
  }, [selectedMonth]);

  if (!data) return <div className="flex h-64 items-center justify-center">Loading analytics...</div>;

  const total = data.categoryBreakdown.reduce((s: number, d: { value: number }) => s + d.value, 0);
  const currentMonthDisplay = selectedMonth === "All" ? "All Time" : selectedMonth;

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Analytics"
          description={`Deep insights into your spending patterns for ${currentMonthDisplay}.`}
        >
          <Select value={selectedMonth} onValueChange={(val) => val && setSelectedMonth(val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Time</SelectItem>
              {data.monthlyTrend.map((t) => (
                <SelectItem key={t.month} value={t.month}>
                  {t.month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PageHeader>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Spending Breakdown Pie */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold">Spending Breakdown</h3>
            <p className="text-xs text-muted-foreground">
              Distribution by category
            </p>
            <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative h-52 w-52 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.categoryBreakdown.map((entry: { color: string }, i: number) => (
                        <Cell key={i} fill={entry.color} />
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
              <div className="flex-1 space-y-3 w-full">
                {data.categoryBreakdown.map((item: { name: string; color: string; value: number }) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs">{item.name}</span>
                    </div>
                    <span className="text-xs font-medium">
                      {((item.value / total) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Top Categories Bar */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold">Top Spending Categories</h3>
            <p className="text-xs text-muted-foreground">
              Ranked by amount spent
            </p>
            <div className="mt-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.categoryBreakdown}
                  layout="vertical"
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    width={100}
                  />
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
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                    {data.categoryBreakdown.map((entry: { color: string }, i: number) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Monthly Comparison */}
          <Card className="p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Monthly Comparison</h3>
                <p className="text-xs text-muted-foreground">
                  Income, Expenses & Savings over 12 months
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
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">Savings</span>
                </div>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.monthlyTrend}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
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
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#2563EB"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* AI Insights */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-violet-500" />
            AI Insights
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {aiInsights.map((insight, i) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card
                  className={`flex items-start gap-4 border-l-4 p-5 ${insightStyles[insight.type]}`}
                >
                  <div
                    className={`shrink-0 rounded-lg p-2 ${insightIconStyles[insight.type]}`}
                  >
                    <insight.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{insight.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
