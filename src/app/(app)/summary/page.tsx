"use client";

import { useMemo, useState } from "react";
import { Card, CardTitle, StatValue } from "@/components/ui/Card";
import { CategoryPie, type PieDatum } from "@/components/CategoryPie";
import {
  currentMonthKey,
  formatILS,
  monthLabel,
  previousMonth,
  nextMonth,
} from "@/lib/utils";
import { useStore } from "@/lib/store";

export default function SummaryPage() {
  const [month, setMonth] = useState(() => previousMonth(currentMonthKey()));
  const categories = useStore((s) => s.categories);
  const transactions = useStore((s) => s.transactions);
  const budgets = useStore((s) => s.budgets);

  const data = useMemo(() => {
    const prev = previousMonth(month);
    const range = monthRange(month);
    const prevRange = monthRange(prev);
    const catMap = new Map(categories.map((c) => [c.id, c]));

    const tx = transactions.filter(
      (t) => t.date >= range.start && t.date <= range.end
    );
    const prevTx = transactions.filter(
      (t) => t.date >= prevRange.start && t.date <= prevRange.end
    );

    const income = sum(tx, "income");
    const expenses = sum(tx, "expense");
    const saved = income - expenses;
    const savingsRate = income > 0 ? Math.round((saved / income) * 100) : 0;

    const prevExpenses = sum(prevTx, "expense");
    const expenseDelta =
      prevExpenses > 0
        ? Math.round(((expenses - prevExpenses) / prevExpenses) * 100)
        : null;

    const byCat = new Map<string, number>();
    for (const t of tx) {
      if (t.type !== "expense") continue;
      byCat.set(t.category_id, (byCat.get(t.category_id) ?? 0) + t.amount);
    }
    const prevByCat = new Map<string, number>();
    for (const t of prevTx) {
      if (t.type !== "expense") continue;
      prevByCat.set(t.category_id, (prevByCat.get(t.category_id) ?? 0) + t.amount);
    }

    const pieData: PieDatum[] = [...byCat.entries()]
      .map(([catId, value]) => {
        const cat = catMap.get(catId);
        return {
          name: cat?.name ?? "אחר",
          value,
          color: cat?.color ?? "#64748b",
        };
      })
      .sort((a, b) => b.value - a.value);

    const changes: {
      name: string;
      delta: number;
      pct: number;
      current: number;
      prev: number;
    }[] = [];
    for (const [catId, prevAmount] of prevByCat) {
      const cur = byCat.get(catId) ?? 0;
      if (prevAmount === 0) continue;
      const delta = cur - prevAmount;
      const pct = Math.round((delta / prevAmount) * 100);
      if (Math.abs(pct) < 10) continue;
      const cat = catMap.get(catId);
      changes.push({
        name: cat?.name ?? "אחר",
        delta,
        pct,
        current: cur,
        prev: prevAmount,
      });
    }
    changes.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
    const improved = changes.filter((c) => c.delta < 0).slice(0, 3);
    const worsened = changes.filter((c) => c.delta > 0).slice(0, 3);

    const budgetMap = new Map<string, number>();
    for (const b of budgets) {
      if (b.month === month) budgetMap.set(b.category_id, b.monthly_limit);
    }
    const overruns: { name: string; spent: number; limit: number; over: number }[] = [];
    for (const [catId, limit] of budgetMap) {
      const spent = byCat.get(catId) ?? 0;
      if (spent > limit) {
        const cat = catMap.get(catId);
        overruns.push({
          name: cat?.name ?? "אחר",
          spent,
          limit,
          over: spent - limit,
        });
      }
    }

    return {
      income,
      expenses,
      saved,
      savingsRate,
      expenseDelta,
      pieData,
      improved,
      worsened,
      overruns,
      txCount: tx.length,
    };
  }, [month, categories, transactions, budgets]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">סיכום חודשי</h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
            <button
              onClick={() => setMonth((m) => previousMonth(m))}
              className="px-2 py-1 hover:bg-slate-100 rounded"
            >
              ←
            </button>
            <span className="font-medium">{monthLabel(month)}</span>
            <button
              onClick={() => setMonth((m) => nextMonth(m))}
              className="px-2 py-1 hover:bg-slate-100 rounded"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardTitle>נכנס</CardTitle>
          <StatValue value={formatILS(data.income)} tone="positive" />
        </Card>
        <Card>
          <CardTitle>יצא</CardTitle>
          <StatValue
            value={formatILS(data.expenses)}
            tone="negative"
            hint={
              data.expenseDelta !== null
                ? `${data.expenseDelta >= 0 ? "+" : ""}${
                    data.expenseDelta
                  }% מהחודש הקודם`
                : undefined
            }
          />
        </Card>
        <Card>
          <CardTitle>נחסך</CardTitle>
          <StatValue
            value={formatILS(data.saved)}
            tone={data.saved >= 0 ? "positive" : "negative"}
          />
        </Card>
        <Card>
          <CardTitle>אחוז חיסכון</CardTitle>
          <StatValue
            value={`${data.savingsRate}%`}
            tone={
              data.savingsRate >= 20
                ? "positive"
                : data.savingsRate >= 0
                ? "default"
                : "negative"
            }
          />
        </Card>
      </div>

      <Card>
        <CardTitle>פילוח הוצאות</CardTitle>
        <CategoryPie data={data.pieData} />
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardTitle>🎉 איפה השתפרת</CardTitle>
          {data.improved.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">
              אין שיפורים משמעותיים החודש.
            </p>
          ) : (
            <ul className="space-y-2">
              {data.improved.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{c.name}</span>
                  <span className="text-emerald-600 font-medium">
                    {c.pct}% ({formatILS(-c.delta)} פחות)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardTitle>⚠️ מה צריך לתקן</CardTitle>
          {data.worsened.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">לא היו עליות משמעותיות.</p>
          ) : (
            <ul className="space-y-2">
              {data.worsened.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{c.name}</span>
                  <span className="text-red-600 font-medium">
                    +{c.pct}% ({formatILS(c.delta)} יותר)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {data.overruns.length > 0 && (
        <Card>
          <CardTitle>חריגות מתקציב</CardTitle>
          <ul className="space-y-2">
            {data.overruns.map((o) => (
              <li
                key={o.name}
                className="flex items-center justify-between text-sm"
              >
                <span>{o.name}</span>
                <span className="text-red-600">
                  {formatILS(o.spent)} / {formatILS(o.limit)} (חריגה{" "}
                  {formatILS(o.over)})
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {data.txCount === 0 && (
        <Card>
          <p className="text-center text-slate-500 py-8">
            לא נרשמו תנועות בחודש {monthLabel(month)}.
          </p>
        </Card>
      )}
    </div>
  );
}

function sum(
  list: { amount: number; type: string }[],
  type: "income" | "expense"
): number {
  return list.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);
}

function monthRange(monthKey: string): { start: string; end: string } {
  const [y, m] = monthKey.split("-").map(Number);
  const start = `${monthKey}-01`;
  const end = new Date(y, m, 0).toISOString().slice(0, 10);
  return { start, end };
}
