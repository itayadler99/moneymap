"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { HydrationGate } from "@/components/HydrationGate";

const NAV = [
  { href: "/dashboard", label: "סקירה", icon: "🏠" },
  { href: "/transactions", label: "תנועות", icon: "💳" },
  { href: "/budgets", label: "תקציב", icon: "📊" },
  { href: "/goals", label: "יעדים", icon: "🎯" },
  { href: "/summary", label: "סיכום", icon: "📈" },
];

const SIDEBAR_EXTRA = [{ href: "/settings", label: "הגדרות", icon: "⚙️" }];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <HydrationGate>
      <AppShellInner>{children}</AppShellInner>
    </HydrationGate>
  );
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const onboarded = useStore((s) => s.profile.onboarded);
  const name = useStore((s) => s.profile.name);

  useEffect(() => {
    if (!onboarded) router.replace("/welcome");
  }, [onboarded, router]);

  if (!onboarded) return null;

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      {/* Sidebar (md+) */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:border-l md:border-slate-200 md:bg-white md:p-4">
        <div className="flex items-center gap-2 px-3 py-3 mb-2">
          <span className="text-2xl">💸</span>
          <span className="font-bold text-lg">MoneyMap</span>
        </div>
        <nav className="flex-1 space-y-1">
          {[...NAV, ...SIDEBAR_EXTRA].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        {name && (
          <div className="border-t border-slate-200 pt-3 mt-3 px-3 py-2 text-sm text-slate-500">
            שלום, {name}
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-4 sm:px-6 py-6 pb-24 md:pb-6 max-w-4xl mx-auto w-full">
          {children}
        </main>

        {/* Bottom nav (mobile) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 grid grid-cols-5 z-10">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 text-xs",
                pathname.startsWith(item.href)
                  ? "text-emerald-600"
                  : "text-slate-500"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="mt-0.5">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
