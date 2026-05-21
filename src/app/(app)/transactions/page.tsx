"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatILS } from "@/lib/utils";
import { useStore } from "@/lib/store";

export default function TransactionsPage() {
  const transactions = useStore((s) => s.transactions);
  const categories = useStore((s) => s.categories);
  const deleteTransaction = useStore((s) => s.deleteTransaction);

  const catMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">תנועות</h1>
        <Link href="/transactions/new">
          <Button>+ הוסף תנועה</Button>
        </Link>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <p className="text-center text-slate-500 py-12">
            אין עדיין תנועות.
            <br />
            <Link
              href="/transactions/new"
              className="text-emerald-600 font-medium"
            >
              הוסף את הראשונה ←
            </Link>
          </p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {transactions.map((t) => {
              const cat = catMap.get(t.category_id);
              const isIncome = t.type === "income";
              return (
                <li key={t.id} className="flex items-center gap-3 p-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ background: `${cat?.color ?? "#64748b"}20` }}
                  >
                    {cat?.icon ?? "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {t.description || cat?.name || "תנועה"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {cat?.name} · {formatDate(t.date)}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      isIncome ? "text-emerald-600" : "text-slate-900"
                    }`}
                  >
                    {isIncome ? "+" : "−"}
                    {formatILS(t.amount)}
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("למחוק את התנועה?")) deleteTransaction(t.id);
                    }}
                    className="text-slate-400 hover:text-red-600 px-2 text-lg"
                    aria-label="מחק"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
  });
}
