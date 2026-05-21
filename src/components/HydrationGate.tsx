"use client";

import { useHydrated } from "@/lib/store";

export function HydrationGate({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-slate-400 text-sm">טוען...</div>
      </div>
    );
  }

  return <>{children}</>;
}
