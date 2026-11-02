import type { Listing, PlatformId, Product } from "@/lib/types";

export interface PricePoint {
  date: string;
  price: number;
}

export interface PlatformAdapter {
  platform: PlatformId;
  /** Return this platform's listing for a canonical product, or null if not sold here. */
  getListing(product: Product): Promise<Listing | null>;
  getHistory?(product: Product, days: number): Promise<PricePoint[]>;
}
