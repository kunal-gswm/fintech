"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  FileDown,
  FileText,
  TrendingUp,
  Wallet,
  CreditCard,
  PiggyBank,
  Lightbulb,
} from "lucide-react";
import { getReports } from "@/services/reports.service";
import { getAnalytics } from "@/services/analytics.service";
import type { Report, MonthlyData } from "@/types";
import { SkeletonCard, SkeletonChart } from "@/components/ui/skeleton-loaders";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [activeChartData, setActiveChartData] = useState<MonthlyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getReports(), getAnalytics()]).then(([reportsData, analyticsData]) => {
      setReports(reportsData);
      if (reportsData.length > 0) setSelectedReport(reportsData[0]);
      const formattedData = (analyticsData.monthlyTrend || []).map((m: {month: string; income: number; expenses: number}) => ({
        ...m,
        savings: m.income - m.expenses,
      }));
      setChartData(formattedData);
      if (formattedData.length > 0) setActiveChartData(formattedData[formattedData.length - 1]);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Reports" description="Monthly financial reports with AI-powered insights." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonChart />
      </div>
    );
  }

  if (!selectedReport) {
    return <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground"><FileText className="h-8 w-8 opacity-50" /><p>No reports available.</p></div>;
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Reports"
          description="Monthly financial reports with AI-powered insights."
        >
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <FileDown className="h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </PageHeader>

        {/* Month Selector */}
        <Select
          value={selectedReport.id}
          onValueChange={(v) => {
            const report = reports.find((r) => r.id === v);
            if (report) setSelectedReport(report);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {reports.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.month} {r.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Income",
              value: selectedReport.totalIncome,
              icon: Wallet,
              color: "text-blue-600",
              bg: "bg-blue-500/10",
            },
            {
              title: "Total Expenses",
              value: selectedReport.totalExpenses,
              icon: CreditCard,
              color: "text-amber-600",
              bg: "bg-amber-500/10",
            },
            {
              title: "Total Savings",
              value: selectedReport.totalSavings,
              icon: PiggyBank,
              color: "text-emerald-600",
              bg: "bg-emerald-500/10",
            },
            {
              title: "Savings Rate",
              value: selectedReport.savingsRate,
              icon: TrendingUp,
              color: "text-violet-600",
              bg: "bg-violet-500/10",
              suffix: "%",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="p-5">
                <div className={`mb-3 inline-flex rounded-xl p-2.5 ${item.bg}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <p className="mt-1 text-2xl font-bold">
                  {item.suffix
                    ? `${item.value}${item.suffix}`
                    : `₹${item.value.toLocaleString("en-IN")}`}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <Card className="flex flex-col overflow-hidden">
          {activeChartData && (
            <motion.div 
              key={activeChartData.month}
              initial={{ backgroundColor: "rgba(10,10,10,0)" }}
              animate={{ backgroundColor: "rgba(38,38,38,0.2)" }}
              className="flex items-center justify-between border-b border-[#262626] bg-[#0A0A0A] px-4 py-3"
            >
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Month</span>
                <span className="font-semibold text-[#E2E8F0]">{activeChartData.month}</span>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div className="flex flex-col">
                  <span className="text-xs text-blue-500">Income</span>
                  <span className="font-bold text-[#E2E8F0]">₹{(activeChartData.income / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-amber-500">Expense</span>
                  <span className="font-bold text-[#E5B80B]">₹{(activeChartData.expenses / 1000).toFixed(1)}k</span>
                </div>
              </div>
            </motion.div>
          )}
          <div className="p-6">
            <h3 className="text-sm font-semibold">6-Month Overview</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Tap a bar to see details
            </p>
            <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
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
                <Bar
                  dataKey="income"
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                  onClick={(data) => setActiveChartData(data)}
                  onMouseEnter={(data) => setActiveChartData(data)}
                  style={{ cursor: "pointer" }}
                />
                <Bar
                  dataKey="expenses"
                  fill="#F59E0B"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                  onClick={(data) => setActiveChartData(data)}
                  onMouseEnter={(data) => setActiveChartData(data)}
                  style={{ cursor: "pointer" }}
                />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Insights */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Key Insights — {selectedReport.month}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {selectedReport.insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="flex items-start gap-3 p-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
