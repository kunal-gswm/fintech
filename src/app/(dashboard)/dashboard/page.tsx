"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/shared/page-transition";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { KPICards } from "@/components/dashboard/kpi-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AiMonthlyReview } from "@/components/dashboard/ai-monthly-review";
import { ArrowRight, Quote } from "lucide-react";
import { FINANCIAL_QUOTES } from "@/lib/quotes";

function QuoteCard() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Select a random quote on mount
    const randomIndex = Math.floor(Math.random() * FINANCIAL_QUOTES.length);
    setQuote(FINANCIAL_QUOTES[randomIndex]);
  }, []);

  if (!quote) return <div className="h-24 animate-pulse bg-muted rounded-2xl"></div>;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border shadow-sm p-6 sm:p-8">
      <Quote className="absolute -top-2 -left-2 h-16 w-16 text-primary/10 rotate-180" />
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <p className="font-serif text-lg sm:text-xl font-medium leading-relaxed tracking-wide text-foreground italic max-w-2xl">
          {quote}
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-8 pb-4">
        
        {/* Minimalist Quote Header */}
        <QuoteCard />

        {/* AI Monthly Review Section */}
        <div className="px-1">
          <ErrorBoundary fallbackMessage="Failed to load AI Monthly Review">
            <AiMonthlyReview />
          </ErrorBoundary>
        </div>

        {/* KPI Cards Container */}
        <div className="pt-2">
          <div className="mb-4 flex items-center justify-between px-2">
            <h2 className="text-xl font-bold tracking-tight">Overview</h2>
          </div>
          <ErrorBoundary fallbackMessage="Failed to load Key Performance Indicators">
            <KPICards />
          </ErrorBoundary>
        </div>

        {/* Activity Feed Container */}
        <div className="grid gap-6 pt-2">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
            <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline group">
              View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <ErrorBoundary fallbackMessage="Failed to load Activity Feed">
            <ActivityFeed />
          </ErrorBoundary>
        </div>
      </div>
    </PageTransition>
  );
}
