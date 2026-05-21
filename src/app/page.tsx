"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { HydrationGate } from "@/components/HydrationGate";
import { useStore } from "@/lib/store";

export default function HomePage() {
  return (
    <HydrationGate>
      <HomeContent />
    </HydrationGate>
  );
}

function HomeContent() {
  const router = useRouter();
  const onboarded = useStore((s) => s.profile.onboarded);

  useEffect(() => {
    if (onboarded) router.replace("/dashboard");
  }, [onboarded, router]);

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
          💸 MoneyMap
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          הבן לאן הכסף שלך הולך —
          <br />
          תוך פחות מדקה.
        </h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          MoneyMap מראה לך בצורה פשוטה את כל ההתנהלות הכלכלית שלך:
          הכנסות, הוצאות, חיסכון, ומה הצעד הבא הכי נכון לך.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/welcome">
            <Button size="lg">בוא נתחיל</Button>
          </Link>
        </div>
        <p className="text-xs text-slate-400 mt-6">
          גרסת דמו. הנתונים שלך נשמרים מקומית בדפדפן.
        </p>
      </div>
    </main>
  );
}
