"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardTitle, StatValue } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CategoryPie, type PieDatum } from "@/components/CategoryPie";
import {
  currentMonthKey,
  formatILS,
  monthLabel,
  previousMonth,
  nextMonth,
} from "@/lib/utils";
import { generateInsight } from "@/lib/insights";
import { useStore } from "@/lib/store";

export default function DashboardPage() {
  const [month, setMonth] = useState(() => currentMonthKey());
  const categories = useStore((s) => s.categories);
  const transactions = useStore((s) => s.transactions);

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
    const remaining = income - expenses;
    const savingsRate = income > 0 ? Math.round((remaining / income) * 100) : 0;
    const prevExpenses = sum(prevTx, "expense");

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

    const topCatId = [...byCat.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const topCatName = topCatId
      ? catMap.get(topCatId)?.name ?? null
      : null;
    const topCatAmount = topCatId ? byCat.get(topCatId) ?? 0 : 0;
    const topCatPrev = topCatId ? prevByCat.get(topCatId) ?? 0 : 0;

    const now = new Date();
    const [y, mo] = month.split("-").map(Number);
    const isCurrent = month === currentMonthKey();
    const daysInMonth = new Date(y, mo, 0).getDate();
    const daysIntoMonth = isCurrent ? now.getDate() : daysInMonth;

    const insight = generateInsight({
      income,
      expenses,
      prevExpenses: prevExpenses > 0 ? prevExpenses : null,
      topCategoryName: topCatName,
      topCategoryAmount: topCatAmount,
      topCategoryPrevAmount: topCatPrev,
      daysIntoMonth,
      daysInMonth,
    });

    return {
      income,
      expenses,
      remaining,
      savingsRate,
      pieData,
      insight,
    };
  }, [month, categories, transactions]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">סקירה</h1>
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
        <Link href="/transactions/new">
          <Button>+ הוסף תנועה</Button>
        </Link>
      </div>

      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <p className="text-slate-800 leading-relaxed">{data.insight}</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardTitle>נכנס</CardTitle>
          <StatValue value={formatILS(data.income)} tone="positive" />
        </Card>
        <Card>
          <CardTitle>יצא</CardTitle>
          <StatValue value={formatILS(data.expenses)} tone="negative" />
        </Card>
        <Card>
          <CardTitle>נותר</CardTitle>
          <StatValue
            value={formatILS(data.remaining)}
            tone={data.remaining >= 0 ? "positive" : "negative"}
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

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardTitle>פילוח הוצאות לפי קטגוריה</CardTitle>
          <CategoryPie data={data.pieData} />
        </Card>
        <Card>
          <CardTitle>הוצאות הגדולות החודש</CardTitle>
          <div className="space-y-2">
            {data.pieData.slice(0, 5).map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: d.color }}
                  />
                  <span className="text-sm text-slate-700">{d.name}</span>
                </div>
                <span className="text-sm font-medium text-slate-900">
                  {formatILS(d.value)}
                </span>
              </div>
            ))}
            {data.pieData.length === 0 && (
              <p className="text-sm text-slate-400 py-6 text-center">
                אין עדיין הוצאות החודש
              </p>
            )}
          </div>
        </Card>
      </div>
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
