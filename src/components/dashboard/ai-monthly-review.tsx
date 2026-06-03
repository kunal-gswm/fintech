"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { useExpenseStore } from "@/store/expense-store";
import { generateMonthlyReview } from "@/services/chat.service";

interface ReviewData {
  summary: string;
  biggestWin: string;
  warningArea: string;
  actionItem: string;
}

export function AiMonthlyReview() {
  const { expenses } = useExpenseStore();
  const [review, setReview] = useState<ReviewData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We analyze the previous month using native Date
  const prevMonthDate = new Date();
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  const monthName = prevMonthDate.toLocaleString("default", { month: "long" });
  const year = prevMonthDate.getFullYear();
  const cacheKey = `ai_review_${monthName}_${year}`;

  useEffect(() => {
    // Check if we already have a generated review for this past month
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setReview(JSON.parse(cached));
      } catch (e) {
        console.error("Failed to parse cached AI review", e);
      }
    }
  }, [cacheKey]);

  const handleGenerateReview = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Start of month
      const start = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), 1);
      // End of month
      const end = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 0, 23, 59, 59, 999);

      const prevMonthExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d >= start && d <= end;
      });

      const totalSpent = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

      // Determine Top Category
      const categoryTotals: Record<string, number> = {};
      prevMonthExpenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      });
      let topCategory = "None";
      let maxCatAmount = 0;
      for (const [cat, amt] of Object.entries(categoryTotals)) {
        if (amt > maxCatAmount) {
          maxCatAmount = amt;
          topCategory = cat;
        }
      }

      // Fixed Income Baseline
      const INCOME = 85000;
      const savingsRate = Math.max(0, ((INCOME - totalSpent) / INCOME) * 100).toFixed(1) + "%";

      const contextData = {
        month: monthName,
        income: INCOME,
        spent: totalSpent,
        topCategory,
        savingsRate
      };

      const result = await generateMonthlyReview(JSON.stringify(contextData));

      if (result && result.summary && result.actionItem) {
        setReview(result);
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } else {
        setError("AI generated an invalid response. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate review. Check your connection or API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!review) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Sparkles className="w-24 h-24 text-primary" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {monthName} Financial Review
            </h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Your month has concluded. Let our on-device AI analyze your ledger to highlight wins, flag warnings, and plan for the next month.
            </p>
          </div>
          <Button 
            onClick={handleGenerateReview} 
            disabled={isGenerating || expenses.length === 0}
            className="shrink-0 gap-2 font-medium"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Auditing Ledger...
              </>
            ) : (
              <>
                Generate {monthName} Review
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive mt-4 relative z-10">{error}</p>}
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-primary/20 shadow-md shadow-primary/5">
      <div className="bg-muted/50 p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          {monthName} AI Audit
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
          Auto-Generated
        </span>
      </div>
      
      <div className="p-5 space-y-6">
        <p className="text-sm leading-relaxed text-foreground/90">
          {review.summary}
        </p>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold mb-2 text-sm">
              <Trophy className="w-4 h-4" />
              Biggest Win
            </div>
            <p className="text-sm text-emerald-900 dark:text-emerald-100/80 leading-relaxed">
              {review.biggestWin}
            </p>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold mb-2 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Area of Improvement
            </div>
            <p className="text-sm text-amber-900 dark:text-amber-100/80 leading-relaxed">
              {review.warningArea}
            </p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-1 text-sm">
            <ArrowRight className="w-4 h-4" />
            Action Item
          </div>
          <p className="text-sm text-blue-900 dark:text-blue-100/80">
            {review.actionItem}
          </p>
        </div>
      </div>
    </Card>
  );
}
