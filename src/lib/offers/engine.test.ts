import { describe, expect, it } from "vitest";
import { applyOffers, discountFor } from "@/lib/offers/engine";
import type { BankOffer, Listing, UserCard } from "@/lib/types";

const listing = (price: number, platform: Listing["platform"] = "amazon"): Listing => ({
  productId: "p",
  platform,
  title: "Phone",
  price,
  mrp: price,
  inStock: true,
  deliveryMinutes: 1440,
  deliveryLabel: "Tomorrow",
  url: "",
  fetchedAt: "",
});

const hdfcCredit: UserCard = { id: "1", bank: "HDFC", type: "credit", network: "visa" };
const hdfcDebit: UserCard = { id: "2", bank: "HDFC", type: "debit", network: "visa" };

const offers: BankOffer[] = [
  { id: "pct", bank: "HDFC", cardTypes: ["credit"], platforms: ["amazon"], kind: "instant", percent: 10, maxDiscount: 5000, minOrder: 5000, description: "" },
  { id: "flat", bank: "HDFC", cardTypes: ["debit"], platforms: ["amazon"], kind: "instant", flat: 750, maxDiscount: 750, minOrder: 10000, description: "" },
  { id: "cobrand", bank: "ICICI", cardProductId: "icici-amazon-pay", cardTypes: ["credit"], platforms: ["amazon"], kind: "cashback", percent: 5, maxDiscount: 100000, minOrder: 0, description: "" },
];

describe("discountFor", () => {
  it("applies percentage capped at maxDiscount", () => {
    expect(discountFor(offers[0], 20000)).toBe(2000);
    expect(discountFor(offers[0], 80000)).toBe(5000);
  });
  it("applies flat discounts", () => {
    expect(discountFor(offers[1], 12000)).toBe(750);
  });
});

describe("applyOffers", () => {
  it("returns the no-card baseline when user has no cards", () => {
    const r = applyOffers(listing(30000), [], "electronics", offers);
    expect(r.bestOffer).toMatchObject({ card: null, discount: 0, effectivePrice: 30000 });
  });

  it("picks the card with the biggest saving", () => {
    const r = applyOffers(listing(30000), [hdfcDebit, hdfcCredit], "electronics", offers);
    expect(r.bestOffer.card?.id).toBe("1");
    expect(r.bestOffer.effectivePrice).toBe(27000);
    expect(r.allOffers.map((o) => o.effectivePrice)).toEqual([27000, 29250, 30000]);
  });

  it("respects minimum order value", () => {
    const r = applyOffers(listing(4000), [hdfcCredit], "electronics", offers);
    expect(r.bestOffer.discount).toBe(0);
  });

  it("requires the exact co-branded card when the offer names one", () => {
    const generic: UserCard = { id: "3", bank: "ICICI", type: "credit", network: "visa" };
    const amazonPay: UserCard = { ...generic, id: "4", productId: "icici-amazon-pay" };
    expect(applyOffers(listing(10000), [generic], "electronics", offers).bestOffer.discount).toBe(0);
    expect(applyOffers(listing(10000), [amazonPay], "electronics", offers).bestOffer.discount).toBe(500);
  });

  it("ignores offers for other platforms", () => {
    const r = applyOffers(listing(30000, "flipkart"), [hdfcCredit], "electronics", offers);
    expect(r.bestOffer.discount).toBe(0);
  });
});
