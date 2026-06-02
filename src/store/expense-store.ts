import { create } from "zustand";
import type { Expense } from "@/types";
import { getExpenses, createExpense, updateExpense as apiUpdateExpense, deleteExpense as apiDeleteExpense } from "@/services/expenses.service";

export type LoadingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "refreshing" }
  | { status: "success" }
  | { status: "error"; error: string }
  | { status: "empty" };

interface ExpenseState {
  expenses: Expense[];
  loadingState: LoadingState;
  abortController: AbortController | null;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  loadingState: { status: "idle" },
  abortController: null,
  fetchExpenses: async () => {
    const { abortController, expenses } = get();
    if (abortController) abortController.abort();

    const controller = new AbortController();
    set({
      abortController: controller,
      loadingState: { status: expenses.length > 0 ? "refreshing" : "loading" },
    });

    try {
      const data = await getExpenses();
      if (controller.signal.aborted) return;
      set({ 
        expenses: data, 
        loadingState: { status: data.length === 0 ? "empty" : "success" },
        abortController: null
      });
    } catch (e: any) {
      if (controller.signal.aborted) return;
      set({ 
        loadingState: { status: "error", error: e.message || "Failed to fetch expenses" },
        abortController: null
      });
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
