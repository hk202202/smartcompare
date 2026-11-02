import { ruleBasedSummary } from "@/lib/ai/advisor";
import { db } from "@/lib/db";
import { applyOffers } from "@/lib/offers/engine";
import { getAdapters } from "@/lib/platforms/registry";
import { rankListings } from "@/lib/ranking/engine";
import type { CompareResult, Listing, Product, UserCard } from "@/lib/types";

const ADAPTER_TIMEOUT_MS = 4000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([promise, new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);
}

export async function fetchListings(product: Product): Promise<Listing[]> {
  const results = await Promise.allSettled(
    getAdapters().map((a) => withTimeout(a.getListing(product), ADAPTER_TIMEOUT_MS)),
  );
  return results.flatMap((r) => (r.status === "fulfilled" && r.value ? [r.value] : []));
}

export async function compareProduct(product: Product, cards: UserCard[]): Promise<CompareResult> {
  const listings = await fetchListings(product);
  const priced = listings.map((l) => applyOffers(l, cards, product.category));
  const ranked = rankListings(priced, product.category);
  const inStock = ranked.filter((l) => l.inStock);
  const finals = inStock.map((l) => l.bestOffer.effectivePrice);

  void recordSnapshots(listings);

  return {
    product,
    listings: ranked,
    winner: inStock[0] ?? null,
    savingsVsWorst: finals.length ? Math.max(...finals) - (inStock[0]?.bestOffer.effectivePrice ?? 0) : 0,
    summary: ruleBasedSummary(product, ranked),
  };
}

async function recordSnapshots(listings: Listing[]) {
  try {
    await db.priceSnapshot.createMany({
      data: listings.map((l) => ({ productId: l.productId, platform: l.platform, price: l.price, inStock: l.inStock })),
    });
    const lowest = Math.min(...listings.filter((l) => l.inStock).map((l) => l.price));
    if (Number.isFinite(lowest) && listings[0]) {
      await db.priceAlert.updateMany({
        where: { productId: listings[0].productId, triggeredAt: null, targetPrice: { gte: lowest } },
        data: { triggeredAt: new Date() },
      });
    }
  } catch (err) {
    console.error("snapshot write failed", err);
  }
}
