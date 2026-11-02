import { notFound } from "next/navigation";
import { AlertButton } from "@/components/AlertButton";
import { CompareView } from "@/components/CompareView";
import { PriceHistory } from "@/components/PriceHistory";
import { inr } from "@/components/ui";
import { getProduct } from "@/lib/platforms/catalog";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">{product.image}</div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-slate-500">
            {product.brand} · MRP {inr(product.mrp)} · {product.category === "grocery" ? "Quick-commerce" : "Electronics"}
          </p>
        </div>
        <AlertButton productId={product.id} mrp={product.mrp} />
      </div>
      <CompareView product={product} />
      <PriceHistory productId={product.id} />
    </div>
  );
}
