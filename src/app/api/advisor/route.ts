import { NextResponse } from "next/server";
import { aiSummary } from "@/lib/ai/advisor";
import type { CompareResult } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { result?: CompareResult; question?: string } | null;
  if (!body?.result?.product) return NextResponse.json({ error: "Missing compare result" }, { status: 400 });

  const text = await aiSummary(body.result, body.question?.slice(0, 300));
  return NextResponse.json({ text: text ?? body.result.summary, source: text ? "ai" : "rules" });
}
