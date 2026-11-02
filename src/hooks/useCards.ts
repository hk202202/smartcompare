"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import type { UserCard } from "@/lib/types";

const STORAGE_KEY = "smartcompare:cards";

/** Signed-in users keep cards in the database; guests keep them in localStorage. */
export function useCards() {
  const { status } = useSession();
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const signedIn = status === "authenticated";

  const load = useCallback(async () => {
    if (status === "loading") return;
    setLoading(true);
    if (signedIn) {
      const res = await fetch("/api/cards");
      setCards(res.ok ? (await res.json()).cards : []);
    } else {
      setCards(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
    }
    setLoading(false);
  }, [signedIn, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const addCard = async (card: Omit<UserCard, "id">) => {
    if (signedIn) {
      const res = await fetch("/api/cards", { method: "POST", body: JSON.stringify(card) });
      if (!res.ok) throw new Error((await res.json()).error ?? "Could not save card");
      await load();
    } else {
      const next = [...cards, { ...card, id: crypto.randomUUID() }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setCards(next);
    }
  };

  const removeCard = async (id: string) => {
    if (signedIn) {
      await fetch(`/api/cards?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      await load();
    } else {
      const next = cards.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setCards(next);
    }
  };

  return { cards, loading: loading || status === "loading", signedIn, addCard, removeCard };
}
