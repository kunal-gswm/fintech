import { apiClient } from "@/lib/api-client";
import type { Expense } from "@/types";

export const getExpenses = () => {
  return apiClient<Expense[]>("/api/expenses");
};

export const createExpense = (data: Omit<Expense, "id">) => {
  return apiClient<Expense>("/api/expenses", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateExpense = (id: string, data: Partial<Expense>) => {
  return apiClient<Expense>(`/api/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteExpense = (id: string) => {
  return apiClient<{ message: string }>(`/api/expenses/${id}`, {
    method: "DELETE",
  });
};
