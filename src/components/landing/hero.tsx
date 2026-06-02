"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  PiggyBank,
  CreditCard,
  HeartPulse,
  Wallet,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-16 md:pt-28 md:pb-24">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-primary/5 blur-[120px] rounded-full" />

      <div className="container relative mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              AI-Powered Financial Insights
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Make Better{" "}
              <span className="text-primary">Financial Decisions.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-muted-foreground leading-relaxed">
              Track expenses, learn investing, plan goals, and get AI-powered
              financial guidance — all in one elegant platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "h-12 px-8 text-base" })}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#features"
                className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 px-8 text-base" })}
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-8">
              {[
                { value: "50K+", label: "Active Users" },
                { value: "₹200Cr+", label: "Tracked" },
                { value: "4.9★", label: "App Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-primary/5">
              {/* Mini header */}
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-muted-foreground">
                  AI Finance Dashboard
                </span>
              </div>

              {/* KPI row */}
              <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                  {
                    icon: Wallet,
                    label: "Income",
                    value: "₹85,000",
                    color: "text-primary",
                    bg: "bg-primary/10",
                  },
                  {
                    icon: CreditCard,
                    label: "Expenses",
                    value: "₹42,350",
                    color: "text-amber-600",
                    bg: "bg-amber-500/10",
                  },
                  {
                    icon: PiggyBank,
                    label: "Savings",
                    value: "₹42,650",
                    color: "text-emerald-600",
                    bg: "bg-emerald-500/10",
                  },
                ].map((kpi, i) => (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="rounded-xl border border-border bg-background p-3"
                  >
                    <div className={`mb-1 inline-flex rounded-lg p-1.5 ${kpi.bg}`}>
                      <kpi.icon className={`h-3.5 w-3.5 ${kpi.color}`} />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {kpi.label}
                    </div>
                    <div className="text-sm font-semibold">{kpi.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium">Monthly Trend</span>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div className="flex items-end gap-1.5 h-20">
                  {[40, 55, 35, 60, 45, 70, 50, 75, 55, 80, 65, 72].map(
                    (h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ delay: 0.7 + i * 0.05, duration: 0.8 }}
                        className="w-full flex-1 rounded-sm bg-primary/20"
                      >
                        <div
                          className="w-full rounded-sm bg-primary"
                          style={{ height: `${60 + (i % 3) * 15}%` }}
                        />
                      </motion.div>
                    )
                  )}
                </div>
              </div>

              {/* Health Score */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                <div className="relative h-12 w-12">
                  <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="3"
                    />
                    <motion.path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="3"
                      strokeDasharray="78, 100"
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: "78, 100" }}
                      transition={{ delay: 1.2, duration: 1 }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    78
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium flex items-center gap-1.5">
                    <HeartPulse className="h-3.5 w-3.5 text-primary" />
                    Financial Health
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Good — above average
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative blur */}
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
