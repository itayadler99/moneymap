import type { CategoryType } from "./types";

export type DefaultCategory = {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
};

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { name: "משכורת", icon: "💼", color: "#10b981", type: "income" },
  { name: "הכנסה נוספת", icon: "💰", color: "#22c55e", type: "income" },
  { name: "שכירות/משכנתא", icon: "🏠", color: "#0ea5e9", type: "fixed" },
  { name: "חשבונות", icon: "📑", color: "#6366f1", type: "fixed" },
  { name: "ביטוחים", icon: "🛡️", color: "#8b5cf6", type: "fixed" },
  { name: "רכב", icon: "🚗", color: "#ec4899", type: "fixed" },
  { name: "אוכל וקניות", icon: "🛒", color: "#f59e0b", type: "variable" },
  { name: "מסעדות", icon: "🍽️", color: "#ef4444", type: "variable" },
  { name: "בילויים", icon: "🎬", color: "#f97316", type: "variable" },
  { name: "בריאות", icon: "💊", color: "#14b8a6", type: "variable" },
  { name: "חינוך", icon: "📚", color: "#3b82f6", type: "variable" },
  { name: "אחר", icon: "📦", color: "#64748b", type: "variable" },
];
