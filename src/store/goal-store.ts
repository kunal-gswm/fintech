import { create } from "zustand";
import type { Goal } from "@/types";
import { getGoals, createGoal, updateGoal as apiUpdateGoal, deleteGoal as apiDeleteGoal } from "@/services/goals.service";

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, "id">) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  isLoading: false,
  fetchGoals: async () => {
    set({ isLoading: true });
    try {
      const data = await getGoals();
      set({ goals: data });
    } catch (e) {
      console.error(e);
    } finally {
      set({ isLoading: false });
    }
  },
  addGoal: async (goalData) => {
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
