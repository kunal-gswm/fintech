import { NextResponse } from "next/server";
import { readData } from "@/lib/db";
import { calculateHealthScore } from "@/lib/engines/health";
import type { Expense, Goal } from "@/types";

const PROFILE_FILE = "profile.json";
const EXPENSES_FILE = "expenses.json";
const GOALS_FILE = "goals.json";

export async function GET() {
  try {
    const profile = await readData<Record<string, unknown>>(PROFILE_FILE).catch(() => ({ monthlyIncome: 85000 }));
    const expenses = await readData<Expense[]>(EXPENSES_FILE).catch(() => []);
    const goals = await readData<Goal[]>(GOALS_FILE).catch(() => []);

    const monthlyIncome = typeof profile.monthlyIncome === "number" ? profile.monthlyIncome : 85000;
    
    // Simple sum of all expenses (assuming they are all from the current month for this mock)
    const monthlyExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Find emergency fund savings
    const emergencyGoals = goals.filter(g => g.title.toLowerCase().includes("emergency"));
    const totalEmergencySavings = emergencyGoals.reduce((sum, g) => sum + g.currentAmount, 0);

    // Calculate total goal progress
    const totalGoalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalGoalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalGoalProgress = totalGoalTarget > 0 ? (totalGoalCurrent / totalGoalTarget) : 0;

    const health = calculateHealthScore(
      monthlyIncome,
      monthlyExpenses,
      totalEmergencySavings,
      totalGoalProgress
    );

    const recommendations = [];
    if (health.riskLevel === "High") {
      recommendations.push("Your expenses are consuming a large portion of your income.");
      recommendations.push("Consider building up your emergency fund to at least 6 months of expenses.");
    } else if (health.riskLevel === "Moderate") {
      recommendations.push("You are on track, but could optimize your savings rate.");
    } else {
      recommendations.push("Excellent financial health! Keep up the good work.");
    }

    const metrics = [
      {
        title: "Savings Rate",
        score: Math.floor(health.score * 0.9),
        maxScore: 100,
        status: health.score > 80 ? "excellent" : health.score > 50 ? "good" : "fair",
        description: "Percentage of income saved",
        icon: "PiggyBank",
      },
      {
        title: "Emergency Fund",
        score: Math.floor(health.score * 0.8),
        maxScore: 100,
        status: health.score > 70 ? "good" : "fair",
        description: "Months of living expenses",
        icon: "ShieldAlert",
      },
    ];

    return NextResponse.json({
      score: health.score,
      riskLevel: health.riskLevel,
      recommendations,
      metrics
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate health score" }, { status: 500 });
  }
}


