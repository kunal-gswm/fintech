import { apiClient } from "@/lib/api-client";
import type { Goal } from "@/types";

export const getGoals = () => {
  return apiClient<Goal[]>("/api/goals");
};

export const createGoal = (data: Omit<Goal, "id">) => {
  return apiClient<Goal>("/api/goals", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateGoal = (id: string, data: Partial<Goal>) => {
  return apiClient<Goal>(`/api/goals/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteGoal = (id: string) => {
  return apiClient<{ message: string }>(`/api/goals/${id}`, {
    method: "DELETE",
  });
};
