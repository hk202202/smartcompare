import { NextResponse } from "next/server";
import { searchCatalog } from "@/lib/platforms/catalog";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? undefined;
  return NextResponse.json({ products: searchCatalog(q, category).slice(0, 20) });
}
