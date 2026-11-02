import { NextResponse } from "next/server";
import { requireUserId } from "@/auth";
import { db } from "@/lib/db";
import { cardSchema } from "@/lib/validation";

const unauthorized = () => NextResponse.json({ error: "Sign in to save cards" }, { status: 401 });

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  return NextResponse.json({ cards: await db.card.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }) });
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const parsed = cardSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid card" }, { status: 400 });

  const { bank, type, network, productId, label } = parsed.data;
  const card = await db.card.create({ data: { userId, bank, type, network, productId, label } });
  return NextResponse.json({ card }, { status: 201 });
}

export async function DELETE(req: Request) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.card.deleteMany({ where: { id, userId } });
  return NextResponse.json({ ok: true });
}
