import { BANK_OFFERS } from "@/lib/offers/data";
import type { AppliedOffer, BankOffer, Category, Listing, PricedListing, UserCard } from "@/lib/types";

export function offerApplies(offer: BankOffer, card: UserCard, listing: Listing, category: Category): boolean {
  if (offer.bank !== card.bank) return false;
  if (!offer.cardTypes.includes(card.type)) return false;
  if (offer.cardProductId && offer.cardProductId !== card.productId) return false;
  if (!offer.platforms.includes(listing.platform)) return false;
  if (offer.categories && !offer.categories.includes(category)) return false;
  return listing.price >= offer.minOrder;
}

export function discountFor(offer: BankOffer, price: number): number {
  const raw = offer.flat ?? (price * (offer.percent ?? 0)) / 100;
  return Math.floor(Math.min(raw, offer.maxDiscount, price));
}

const noCard = (listing: Listing): AppliedOffer => ({ card: null, offer: null, discount: 0, effectivePrice: listing.price });

/** Best offer per card for this listing, sorted cheapest first; always includes the no-card baseline. */
export function applyOffers(
  listing: Listing,
  cards: UserCard[],
  category: Category,
  offers: BankOffer[] = BANK_OFFERS,
): PricedListing {
  const perCard: AppliedOffer[] = cards.map((card) => {
    let best: AppliedOffer = { ...noCard(listing), card };
    for (const offer of offers) {
      if (!offerApplies(offer, card, listing, category)) continue;
      const discount = discountFor(offer, listing.price);
      if (discount > best.discount) best = { card, offer, discount, effectivePrice: listing.price - discount };
    }
    return best;
  });

  const all = [noCard(listing), ...perCard].sort((a, b) => a.effectivePrice - b.effectivePrice);
  return { ...listing, bestOffer: all[0], allOffers: all };
}

/** Offers available on a platform for anyone, used to nudge users without a matching card. */
export function availableOffers(listing: Listing, category: Category, offers: BankOffer[] = BANK_OFFERS): BankOffer[] {
  return offers.filter(
    (o) => o.platforms.includes(listing.platform) && (!o.categories || o.categories.includes(category)) && listing.price >= o.minOrder,
  );
}
