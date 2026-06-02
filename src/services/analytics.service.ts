import { apiClient } from "@/lib/api-client";

export async function getAnalytics(): Promise<{totalSpent: number; categoryBreakdown: {name: string; value: number}[]; monthlyTrend: {month: string; income: number; expenses: number}[]}> {
  return apiClient<{totalSpent: number; categoryBreakdown: {name: string; value: number}[]; monthlyTrend: {month: string; income: number; expenses: number}[]}>("/api/analytics");
};
