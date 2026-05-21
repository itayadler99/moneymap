import { formatILS } from "./utils";

export type InsightInput = {
  income: number;
  expenses: number;
  prevExpenses: number | null;
  topCategoryName: string | null;
  topCategoryAmount: number;
  topCategoryPrevAmount: number | null;
  daysIntoMonth: number;
  daysInMonth: number;
};

export function generateInsight(i: InsightInput): string {
  const remaining = i.income - i.expenses;

  // Insight 1: month-over-month spike in top category
  if (
    i.topCategoryName &&
    i.topCategoryPrevAmount &&
    i.topCategoryPrevAmount > 0 &&
    i.topCategoryAmount > i.topCategoryPrevAmount * 1.15
  ) {
    const pct = Math.round(
      ((i.topCategoryAmount - i.topCategoryPrevAmount) / i.topCategoryPrevAmount) * 100
    );
    return `הוצאת החודש ${pct}% יותר על ${i.topCategoryName} מהחודש הקודם. שווה לבדוק.`;
  }

  // Insight 2: pace warning
  if (i.income > 0 && i.daysIntoMonth >= 5) {
    const monthlyPace = (i.expenses / i.daysIntoMonth) * i.daysInMonth;
    if (monthlyPace > i.income * 1.05) {
      return `בקצב הנוכחי תוציא כ-${formatILS(monthlyPace)} החודש — יותר מההכנסה שלך. כדאי להאט.`;
    }
  }

  // Insight 3: healthy savings
  if (i.income > 0 && remaining > 0) {
    const savingsRate = Math.round((remaining / i.income) * 100);
    if (savingsRate >= 20) {
      return `כל הכבוד — חסכת ${savingsRate}% מההכנסה החודש (${formatILS(remaining)}). המשך ככה.`;
    }
    if (savingsRate > 0) {
      return `נשארו לך ${formatILS(remaining)} החודש. נסה להגדיל ל-20% חיסכון.`;
    }
  }

  // Insight 4: no data yet
  if (i.expenses === 0) {
    return "התחל בהוספת ההוצאה הראשונה — כפתור הפלוס למטה.";
  }

  // Fallback
  return `הוצאת ${formatILS(i.expenses)} החודש. המשך לעקוב.`;
}
