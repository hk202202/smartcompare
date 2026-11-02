"use client";

import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button, inputClass } from "@/components/ui";

export function AlertButton({ productId, mrp }: { productId: string; mrp: number }) {
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(String(Math.round(mrp * 0.85)));
  const [message, setMessage] = useState<string | null>(null);

  if (status !== "authenticated") {
    return (
      <Link href="/login" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm">
        <Bell className="h-4 w-4" /> Sign in for price alerts
      </Link>
    );
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/alerts", { method: "POST", body: JSON.stringify({ productId, targetPrice: Number(target) }) });
    setMessage(res.ok ? "Alert saved" : (await res.json()).error);
    if (res.ok) setOpen(false);
  };

  return open ? (
    <form onSubmit={save} className="flex items-center gap-2">
      <span className="text-sm text-slate-500">Alert me below ₹</span>
      <input className={`${inputClass} w-28`} type="number" min={1} value={target} onChange={(e) => setTarget(e.target.value)} />
      <Button type="submit">Save</Button>
    </form>
  ) : (
    <Button variant="secondary" onClick={() => setOpen(true)}>
      <Bell className="h-4 w-4" /> {message ?? "Set price alert"}
    </Button>
  );
}
