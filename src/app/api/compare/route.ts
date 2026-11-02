import { NextResponse } from "next/server";
import { requireUserId } from "@/auth";
import { compareProduct } from "@/lib/compare";
import { db } from "@/lib/db";
import { getProduct } from "@/lib/platforms/catalog";
import type { UserCard } from "@/lib/types";
import { compareSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const parsed = compareSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const product = getProduct(parsed.data.productId);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const userId = await requireUserId();
  const cards: UserCard[] = userId
    ? ((await db.card.findMany({ where: { userId } })) as UserCard[])
    : parsed.data.cards.map((c, i) => ({ ...c, id: c.id ?? `guest-${i}` }));

  return NextResponse.json(await compareProduct(product, cards));
}
