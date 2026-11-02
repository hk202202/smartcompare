import type { Platform, PlatformId } from "@/lib/types";

export const PLATFORMS: Record<PlatformId, Platform> = {
  amazon: { id: "amazon", name: "Amazon", categories: ["electronics", "grocery"], trustScore: 0.95, returnDays: 7, color: "#ff9900" },
  flipkart: { id: "flipkart", name: "Flipkart", categories: ["electronics", "grocery"], trustScore: 0.92, returnDays: 7, color: "#2874f0" },
  croma: { id: "croma", name: "Croma", categories: ["electronics"], trustScore: 0.9, returnDays: 7, color: "#12daa8" },
  reliance: { id: "reliance", name: "Reliance Digital", categories: ["electronics"], trustScore: 0.88, returnDays: 7, color: "#e42529" },
  blinkit: { id: "blinkit", name: "Blinkit", categories: ["grocery", "electronics"], trustScore: 0.9, returnDays: 0, color: "#f8cb46" },
  zepto: { id: "zepto", name: "Zepto", categories: ["grocery", "electronics"], trustScore: 0.88, returnDays: 0, color: "#5b2a86" },
  instamart: { id: "instamart", name: "Swiggy Instamart", categories: ["grocery"], trustScore: 0.88, returnDays: 0, color: "#fc8019" },
  bigbasket: { id: "bigbasket", name: "BigBasket", categories: ["grocery"], trustScore: 0.9, returnDays: 0, color: "#84c225" },
};

export const platformName = (id: PlatformId) => PLATFORMS[id].name;
