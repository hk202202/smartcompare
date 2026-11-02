"use client";

import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Button, inr, Panel } from "@/components/ui";
import type { Product } from "@/lib/types";

interface Alert {
  id: string;
  productId: string;
  targetPrice: number;
  triggeredAt: string | null;
  product: Product | null;
}

export default function AlertsPage() {
  const { status } = useSession();
  const [alerts, setAlerts] = useState<Alert[] | null>(null);

  const load = () => fetch("/api/alerts").then(async (r) => setAlerts(r.ok ? (await r.json()).alerts : []));

  useEffect(() => {
    if (status === "authenticated") void load();
  }, [status]);

  if (status === "unauthenticated") {
    return (
      <Panel className="mx-auto max-w-md text-center">
        <p className="mb-4 text-slate-600">Sign in to get notified when prices drop.</p>
        <Link href="/login" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Sign in</Link>
      </Panel>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Price alerts</h1>
      {!alerts ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : alerts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          No alerts yet. Open any product and click &ldquo;Set price alert&rdquo;.
        </p>
      ) : (
        alerts.map((a) => (
          <Panel key={a.id} className="flex items-center gap-4 py-4">
            <span className="text-3xl">{a.product?.image}</span>
            <div className="flex-1">
              <Link href={`/product/${a.productId}`} className="font-medium hover:underline">{a.product?.name ?? a.productId}</Link>
              <p className="text-sm text-slate-500">Notify below {inr(a.targetPrice)}</p>
            </div>
            {a.triggeredAt ? <Badge className="bg-green-100 text-green-700">Price dropped!</Badge> : <Badge className="bg-slate-100 text-slate-600">Watching</Badge>}
            <Button variant="danger" aria-label="Delete alert" onClick={async () => { await fetch(`/api/alerts?id=${a.id}`, { method: "DELETE" }); void load(); }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </Panel>
        ))
      )}
    </div>
  );
}
