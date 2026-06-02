import { apiClient } from "@/lib/api-client";

export async function getProfile(): Promise<{name: string; email: string; monthlyIncome: number; riskProfile: string}> {
  return apiClient<{name: string; email: string; monthlyIncome: number; riskProfile: string}>("/api/profile");
}

export async function updateProfile(data: Partial<{name: string; email: string; monthlyIncome: number; riskProfile: string}>): Promise<{name: string; email: string; monthlyIncome: number; riskProfile: string}> {
  return apiClient<{name: string; email: string; monthlyIncome: number; riskProfile: string}>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
