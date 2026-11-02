"use client";

import { CreditCard, ExternalLink, Loader2, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AdvisorPanel } from "@/components/AdvisorPanel";
import { Badge, cn, inr, Panel } from "@/components/ui";
import { useCards } from "@/hooks/useCards";
import { PLATFORMS } from "@/lib/platforms/platforms";
import type { CompareResult, Product, RankedListing } from "@/lib/types";

export function CompareView({ product }: { product: Product }) {
  const { cards, loading: cardsLoading } = useCards();
  const [result, setResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cardsLoading) return;
    setError(null);
    fetch("/api/compare", { method: "POST", body: JSON.stringify({ productId: product.id, cards }) })
      .then(async (r) => (r.ok ? setResult(await r.json()) : setError((await r.json()).error)))
      .catch(() => setError("Could not load prices"));
  }, [product.id, cards, cardsLoading]);

  if (error) return <Panel className="text-red-600">{error}</Panel>;
  if (!result)
    return (
      <Panel className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Checking {Object.keys(PLATFORMS).length} stores...
      </Panel>
    );

  return (
    <div className="space-y-6">
      {result.winner && <WinnerCard winner={result.winner} savings={result.savingsVsWorst} />}

      {!cards.length && (
        <Panel className="flex flex-wrap items-center justify-between gap-3 border-indigo-200 bg-indigo-50">
          <p className="flex items-center gap-2 text-sm text-indigo-900">
            <CreditCard className="h-4 w-4" /> Add the cards you own to see bank discounts and cashback in your final price.
          </p>
          <Link href="/cards" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white">
            Add cards
          </Link>
        </Panel>
      )}

      <AdvisorPanel result={result} />

      <Panel className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Store</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Best card offer</th>
              <th className="px-4 py-3">Final price</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {result.listings.map((l) => (
              <ListingRow key={l.platform} listing={l} isWinner={l.platform === result.winner?.platform} />
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function WinnerCard({ winner, savings }: { winner: RankedListing; savings: number }) {
  const p = PLATFORMS[winner.platform];
  return (
    <Panel className="flex flex-wrap items-center gap-5 border-amber-300 bg-gradient-to-r from-amber-50 to-white">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-white">
        <Trophy className="h-7 w-7" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Best place to buy</p>
        <p className="text-2xl font-bold">
          {p.name} · {inr(winner.bestOffer.effectivePrice)}
        </p>
        <p className="mt-1 text-sm text-slate-600">{winner.reasons.join(" · ")}</p>
      </div>
      {savings > 0 && (
        <div className="text-right">
          <p className="text-xs text-slate-500">You save up to</p>
          <p className="text-xl font-bold text-green-600">{inr(savings)}</p>
        </div>
      )}
    </Panel>
  );
}

function ListingRow({ listing: l, isWinner }: { listing: RankedListing; isWinner: boolean }) {
  const p = PLATFORMS[l.platform];
  const offer = l.bestOffer;
  return (
    <tr className={cn("border-b border-slate-100 last:border-0", isWinner && "bg-amber-50/60", !l.inStock && "opacity-50")}>
      <td className="px-4 py-3 font-semibold text-slate-400">{l.rank || "-"}</td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-2 font-medium">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
          {p.name}
          {isWinner && <Badge className="bg-amber-100 text-amber-800">Best Buy</Badge>}
        </span>
      </td>
      <td className="px-4 py-3">
        {inr(l.price)}
        {l.mrp > l.price && <span className="ml-1 text-xs text-slate-400 line-through">{inr(l.mrp)}</span>}
      </td>
      <td className="px-4 py-3 text-xs">
        {offer.offer ? (
          <span className="text-green-700">
            −{inr(offer.discount)} {offer.offer.kind === "cashback" ? "cashback" : "instant"} ·{" "}
            {offer.card?.label || `${offer.card?.bank} ${offer.card?.type}`}
          </span>
        ) : (
          <span className="text-slate-400">No offer on your cards</span>
        )}
      </td>
      <td className="px-4 py-3 font-semibold">{l.inStock ? inr(offer.effectivePrice) : "Out of stock"}</td>
      <td className="px-4 py-3 text-slate-600">{l.deliveryLabel}</td>
      <td className="px-4 py-3">
        <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-indigo-600 hover:underline">
          Visit <ExternalLink className="h-3 w-3" />
        </a>
      </td>
    </tr>
  );
}
