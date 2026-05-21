"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_CATEGORIES, type DefaultCategory } from "./categories";

export type Category = DefaultCategory & {
  id: string;
};

export type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category_id: string;
  description: string | null;
  date: string;
  created_at: string;
};

export type Budget = {
  id: string;
  category_id: string;
  monthly_limit: number;
  month: string;
};

export type Goal = {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  created_at: string;
};

export type Profile = {
  name: string | null;
  monthly_income_avg: number | null;
  primary_goal: string | null;
  onboarded: boolean;
};

type State = {
  profile: Profile;
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  _hydrated: boolean;
};

type Actions = {
  setProfile: (p: Partial<Profile>) => void;
  completeOnboarding: (data: {
    name: string;
    monthly_income_avg: number | null;
    primary_goal: string | null;
  }) => void;
  addTransaction: (t: Omit<Transaction, "id" | "created_at">) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (category_id: string, month: string, limit: number) => void;
  addGoal: (g: Omit<Goal, "id" | "created_at">) => void;
  updateGoalProgress: (id: string, delta: number) => void;
  deleteGoal: (id: string) => void;
  resetAll: () => void;
};

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const seedCategories = (): Category[] =>
  DEFAULT_CATEGORIES.map((c) => ({ ...c, id: newId() }));

const initialState: State = {
  profile: {
    name: null,
    monthly_income_avg: null,
    primary_goal: null,
    onboarded: false,
  },
  categories: [],
  transactions: [],
  budgets: [],
  goals: [],
  _hydrated: false,
};

export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,

      setProfile: (p) =>
        set((s) => ({ profile: { ...s.profile, ...p } })),

      completeOnboarding: (data) =>
        set((s) => ({
          profile: {
            ...s.profile,
            name: data.name,
            monthly_income_avg: data.monthly_income_avg,
            primary_goal: data.primary_goal,
            onboarded: true,
          },
          categories: s.categories.length === 0 ? seedCategories() : s.categories,
        })),

      addTransaction: (t) =>
        set((s) => ({
          transactions: [
            {
              ...t,
              id: newId(),
              created_at: new Date().toISOString(),
            },
            ...s.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      setBudget: (category_id, month, limit) =>
        set((s) => {
          const existing = s.budgets.find(
            (b) => b.category_id === category_id && b.month === month
          );
          if (limit <= 0) {
            return {
              budgets: s.budgets.filter(
                (b) => !(b.category_id === category_id && b.month === month)
              ),
            };
          }
          if (existing) {
            return {
              budgets: s.budgets.map((b) =>
                b.id === existing.id ? { ...b, monthly_limit: limit } : b
              ),
            };
          }
          return {
            budgets: [
              ...s.budgets,
              {
                id: newId(),
                category_id,
                monthly_limit: limit,
                month,
              },
            ],
          };
        }),

      addGoal: (g) =>
        set((s) => ({
          goals: [
            {
              ...g,
              id: newId(),
              created_at: new Date().toISOString(),
            },
            ...s.goals,
          ],
        })),

      updateGoalProgress: (id, delta) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id
              ? {
                  ...g,
                  current_amount: Math.max(0, g.current_amount + delta),
                }
              : g
          ),
        })),

      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      resetAll: () => set({ ...initialState, _hydrated: true }),
    }),
    {
      name: "moneymap-v1",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    }
  )
);

export function useHydrated() {
  return useStore((s) => s._hydrated);
}
