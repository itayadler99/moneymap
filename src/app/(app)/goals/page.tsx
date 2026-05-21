"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { formatILS } from "@/lib/utils";
import { useStore } from "@/lib/store";

export default function GoalsPage() {
  const goals = useStore((s) => s.goals);
  const addGoal = useStore((s) => s.addGoal);
  const updateGoalProgress = useStore((s) => s.updateGoalProgress);
  const deleteGoal = useStore((s) => s.deleteGoal);

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [date, setDate] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const t = Number(target);
    if (!title.trim() || t <= 0) return;
    addGoal({
      title: title.trim(),
      target_amount: t,
      current_amount: Number(current) > 0 ? Number(current) : 0,
      target_date: date || null,
    });
    setTitle("");
    setTarget("");
    setCurrent("");
    setDate("");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">יעדים פיננסיים</h1>

      <div className="grid gap-4 mb-6">
        {goals.map((g) => (
          <GoalCard
            key={g.id}
            goal={g}
            onAdd={(amount) => updateGoalProgress(g.id, amount)}
            onDelete={() => {
              if (confirm("למחוק את היעד?")) deleteGoal(g.id);
            }}
          />
        ))}
      </div>

      <Card>
        <h2 className="font-bold mb-3">הוסף יעד חדש</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <Label htmlFor="title">שם היעד</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="לדוגמה: טיול לאירופה, קרן חירום"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="target_amount">סכום יעד (₪)</Label>
              <Input
                id="target_amount"
                type="number"
                inputMode="numeric"
                min="1"
                step="100"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
                placeholder="20000"
              />
            </div>
            <div>
              <Label htmlFor="current_amount">סכום נוכחי</Label>
              <Input
                id="current_amount"
                type="number"
                inputMode="numeric"
                min="0"
                step="100"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="target_date">תאריך יעד (אופציונלי)</Label>
            <Input
              id="target_date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            הוסף יעד
          </Button>
        </form>
      </Card>
    </div>
  );
}

function GoalCard({
  goal,
  onAdd,
  onDelete,
}: {
  goal: {
    id: string;
    title: string;
    target_amount: number;
    current_amount: number;
    target_date: string | null;
  };
  onAdd: (amount: number) => void;
  onDelete: () => void;
}) {
  const [amount, setAmount] = useState("");
  const target = goal.target_amount;
  const current = goal.current_amount;
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const remaining = Math.max(0, target - current);

  const monthsLeft = goal.target_date
    ? monthsBetween(new Date(), new Date(goal.target_date))
    : null;
  const monthlySave =
    monthsLeft && monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : null;

  function add() {
    const n = Number(amount);
    if (!n) return;
    onAdd(n);
    setAmount("");
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold text-lg">{goal.title}</h3>
          {goal.target_date && (
            <p className="text-xs text-slate-500">
              יעד עד {new Date(goal.target_date).toLocaleDateString("he-IL")}
            </p>
          )}
        </div>
        <span className="text-sm font-medium text-emerald-600">{pct}%</span>
      </div>

      <div className="w-full h-2.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-slate-600">
          {formatILS(current)} / {formatILS(target)}
        </span>
        <span className="text-slate-500">נשאר {formatILS(remaining)}</span>
      </div>

      {monthlySave && (
        <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg p-2 mb-3">
          להגעה ליעד — חסוך {formatILS(monthlySave)} בחודש
        </p>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          min="0"
          step="50"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="הוסף סכום שחסכת"
          className="flex-1 h-10"
        />
        <Button type="button" size="sm" onClick={add} disabled={!amount}>
          +
        </Button>
        <button
          type="button"
          onClick={onDelete}
          className="text-slate-400 hover:text-red-600 px-2"
          aria-label="מחק יעד"
        >
          🗑
        </button>
      </div>
    </Card>
  );
}

function monthsBetween(a: Date, b: Date): number {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}
