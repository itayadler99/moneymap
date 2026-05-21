export type CategoryType = "fixed" | "variable" | "income";

export type Category = {
  id: string;
  user_id: string | null;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
};

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category_id: string;
  description: string | null;
  date: string;
  is_recurring: boolean;
  created_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  category_id: string;
  monthly_limit: number;
  month: string;
};

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  monthly_income_avg: number | null;
  primary_goal: string | null;
  created_at: string;
};
