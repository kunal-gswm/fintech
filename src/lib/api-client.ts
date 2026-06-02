import { getLocalData, setLocalData } from "./local-db";
import { generateExpenseAnalytics } from "./engines/analytics";
import { calculateHealthScore } from "./engines/health";
import type { Expense, Goal } from "@/types";

export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export class TimeoutError extends Error {
  constructor(message = "Request timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

export class DataShapeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataShapeError";
  }
}

export interface ApiClientOptions extends RequestInit {
  timeout?: number;
}

export async function apiClient<T>(url: string, options?: ApiClientOptions): Promise<T> {
  const method = options?.method || "GET";
  // Determine route
  const urlObj = url.startsWith("http") ? new URL(url) : new URL(url, "http://localhost");
  const path = urlObj.pathname;
  const searchParams = urlObj.searchParams;

  // Mock latency for realism
  await new Promise((res) => setTimeout(res, 200));

  if (path.startsWith("/api/expenses")) {
    const expenses = getLocalData<any[]>("expenses");
    if (method === "GET") return expenses as T;
    if (method === "POST") {
      const body = JSON.parse(options?.body as string);
      const newExp = { id: Date.now().toString(), ...body };
      setLocalData("expenses", [newExp, ...expenses]);
      return newExp as T;
    }
    if (method === "PUT") {
      const id = path.split("/").pop();
      const body = JSON.parse(options?.body as string);
      const updated = expenses.map((e) => (e.id === id ? { ...e, ...body } : e));
      setLocalData("expenses", updated);
      return body as T;
    }
    if (method === "DELETE") {
      const id = path.split("/").pop();
      const filtered = expenses.filter((e) => e.id !== id);
      setLocalData("expenses", filtered);
      return { message: "Deleted" } as T;
    }
  }

  if (path.startsWith("/api/goals")) {
    const goals = getLocalData<any[]>("goals");
    if (method === "GET") return goals as T;
    if (method === "POST") {
      const body = JSON.parse(options?.body as string);
      const newGoal = { id: Date.now().toString(), ...body };
      setLocalData("goals", [...goals, newGoal]);
      return newGoal as T;
    }
    if (method === "PUT") {
      const id = path.split("/").pop();
      const body = JSON.parse(options?.body as string);
      const updated = goals.map((g) => (g.id === id ? { ...g, ...body } : g));
      setLocalData("goals", updated);
      return body as T;
    }
    if (method === "DELETE") {
      const id = path.split("/").pop();
      const filtered = goals.filter((g) => g.id !== id);
      setLocalData("goals", filtered);
      return { message: "Deleted" } as T;
    }
  }

  if (path.startsWith("/api/articles")) {
    const articles = getLocalData<any[]>("articles");
    if (method === "GET") {
      const slug = path.split("/").pop();
      if (slug && slug !== "articles") {
        const article = articles.find((a) => a.slug === slug);
        const related = articles.filter((a) => article?.relatedSlugs?.includes(a.slug));
        return { article, related } as T;
      }
      return articles as T;
    }
    if (method === "PATCH") {
      const slug = path.split("/").pop();
      const body = JSON.parse(options?.body as string);
      const updated = articles.map((a) => (a.slug === slug ? { ...a, ...body } : a));
      setLocalData("articles", updated);
      return body as T;
    }
  }

  if (path.startsWith("/api/reports")) {
    const reports = getLocalData<any[]>("reports");
    if (method === "GET") return reports as T;
  }

  if (path.startsWith("/api/profile")) {
    const profile = getLocalData<any>("profile");
    if (method === "GET") return profile as T;
    if (method === "PUT") {
      const body = JSON.parse(options?.body as string);
      const updated = { ...profile, ...body };
      setLocalData("profile", updated);
      return updated as T;
    }
  }

  if (path.startsWith("/api/ai/chat")) {
    const history = getLocalData<any[]>("chat-history");
    if (method === "GET") return history as T;
    if (method === "POST") {
      const body = JSON.parse(options?.body as string);
      const userMsg = { id: Date.now().toString(), role: "user", content: body.message, timestamp: new Date().toISOString() };
      const aiMsg = { id: (Date.now() + 1).toString(), role: "assistant", content: "I am running offline in Capacitor. I cannot connect to Ollama.", timestamp: new Date().toISOString() };
      setLocalData("chat-history", [...history, userMsg, aiMsg]);
      return aiMsg as T;
    }
  }

  if (path.startsWith("/api/analytics")) {
    const expenses = getLocalData<Expense[]>("expenses");
    const month = searchParams.get("month");
    const filtered = month && month !== "All" ? expenses.filter(e => new Date(e.date).toLocaleString('default', { month: 'short' }) === month) : expenses;
    const analytics = generateExpenseAnalytics(filtered);
    const monthlyTrend = [
      { month: "Jul", income: 5200, expenses: 3500 },
      { month: "Aug", income: 5500, expenses: 4100 },
      { month: "Sep", income: 6100, expenses: 4000 },
      { month: "Oct", income: 5800, expenses: 3900 },
      { month: "Nov", income: 7200, expenses: 5100 },
      { month: "Dec", income: 7800, expenses: 6200 },
      { month: "Jan", income: 6500, expenses: 4800 },
      { month: "Feb", income: 5900, expenses: 4200 },
      { month: "Mar", income: 6200, expenses: 4700 },
      { month: "Apr", income: 7100, expenses: 5200 },
      { month: "May", income: 7600, expenses: 4900 },
      { month: "Jun", income: 7900, expenses: 5100 },
    ];
    return {
      totalSpent: analytics.totalSpending,
      topCategory: analytics.largestCategory?.name || "None",
      monthlyTrend,
      categoryBreakdown: analytics.categories,
    } as T;
  }

  if (path.startsWith("/api/health")) {
    const profile = getLocalData<any>("profile");
    const expenses = getLocalData<Expense[]>("expenses");
    const goals = getLocalData<Goal[]>("goals");

    const monthlyIncome = typeof profile.monthlyIncome === "number" ? profile.monthlyIncome : 85000;
    const monthlyExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const emergencyGoals = goals.filter(g => g.title.toLowerCase().includes("emergency"));
    const totalEmergencySavings = emergencyGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalGoalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalGoalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalGoalProgress = totalGoalTarget > 0 ? (totalGoalCurrent / totalGoalTarget) : 0;

    const health = calculateHealthScore(monthlyIncome, monthlyExpenses, totalEmergencySavings, totalGoalProgress);
    const recommendations = [];
    if (health.riskLevel === "High") {
      recommendations.push("Your expenses are consuming a large portion of your income.");
      recommendations.push("Consider building up your emergency fund to at least 6 months of expenses.");
    } else if (health.riskLevel === "Moderate") {
      recommendations.push("You are on track, but could optimize your savings rate.");
    } else {
      recommendations.push("Excellent financial health! Keep up the good work.");
    }

    const savingsPct = Math.round(health.details.savingsRate * 100);
    const emMonths = Math.round(health.details.emergencyMonths * 10) / 10;

    const metrics = [
      {
        title: "Savings Rate",
        score: health.details.savingsScore,
        maxScore: 40,
        displayValue: `${savingsPct > 0 ? savingsPct : 0}%`,
        status: health.details.savingsScore >= 40 ? "excellent" : health.details.savingsScore >= 20 ? "good" : health.details.savingsScore > 0 ? "fair" : "poor",
        description: "Percentage of income saved",
        icon: "PiggyBank",
      },
      {
        title: "Emergency Fund",
        score: health.details.emergencyScore,
        maxScore: 40,
        displayValue: `${emMonths} months`,
        status: health.details.emergencyScore >= 40 ? "excellent" : health.details.emergencyScore >= 20 ? "good" : health.details.emergencyScore > 0 ? "fair" : "poor",
        description: "Months of living expenses",
        icon: "ShieldAlert",
      },
    ];

    return {
      score: health.score,
      riskLevel: health.riskLevel,
      recommendations,
      metrics
    } as T;
  }

  throw new ApiError(`Route not mocked offline: ${url}`, 404);
}
