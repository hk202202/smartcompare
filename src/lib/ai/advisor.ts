import { platformName } from "@/lib/platforms/platforms";
import type { CompareResult, RankedListing } from "@/lib/types";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function ruleBasedSummary(product: CompareResult["product"], ranked: RankedListing[]): string {
  const inStock = ranked.filter((l) => l.inStock);
  const winner = inStock[0];
  if (!winner) return `${product.name} is out of stock everywhere right now.`;

  const via = winner.bestOffer.offer
    ? ` using your ${winner.bestOffer.card?.label || winner.bestOffer.card?.bank} card (${winner.bestOffer.offer.description})`
    : "";
  const parts = [`Buy on ${platformName(winner.platform)} for ${inr(winner.bestOffer.effectivePrice)}${via}.`];

  const runnerUp = inStock[1];
  if (runnerUp) {
    const diff = runnerUp.bestOffer.effectivePrice - winner.bestOffer.effectivePrice;
    const other = platformName(runnerUp.platform);
    parts.push(
      diff > 0
        ? `That's ${inr(diff)} cheaper than ${other}.`
        : diff === 0
          ? `${other} has the same price but is slower or less reliable.`
          : `${other} is ${inr(-diff)} cheaper but slower or less reliable.`,
    );
  }
  if (product.category === "grocery") parts.push(`Arrives in ${winner.deliveryLabel}.`);
  return parts.join(" ");
}

/**
 * Uses any OpenAI-compatible chat endpoint (OpenAI, OpenRouter, Groq, etc.).
 * Returns null when AI_API_KEY is unset or the call fails so callers fall back to the rule-based summary.
 */
export async function aiSummary(result: CompareResult, question?: string): Promise<string | null> {
  const key = process.env.AI_API_KEY;
  if (!key) return null;

  const compact = result.listings.slice(0, 6).map((l) => ({
    platform: platformName(l.platform),
    price: l.price,
    finalPrice: l.bestOffer.effectivePrice,
    offer: l.bestOffer.offer?.description ?? null,
    delivery: l.deliveryLabel,
    inStock: l.inStock,
    reasons: l.reasons,
  }));

  try {
    const res = await fetch(`${process.env.AI_BASE_URL ?? "https://api.openai.com/v1"}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.AI_MODEL ?? "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content:
              "You are SmartCompare, an Indian shopping advisor. Using only the JSON provided, recommend where to buy in 2-4 short sentences. Mention the final price in ₹, the card offer to use, and one trade-off. Never invent prices or offers.",
          },
          {
            role: "user",
            content: JSON.stringify({ product: result.product.name, listings: compact, question: question ?? null }),
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}
