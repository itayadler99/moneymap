"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useStore } from "@/lib/store";
import { previousMonth, currentMonthKey } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const categories = useStore((s) => s.categories);
  const addTransaction = useStore((s) => s.addTransaction);
  const resetAll = useStore((s) => s.resetAll);

  const [name, setName] = useState(profile.name ?? "");
  const [income, setIncome] = useState(
    profile.monthly_income_avg ? String(profile.monthly_income_avg) : ""
  );

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setProfile({
      name: name.trim() || null,
      monthly_income_avg: Number(income) > 0 ? Number(income) : null,
    });
  }

  function loadDemoData() {
    if (!confirm("לטעון נתוני דמו? זה יוסיף תנועות לחודש הנוכחי והקודם.")) return;

    const currentM = currentMonthKey();
    const prevM = previousMonth(currentM);
    const today = new Date();
    const [py, pmo] = prevM.split("-").map(Number);
    const prevMonthEnd = new Date(py, pmo, 0).getDate();

    const findCat = (substr: string) =>
      categories.find((c) => c.name.includes(substr))?.id;

    const salary = findCat("משכורת");
    const food = findCat("אוכל");
    const restaurant = findCat("מסעדות");
    const rent = findCat("שכירות");
    const bills = findCat("חשבונות");
    const fun = findCat("בילויים");
    const car = findCat("רכב");

    const samples: Array<[string, number, "income" | "expense", string, string]> = [
      [salary!, 12000, "income", "משכורת", `${currentM}-01`],
      [rent!, 4500, "expense", "שכירות חודשית", `${currentM}-02`],
      [bills!, 380, "expense", "חשמל + מים", `${currentM}-05`],
      [food!, 240, "expense", "שופרסל", `${currentM}-06`],
      [restaurant!, 95, "expense", "ארוחת ערב", `${currentM}-08`],
      [fun!, 180, "expense", "סרט + פופקורן", `${currentM}-10`],
      [food!, 310, "expense", "שופרסל", `${currentM}-12`],
      [car!, 280, "expense", "דלק", `${currentM}-14`],
      [restaurant!, 65, "expense", "קפה ועוגה", `${currentM}-15`],
      [restaurant!, 130, "expense", "סושי", `${currentM}-${today.getDate()}`],

      // Prev month
      [salary!, 12000, "income", "משכורת", `${prevM}-01`],
      [rent!, 4500, "expense", "שכירות חודשית", `${prevM}-02`],
      [bills!, 350, "expense", "חשמל + מים", `${prevM}-05`],
      [food!, 290, "expense", "שופרסל", `${prevM}-07`],
      [restaurant!, 70, "expense", "ארוחת בוקר", `${prevM}-10`],
      [food!, 220, "expense", "ויקטורי", `${prevM}-14`],
      [car!, 250, "expense", "דלק", `${prevM}-18`],
      [fun!, 90, "expense", "ערב עם חברים", `${prevM}-22`],
      [bills!, 199, "expense", "אינטרנט", `${prevM}-${prevMonthEnd}`],
    ];

    for (const [category_id, amount, type, description, date] of samples) {
      if (!category_id) continue;
      addTransaction({ amount, type, category_id, description, date });
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-4">הגדרות</h1>

      <Card>
        <h2 className="font-bold mb-3">פרופיל</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label htmlFor="name">שם</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="income">הכנסה ממוצעת בחודש (₪)</Label>
            <Input
              id="income"
              type="number"
              inputMode="numeric"
              min="0"
              step="100"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            שמור
          </Button>
        </form>
      </Card>

      <Card className="mt-4">
        <h2 className="font-bold mb-3">דמו</h2>
        <p className="text-sm text-slate-500 mb-3">
          טען תנועות לדוגמה כדי לראות איך הדשבורד נראה עם דאטה.
        </p>
        <Button variant="secondary" className="w-full" onClick={loadDemoData}>
          טען נתוני דמו
        </Button>
      </Card>

      <Card className="mt-4">
        <h2 className="font-bold mb-3">איפוס</h2>
        <p className="text-sm text-slate-500 mb-3">
          מחיקת כל הנתונים מהדפדפן הזה. לא ניתן לשחזר.
        </p>
        <Button
          variant="danger"
          className="w-full"
          onClick={() => {
            if (
              confirm("בטוח? כל הנתונים יימחקו. תצטרך לעבור Onboarding מחדש.")
            ) {
              resetAll();
              router.push("/");
            }
          }}
        >
          אפס הכל
        </Button>
      </Card>
    </div>
  );
}
