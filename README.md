# MoneyMap

אפליקציית ניהול פיננסי אישי. מסמך אפיון: `SPEC.md`.

**Live demo:** https://moneymap-blond.vercel.app

## הקמה (3 צעדים)

### 1. פתח פרויקט Supabase (חינמי)

1. כנס ל-https://supabase.com → **Start your project**
2. **New Project** → שם: `moneymap`, סיסמת DB חזקה, אזור: West Europe
3. חכה ~2 דקות עד שהפרויקט מוכן
4. **Project Settings → API** — שמור את:
   - `Project URL`
   - `anon public` key

### 2. הדבק קרדנציאלס

ערוך את `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. הרץ את ה-SQL

ב-Supabase: **SQL Editor → New Query** — הדבק את התוכן של `db/schema.sql` ולחץ **Run**.
זה יוצר את כל הטבלאות + RLS + טריגר ליצירת פרופיל אוטומטית.

### 4. כבה אימות אימייל (לפיתוח)

ברירת המחדל ב-Supabase דורשת אישור מייל לפני שמשתמש יכול להתחבר.
לפיתוח מהיר ה-MVP מניח שזה כבוי.

ב-Supabase: **Authentication → Sign In / Up → Email** — כבה את `Confirm email`.

> בפרודקשן אחרי MVP — להחזיר את זה ON.

### 5. הרץ את האפליקציה

```bash
npm run dev
```

פתח http://localhost:3000

## מבנה

```
src/
  app/
    (auth)/         — login, signup
    (app)/          — dashboard, transactions, budgets, goals, settings (מוגן)
    onboarding/     — שאלות פתיחה
  components/
    AppShell.tsx    — sidebar/bottom-nav
    CategoryPie.tsx — recharts pie
    ui/             — Button, Input, Card
  lib/
    supabase/       — client + server
    categories.ts   — 12 קטגוריות ברירת מחדל
    insights.ts     — מנוע המלצות חכמות
    utils.ts        — formatILS, monthLabel
  proxy.ts          — auth gate (היה middleware.ts ב-Next 15)
db/
  schema.sql        — סכמת DB מלאה
```

## פיצ׳רים שיש כבר

- הרשמה + התחברות (Supabase Auth, אימייל+סיסמה)
- Onboarding (שם, הכנסה, יעד)
- 12 קטגוריות ברירת מחדל נטענות אוטומטית
- הוספת הכנסה/הוצאה
- רשימת תנועות עם מחיקה
- דשבורד חודשי: נכנס/יצא/נותר/חיסכון + גרף עוגה
- מעבר בין חודשים
- המלצה חכמה אוטומטית (חוקים, לא AI)
- תקציב לקטגוריה + פס התקדמות
- יעדים פיננסיים עם חישוב כמה לחסוך בחודש
- הגדרות פרופיל

## כללי

- שפה: עברית RTL
- מטבע: ₪ בלבד
- משתמש יחיד
- Database: כל מידע מוגן ב-RLS, רק המשתמש רואה את הנתונים שלו

## Deploy לפרודקשן (אחרי MVP)

Vercel: התחבר ל-GitHub → import → הוסף את שני ה-env vars → deploy.
