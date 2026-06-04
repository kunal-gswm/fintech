import { create } from "zustand";
import type { Goal } from "@/types";
import { getGoals, createGoal, updateGoal as apiUpdateGoal, deleteGoal as apiDeleteGoal } from "@/services/goals.service";

export type LoadingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "refreshing" }
  | { status: "success" }
  | { status: "error"; error: string }
  | { status: "empty" };

interface GoalState {
  goals: Goal[];
  loadingState: LoadingState;
  abortController: AbortController | null;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, "id">) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  loadingState: { status: "idle" },
  abortController: null,
  fetchGoals: async () => {
    const { abortController, goals } = get();
    // Cancel any in-flight request
    if (abortController) {
      abortController.abort();
    }

    const controller = new AbortController();
    set({ 
      abortController: controller, 
      loadingState: { status: goals.length > 0 ? "refreshing" : "loading" } 
    });

    try {
      // NOTE: getGoals would need to accept a signal. We assume apiClient is used underneath.
      const data = await getGoals(); 
      if (controller.signal.aborted) return;
      
      set({ 
        goals: data, 
        loadingState: { status: data.length === 0 ? "empty" : "success" },
        abortController: null 
      });
    } catch (e) {
      const error = e as Error;
      if (controller.signal.aborted) return;
      set({ 
        loadingState: { status: "error", error: error.message || "Failed to fetch goals" },
        abortController: null
      });
    }
  },
  addGoal: async (goalData) => {
    // Ideally use a separate mutation state, keeping simple here
    const newGoal = await createGoal(goalData);
    set((state) => ({ goals: [...state.goals, newGoal] }));
  },
  updateGoal: async (id, updates) => {
    const updated = await apiUpdateGoal(id, updates);
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updated } : g)),
    }));
  },
  deleteGoal: async (id) => {
    await apiDeleteGoal(id);
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
  },
}));
