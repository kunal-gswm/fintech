import { apiClient } from "@/lib/api-client";
import type { HealthMetric } from "@/types";

export async function getHealth(): Promise<{score: number; metrics: HealthMetric[]; recommendations: string[]}> {
  return apiClient<{score: number; metrics: HealthMetric[]; recommendations: string[]}>("/api/health");
};
