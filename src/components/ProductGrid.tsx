import Link from "next/link";
import { inr, Panel } from "@/components/ui";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <Link key={p.id} href={`/product/${p.id}`}>
          <Panel className="flex h-full items-center gap-4 transition hover:border-indigo-300 hover:shadow-md">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-3xl">{p.image}</div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-medium text-slate-900">{p.name}</p>
              <p className="mt-1 text-xs text-slate-500">
                {p.brand} · MRP {inr(p.mrp)}
              </p>
            </div>
          </Panel>
        </Link>
      ))}
    </div>
  );
}
