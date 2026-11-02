import { NextResponse } from "next/server";
import { getProduct } from "@/lib/platforms/catalog";
import { getAdapters } from "@/lib/platforms/registry";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = getProduct(searchParams.get("productId") ?? "");
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  const days = Math.min(Number(searchParams.get("days") ?? 90) || 90, 365);

  const series = await Promise.all(
    getAdapters().map(async (a) => ({ platform: a.platform, points: (await a.getHistory?.(product, days)) ?? [] })),
  );
  const byDate = new Map<string, Record<string, number | string>>();
  for (const { platform, points } of series) {
    for (const { date, price } of points) {
      const row = byDate.get(date) ?? { date };
      row[platform] = price;
      byDate.set(date, row);
    }
  }
  const platforms = series.filter((s) => s.points.length).map((s) => s.platform);
  const all = series.flatMap((s) => s.points.map((p) => p.price));
  return NextResponse.json({
    platforms,
    points: [...byDate.values()].sort((a, b) => String(a.date).localeCompare(String(b.date))),
    lowest: all.length ? Math.min(...all) : null,
    highest: all.length ? Math.max(...all) : null,
  });
}
