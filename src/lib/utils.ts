import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatILS(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function currentMonthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
  });
}

export function previousMonth(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const d = new Date(year, month - 2);
  return currentMonthKey(d);
}

export function nextMonth(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const d = new Date(year, month);
  return currentMonthKey(d);
}
