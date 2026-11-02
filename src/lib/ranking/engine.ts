import { PLATFORMS } from "@/lib/platforms/platforms";
import type { Category, PricedListing, RankedListing } from "@/lib/types";

interface Weights {
  price: number;
  delivery: number;
  trust: number;
  returns: number;
}

export const WEIGHTS: Record<Category, Weights> = {
  electronics: { price: 0.7, delivery: 0.1, trust: 0.1, returns: 0.1 },
  grocery: { price: 0.55, delivery: 0.35, trust: 0.1, returns: 0 },
};

/** Higher exponent punishes being pricier than the cheapest store more steeply. */
const PRICE_SENSITIVITY = 5;
const priceScore = (price: number, min: number) => (min / price) ** PRICE_SENSITIVITY;
/** Log scale so 10 min vs 2 hrs matters, but 1 day vs 2 days matters less. */
const deliveryScore = (eta: number, min: number) => 1 - Math.min(Math.log(eta / min) / Math.log(1000), 1);

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function rankListings(listings: PricedListing[], category: Category): RankedListing[] {
  const w = WEIGHTS[category];
  const available = listings.filter((l) => l.inStock);
  if (!available.length) {
    return listings.map((l) => ({ ...l, score: 0, rank: 0, reasons: ["Out of stock"] }));
  }

  const prices = available.map((l) => l.bestOffer.effectivePrice);
  const etas = available.map((l) => l.deliveryMinutes);
  const [minP, minE] = [Math.min(...prices), Math.min(...etas)];

  const ranked = available
    .map((l) => {
      const p = PLATFORMS[l.platform];
      const score =
        w.price * priceScore(l.bestOffer.effectivePrice, minP) +
        w.delivery * deliveryScore(l.deliveryMinutes, minE) +
        w.trust * p.trustScore +
        w.returns * Math.min(p.returnDays / 7, 1);

      const reasons: string[] = [];
      if (l.bestOffer.effectivePrice === minP) reasons.push("Lowest final price");
      if (l.bestOffer.offer) {
        reasons.push(`${inr(l.bestOffer.discount)} ${l.bestOffer.offer.kind === "cashback" ? "cashback" : "off"} with your ${l.bestOffer.card?.label || l.bestOffer.card?.bank} card`);
      }
      if (l.deliveryMinutes === minE) reasons.push(`Fastest delivery (${l.deliveryLabel})`);
      if (p.returnDays >= 7 && category === "electronics") reasons.push(`${p.returnDays}-day returns`);
      return { ...l, score: Math.round(score * 1000) / 1000, rank: 0, reasons };
    })
    .sort((a, b) => b.score - a.score || a.bestOffer.effectivePrice - b.bestOffer.effectivePrice)
    .map((l, i) => ({ ...l, rank: i + 1 }));

  const outOfStock = listings
    .filter((l) => !l.inStock)
    .map((l) => ({ ...l, score: 0, rank: 0, reasons: ["Out of stock"] }));

  return [...ranked, ...outOfStock];
}
