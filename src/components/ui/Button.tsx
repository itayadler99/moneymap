import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variants: Record<Variant, string> = {
  primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
  secondary: "bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-sm",
  ghost: "hover:bg-slate-100 text-slate-700",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-12 px-6 text-lg",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    />
  );
}
