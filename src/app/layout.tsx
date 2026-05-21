import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "MoneyMap — ניהול פיננסי אישי",
  description: "הבן לאן הכסף שלך הולך. אפליקציה פשוטה לניהול תקציב, חיסכון ויעדים פיננסיים.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
