import type { PlatformAdapter, PricePoint } from "@/lib/platforms/adapter";
import { PLATFORMS } from "@/lib/platforms/platforms";
import type { Listing, PlatformId, Product } from "@/lib/types";

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const rand = (seed: string) => (hash(seed) % 10000) / 10000;

const DELIVERY: Record<PlatformId, [number, number]> = {
  amazon: [1440, 2880],
  flipkart: [1440, 4320],
  croma: [2880, 4320],
  reliance: [2880, 5760],
  blinkit: [8, 15],
  zepto: [8, 14],
  instamart: [12, 25],
  bigbasket: [30, 120],
};

const QUICK_ELECTRONICS = new Set(["iphone-16-128", "airpods-pro-2", "boat-airdopes-141", "redmi-note-14-pro"]);

function sellsProduct(platform: PlatformId, product: Product): boolean {
  if (!PLATFORMS[platform].categories.includes(product.category)) return false;
  if (product.category === "electronics" && (platform === "blinkit" || platform === "zepto")) {
    return QUICK_ELECTRONICS.has(product.id);
  }
  return true;
}

function priceOn(platform: PlatformId, product: Product, day: string): number {
  const base = rand(`${platform}:${product.id}`);
  const drift = rand(`${platform}:${product.id}:${day}`) - 0.5;
  const isQuick = DELIVERY[platform][1] < 200;
  const maxDiscount = product.category === "electronics" ? 0.16 : 0.12;
  let factor = 1 - base * maxDiscount + drift * 0.03;
  if (isQuick && product.category === "electronics") factor += 0.03;
  const price = Math.min(product.mrp, product.mrp * factor);
  return product.mrp >= 1000 ? Math.round(price / 10) * 10 - 1 : Math.round(price);
}

function deliveryLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} mins`;
  const days = Math.round(minutes / 1440);
  return days <= 1 ? "Tomorrow" : `In ${days} days`;
}

const today = () => new Date().toISOString().slice(0, 10);

export function createMockAdapter(platform: PlatformId): PlatformAdapter {
  return {
    platform,
    async getListing(product): Promise<Listing | null> {
      if (!sellsProduct(platform, product)) return null;
      const [min, max] = DELIVERY[platform];
      const deliveryMinutes = Math.round(min + rand(`${platform}:${product.id}:eta`) * (max - min));
      return {
        productId: product.id,
        platform,
        title: product.name,
        price: priceOn(platform, product, today()),
        mrp: product.mrp,
        inStock: rand(`${platform}:${product.id}:stock:${today()}`) > 0.08,
        deliveryMinutes,
        deliveryLabel: deliveryLabel(deliveryMinutes),
        url: `https://www.${platform}.com/search?q=${encodeURIComponent(product.name)}`,
        fetchedAt: new Date().toISOString(),
      };
    },
    async getHistory(product, days): Promise<PricePoint[]> {
      if (!sellsProduct(platform, product)) return [];
      const points: PricePoint[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
        points.push({ date: d, price: priceOn(platform, product, d) });
      }
      return points;
    },
  };
}
