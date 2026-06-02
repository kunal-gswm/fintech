import { apiClient } from "@/lib/api-client";
import type { Report } from "@/types";

export const getReports = () => {
  return apiClient<Report[]>("/api/reports");
};
