"use client";

import { CreditCard, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge, Button, inputClass, Panel } from "@/components/ui";
import { useCards } from "@/hooks/useCards";
import { BANKS, CARD_PRODUCTS } from "@/lib/offers/data";
import type { CardNetwork, CardType } from "@/lib/types";

export default function CardsPage() {
  const { cards, loading, signedIn, addCard, removeCard } = useCards();
  const [bank, setBank] = useState<string>("HDFC");
  const [type, setType] = useState<CardType>("credit");
  const [network, setNetwork] = useState<CardNetwork>("visa");
  const [productId, setProductId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const variants = CARD_PRODUCTS.filter((p) => p.bank === bank && p.type === type);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const product = CARD_PRODUCTS.find((p) => p.id === productId);
    try {
      await addCard({ bank, type, network, productId: product?.id ?? null, label: product?.name ?? null });
      setProductId("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Cards</h1>
        <p className="mt-1 text-sm text-slate-600">
          Tell us which cards you have, and every comparison will include the bank discounts and cashback you actually qualify for.
          We only store the bank, card type and network, <strong>never card numbers</strong>.
        </p>
        {!signedIn && <p className="mt-2 text-xs text-amber-700">You&apos;re browsing as a guest, so cards are saved on this device only. Sign in to sync them.</p>}
      </div>

      <Panel>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Bank
            <select className={inputClass} value={bank} onChange={(e) => { setBank(e.target.value); setProductId(""); }}>
              {BANKS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <label className="text-sm">
            Type
            <select className={inputClass} value={type} onChange={(e) => { setType(e.target.value as CardType); setProductId(""); }}>
              <option value="credit">Credit card</option>
              <option value="debit">Debit card</option>
            </select>
          </label>
          <label className="text-sm">
            Network
            <select className={inputClass} value={network} onChange={(e) => setNetwork(e.target.value as CardNetwork)}>
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="rupay">RuPay</option>
              <option value="amex">American Express</option>
            </select>
          </label>
          <label className="text-sm">
            Specific card (optional)
            <select className={inputClass} value={productId} onChange={(e) => setProductId(e.target.value)} disabled={!variants.length}>
              <option value="">{variants.length ? "Any / other" : "No co-branded cards"}</option>
              {variants.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </label>
          <div className="sm:col-span-2 flex items-center justify-between">
            {error ? <p className="text-sm text-red-600">{error}</p> : <span />}
            <Button type="submit">Add card</Button>
          </div>
        </form>
      </Panel>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : cards.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No cards yet.</p>
        ) : (
          cards.map((c) => (
            <Panel key={c.id} className="flex items-center gap-4 py-4">
              <div className="flex h-10 w-14 items-center justify-center rounded-md bg-gradient-to-br from-slate-800 to-slate-600 text-white">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{c.label ?? `${c.bank} ${c.type === "credit" ? "Credit" : "Debit"} Card`}</p>
                <div className="mt-1 flex gap-1.5">
                  <Badge className="bg-slate-100 text-slate-700">{c.bank}</Badge>
                  <Badge className="bg-slate-100 text-slate-700 capitalize">{c.type}</Badge>
                  <Badge className="bg-slate-100 text-slate-700 uppercase">{c.network}</Badge>
                </div>
              </div>
              <Button variant="danger" onClick={() => removeCard(c.id)} aria-label="Remove card">
                <Trash2 className="h-4 w-4" />
              </Button>
            </Panel>
          ))
        )}
      </div>
    </div>
  );
}
