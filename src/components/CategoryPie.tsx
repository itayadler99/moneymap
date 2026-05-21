"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatILS } from "@/lib/utils";

export type PieDatum = { name: string; value: number; color: string };

export function CategoryPie({ data }: { data: PieDatum[] }) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        אין עדיין תנועות החודש
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatILS(Number(value))}
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
