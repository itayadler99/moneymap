"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { HydrationGate } from "@/components/HydrationGate";
import { useStore } from "@/lib/store";

export default function WelcomePage() {
  return (
    <HydrationGate>
      <WelcomeForm />
    </HydrationGate>
  );
}

function WelcomeForm() {
  const router = useRouter();
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const [name, setName] = useState("");
  const [income, setIncome] = useState("");
  const [goal, setGoal] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    completeOnboarding({
      name: name.trim(),
      monthly_income_avg: Number(income) > 0 ? Number(income) : null,
      primary_goal: goal || null,
    });
    router.push("/dashboard");
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
            💸 MoneyMap
          </span>
        </div>
        <Card>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">בואו נכיר אותך</h1>
          <p className="text-sm text-slate-500 mb-6">שלוש שאלות. ניקח דקה.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">איך לקרוא לך?</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="השם הפרטי שלך"
                required
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="income">מה ההכנסה הממוצעת שלך בחודש? (₪)</Label>
              <Input
                id="income"
                type="number"
                inputMode="numeric"
                min="0"
                step="100"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="12000"
              />
              <p className="text-xs text-slate-400 mt-1">
                בערך — תוכל לעדכן בכל רגע.
              </p>
            </div>

            <div>
              <Label htmlFor="goal">מה היעד העיקרי שלך?</Label>
              <select
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base"
              >
                <option value="">בחר יעד...</option>
                <option value="save_money">לחסוך כסף</option>
                <option value="exit_debt">לצאת ממינוס/חובות</option>
                <option value="track_expenses">להבין לאן הולך הכסף</option>
                <option value="big_purchase">לחסוך לקנייה גדולה</option>
                <option value="emergency_fund">לבנות קרן חירום</option>
              </select>
            </div>

            <Button type="submit" size="lg" className="w-full">
              בוא נתחיל ←
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
