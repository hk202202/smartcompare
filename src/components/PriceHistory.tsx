"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { inr, Panel } from "@/components/ui";
import { PLATFORMS } from "@/lib/platforms/platforms";
import type { PlatformId } from "@/lib/types";

interface History {
  platforms: PlatformId[];
  points: Record<string, number | string>[];
  lowest: number | null;
  highest: number | null;
}

export function PriceHistory({ productId }: { productId: string }) {
  const [data, setData] = useState<History | null>(null);

  useEffect(() => {
    fetch(`/api/history?productId=${productId}&days=90`).then(async (r) => r.ok && setData(await r.json()));
  }, [productId]);

  if (!data) return null;

  return (
    <Panel className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">90-day price history</h2>
        {data.lowest !== null && data.highest !== null && (
          <p className="text-sm text-slate-500">
            Lowest <span className="font-semibold text-green-600">{inr(data.lowest)}</span> · Highest{" "}
            <span className="font-semibold text-red-500">{inr(data.highest)}</span>
          </p>
        )}
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.points}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={30} />
            <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} tickFormatter={(v) => inr(Number(v))} width={80} />
            <Tooltip formatter={(v) => inr(Number(v))} />
            <Legend />
            {data.platforms.map((p) => (
              <Line key={p} type="monotone" dataKey={p} name={PLATFORMS[p].name} stroke={PLATFORMS[p].color} dot={false} strokeWidth={2} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
