import { describe, expect, it } from "vitest";
import { rankListings } from "@/lib/ranking/engine";
import type { PricedListing } from "@/lib/types";

const priced = (platform: PricedListing["platform"], effectivePrice: number, deliveryMinutes: number, inStock = true): PricedListing => ({
  productId: "p",
  platform,
  title: "x",
  price: effectivePrice,
  mrp: effectivePrice,
  inStock,
  deliveryMinutes,
  deliveryLabel: `${deliveryMinutes}m`,
  url: "",
  fetchedAt: "",
  bestOffer: { card: null, offer: null, discount: 0, effectivePrice },
  allOffers: [],
});

describe("rankListings", () => {
  it("ranks the cheapest final price first for electronics", () => {
    const r = rankListings([priced("amazon", 70000, 1440), priced("flipkart", 66000, 2880), priced("croma", 72000, 2880)], "electronics");
    expect(r[0].platform).toBe("flipkart");
    expect(r[0].rank).toBe(1);
    expect(r[0].reasons).toContain("Lowest final price");
  });

  it("lets delivery speed win small price gaps for groceries", () => {
    const r = rankListings([priced("bigbasket", 50, 120), priced("blinkit", 52, 10)], "grocery");
    expect(r[0].platform).toBe("blinkit");
  });

  it("puts out-of-stock listings last with rank 0", () => {
    const r = rankListings([priced("amazon", 100, 1440, false), priced("flipkart", 120, 1440)], "electronics");
    expect(r.map((l) => l.platform)).toEqual(["flipkart", "amazon"]);
    expect(r[1].rank).toBe(0);
  });
});
