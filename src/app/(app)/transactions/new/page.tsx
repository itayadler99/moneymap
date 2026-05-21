"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useStore } from "@/lib/store";

export default function NewTransactionPage() {
  const router = useRouter();
  const categories = useStore((s) => s.categories);
  const addTransaction = useStore((s) => s.addTransaction);

  const today = new Date().toISOString().slice(0, 10);

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0 || !categoryId) return;
    addTransaction({
      amount: amt,
      type,
      category_id: categoryId,
      description: description.trim() || null,
      date,
    });
    router.push("/dashboard");
  }

  // Filter categories by type — income categories for income, others for expense
  const filteredCategories = categories.filter((c) =>
    type === "income" ? c.type === "income" : c.type !== "income"
  );

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">תנועה חדשה</h1>
        <Link href="/dashboard" className="text-sm text-slate-500">
          ביטול
        </Link>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>סוג</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType("expense");
                  const firstExpense = categories.find((c) => c.type !== "income");
                  if (firstExpense) setCategoryId(firstExpense.id);
                }}
                className={`h-11 rounded-xl border ${
                  type === "expense"
                    ? "bg-red-50 border-red-300 text-red-700"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                💸 הוצאה
              </button>
              <button
                type="button"
                onClick={() => {
                  setType("income");
                  const firstIncome = categories.find((c) => c.type === "income");
                  if (firstIncome) setCategoryId(firstIncome.id);
                }}
                className={`h-11 rounded-xl border ${
                  type === "income"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                💰 הכנסה
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="amount">סכום (₪)</Label>
            <Input
              id="amount"
              type="number"
              inputMode="numeric"
              min="0"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="text-2xl font-bold h-14"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="category">קטגוריה</Label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base"
            >
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="date">תאריך</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">תיאור (אופציונלי)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="לדוגמה: שופרסל, ארוחת ערב, דלק"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            שמור
          </Button>
        </form>
      </Card>
    </div>
  );
}
