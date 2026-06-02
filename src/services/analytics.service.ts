import { apiClient } from "@/lib/api-client";

export async function getAnalytics(month?: string): Promise<{totalSpent: number; categoryBreakdown: {name: string; value: number}[]; monthlyTrend: {month: string; income: number; expenses: number}[]}> {
  const url = month && month !== "All" ? `/api/analytics?month=${month}` : "/api/analytics";
  return apiClient<{totalSpent: number; categoryBreakdown: {name: string; value: number}[]; monthlyTrend: {month: string; income: number; expenses: number}[]}>(url);
};
