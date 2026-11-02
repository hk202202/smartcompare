import { NextResponse } from "next/server";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { getProduct } from "@/lib/platforms/catalog";
import { alertSchema } from "@/lib/validation";

const unauthorized = () => NextResponse.json({ error: "Sign in to create price alerts" }, { status: 401 });

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const alerts = await db.priceAlert.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ alerts: alerts.map((a) => ({ ...a, product: getProduct(a.productId) })) });
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const parsed = alertSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !getProduct(parsed.data.productId)) {
    return NextResponse.json({ error: "Invalid alert" }, { status: 400 });
  }
  const { productId, targetPrice } = parsed.data;
  const alert = await db.priceAlert.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId, targetPrice },
    update: { targetPrice, triggeredAt: null },
  });
  return NextResponse.json({ alert }, { status: 201 });
}

export async function DELETE(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.priceAlert.deleteMany({ where: { id, userId } });
  return NextResponse.json({ ok: true });
}
