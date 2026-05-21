import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base text-slate-900 placeholder:text-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
        className
      )}
      {...rest}
    />
  );
}

export function Textarea({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full min-h-[80px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
        className
      )}
      {...rest}
    />
  );
}

export function Label({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-slate-700 mb-1.5", className)}
    >
      {children}
    </label>
  );
}
