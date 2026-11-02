import type { Product } from "@/lib/types";

export const CATALOG: Product[] = [
  { id: "iphone-16-128", name: "Apple iPhone 16 (128 GB) - Black", brand: "Apple", category: "electronics", image: "📱", keywords: ["iphone", "apple", "phone", "mobile", "16"], mrp: 79900 },
  { id: "iphone-16-pro-256", name: "Apple iPhone 16 Pro (256 GB) - Desert Titanium", brand: "Apple", category: "electronics", image: "📱", keywords: ["iphone", "apple", "pro", "phone", "mobile"], mrp: 129900 },
  { id: "galaxy-s25-256", name: "Samsung Galaxy S25 5G (12 GB, 256 GB) - Icyblue", brand: "Samsung", category: "electronics", image: "📱", keywords: ["samsung", "galaxy", "s25", "phone", "mobile", "android"], mrp: 89999 },
  { id: "oneplus-13-256", name: "OnePlus 13 (12 GB, 256 GB) - Midnight Ocean", brand: "OnePlus", category: "electronics", image: "📱", keywords: ["oneplus", "13", "phone", "mobile", "android"], mrp: 72999 },
  { id: "pixel-9-128", name: "Google Pixel 9 (12 GB, 128 GB) - Obsidian", brand: "Google", category: "electronics", image: "📱", keywords: ["pixel", "google", "phone", "mobile", "android"], mrp: 79999 },
  { id: "redmi-note-14-pro", name: "Redmi Note 14 Pro 5G (8 GB, 256 GB)", brand: "Xiaomi", category: "electronics", image: "📱", keywords: ["redmi", "xiaomi", "note", "phone", "mobile", "budget"], mrp: 28999 },
  { id: "sony-xm5", name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones", brand: "Sony", category: "electronics", image: "🎧", keywords: ["sony", "headphones", "xm5", "noise", "audio"], mrp: 34990 },
  { id: "airpods-pro-2", name: "Apple AirPods Pro (2nd Gen) USB-C", brand: "Apple", category: "electronics", image: "🎧", keywords: ["airpods", "apple", "earbuds", "audio"], mrp: 24900 },
  { id: "macbook-air-m4", name: "Apple MacBook Air 13\" M4 (16 GB, 256 GB)", brand: "Apple", category: "electronics", image: "💻", keywords: ["macbook", "apple", "laptop", "m4", "air"], mrp: 99900 },
  { id: "boat-airdopes-141", name: "boAt Airdopes 141 TWS Earbuds", brand: "boAt", category: "electronics", image: "🎧", keywords: ["boat", "airdopes", "earbuds", "audio", "budget"], mrp: 4490 },

  { id: "amul-taaza-1l", name: "Amul Taaza Toned Milk 1 L", brand: "Amul", category: "grocery", image: "🥛", keywords: ["milk", "amul", "taaza", "dairy"], mrp: 56 },
  { id: "aashirvaad-atta-5kg", name: "Aashirvaad Shudh Chakki Atta 5 kg", brand: "Aashirvaad", category: "grocery", image: "🌾", keywords: ["atta", "aashirvaad", "flour", "wheat"], mrp: 320 },
  { id: "maggi-12", name: "Maggi 2-Minute Masala Noodles (Pack of 12)", brand: "Nestle", category: "grocery", image: "🍜", keywords: ["maggi", "noodles", "nestle", "instant"], mrp: 168 },
  { id: "coke-750", name: "Coca-Cola Soft Drink 750 ml", brand: "Coca-Cola", category: "grocery", image: "🥤", keywords: ["coke", "coca-cola", "cola", "drink", "soft"], mrp: 45 },
  { id: "banana-12", name: "Banana Robusta (1 dozen)", brand: "Fresh", category: "grocery", image: "🍌", keywords: ["banana", "fruit", "fresh"], mrp: 80 },
  { id: "tata-salt-1kg", name: "Tata Salt Iodised 1 kg", brand: "Tata", category: "grocery", image: "🧂", keywords: ["salt", "tata"], mrp: 28 },
  { id: "fortune-oil-1l", name: "Fortune Sunlite Refined Sunflower Oil 1 L", brand: "Fortune", category: "grocery", image: "🫒", keywords: ["oil", "fortune", "sunflower", "cooking"], mrp: 175 },
  { id: "eggs-12", name: "Farm Fresh White Eggs (Pack of 12)", brand: "Fresh", category: "grocery", image: "🥚", keywords: ["eggs", "egg", "fresh"], mrp: 105 },
];

export const getProduct = (id: string) => CATALOG.find((p) => p.id === id) ?? null;

export function searchCatalog(query: string, category?: string): Product[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  return CATALOG.filter((p) => !category || p.category === category)
    .map((p) => {
      const hay = `${p.name} ${p.brand} ${p.keywords.join(" ")}`.toLowerCase();
      const score = tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
      return { p, score };
    })
    .filter(({ score }) => tokens.length === 0 || score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ p }) => p);
}
