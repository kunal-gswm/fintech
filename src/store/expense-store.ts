import { create } from "zustand";
import type { Expense } from "@/types";
import { getExpenses, createExpense, updateExpense as apiUpdateExpense, deleteExpense as apiDeleteExpense } from "@/services/expenses.service";

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  isLoading: false,
  fetchExpenses: async () => {
    set({ isLoading: true });
    try {
      const data = await getExpenses();
      set({ expenses: data });
    } catch (e) {
      console.error(e);
    } finally {
      set({ isLoading: false });
    }
  },
  addExpense: async (expenseData) => {
    const newExpense = await createExpense(expenseData);
    set((state) => ({ expenses: [newExpense, ...state.expenses] }));
  },
  updateExpense: async (id, updates) => {
    const updated = await apiUpdateExpense(id, updates);
    set((state) => ({
      expenses: state.expenses.map((e) =>
        e.id === id ? { ...e, ...updated } : e
      ),
    }));
  },
  deleteExpense: async (id) => {
    await apiDeleteExpense(id);
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    }));
  },
}));
