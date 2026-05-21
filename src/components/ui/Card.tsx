import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-sm font-medium text-slate-500 mb-2", className)}>
      {children}
    </h3>
  );
}

export function StatValue({
  value,
  hint,
  tone = "default",
}: {
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
      ? "text-red-600"
      : "text-slate-900";
  return (
    <div>
      <div className={cn("text-3xl font-bold", toneClass)}>{value}</div>
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
    </div>
  );
}
