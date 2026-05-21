"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { currentMonthKey, formatILS, monthLabel } from "@/lib/utils";
import { useStore } from "@/lib/store";

export default function BudgetsPage() {
  const month = currentMonthKey();
  const categories = useStore((s) => s.categories);
  const transactions = useStore((s) => s.transactions);
  const budgets = useStore((s) => s.budgets);
  const setBudget = useStore((s) => s.setBudget);

  const spendingByCategory = useMemo(() => {
    const [y, mo] = month.split("-").map(Number);
    const start = `${month}-01`;
    const end = new Date(y, mo, 0).toISOString().slice(0, 10);
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      if (t.date < start || t.date > end) continue;
      map.set(t.category_id, (map.get(t.category_id) ?? 0) + t.amount);
    }
    return map;
  }, [transactions, month]);

  const budgetMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of budgets) {
      if (b.month === month) map.set(b.category_id, b.monthly_limit);
    }
    return map;
  }, [budgets, month]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">תקציב חודשי</h1>
      <p className="text-sm text-slate-500 mb-4">
        {monthLabel(month)} · קבע מגבלה לכל קטגוריה. השאר 0 כדי לבטל.
      </p>

      <div className="space-y-3">
        {categories
          .filter((c) => c.type !== "income")
          .map((c) => (
            <BudgetCard
              key={c.id}
              category={c}
              limit={budgetMap.get(c.id) ?? 0}
              spent={spendingByCategory.get(c.id) ?? 0}
              onSave={(limit) => setBudget(c.id, month, limit)}
            />
          ))}
      </div>
    </div>
  );
}

function BudgetCard({
  category,
  limit,
  spent,
  onSave,
}: {
  category: { id: string; name: string; icon: string; color: string };
  limit: number;
  spent: number;
  onSave: (limit: number) => void;
}) {
  const [value, setValue] = useState(limit > 0 ? String(limit) : "");
  const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
  const over = limit > 0 && spent > limit;
  const near = limit > 0 && spent > limit * 0.8 && !over;

  return (
    <Card>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ background: `${category.color}20` }}
        >
          {category.icon}
        </div>
        <div className="flex-1">
          <div className="font-medium">{category.name}</div>
          {limit > 0 && (
            <div
              className={`text-xs ${
                over ? "text-red-600" : near ? "text-amber-600" : "text-slate-500"
              }`}
            >
              {formatILS(spent)} מתוך {formatILS(limit)}
              {over && " · חריגה!"}
              {near && " · קרוב לגבול"}
            </div>
          )}
        </div>
      </div>

      {limit > 0 && (
        <div className="w-full h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              over ? "bg-red-500" : near ? "bg-amber-500" : "bg-emerald-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor={`limit-${category.id}`}>מגבלה חודשית (₪)</Label>
          <Input
            id={`limit-${category.id}`}
            type="number"
            inputMode="numeric"
            min="0"
            step="50"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0 = ללא תקציב"
          />
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => onSave(Number(value) || 0)}
        >
          שמור
        </Button>
      </div>
    </Card>
  );
}
