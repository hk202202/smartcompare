import { ProductGrid } from "@/components/ProductGrid";
import { SearchBar } from "@/components/SearchBar";
import { searchCatalog } from "@/lib/platforms/catalog";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "" } = await searchParams;
  const products = searchCatalog(q, category || undefined);

  return (
    <div className="space-y-6">
      <SearchBar initialQuery={q} initialCategory={category} />
      <p className="text-sm text-slate-500">
        {products.length} result{products.length === 1 ? "" : "s"} {q && <>for &ldquo;{q}&rdquo;</>}
      </p>
      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          No products matched. Try &ldquo;iphone&rdquo;, &ldquo;headphones&rdquo; or &ldquo;milk&rdquo;.
        </p>
      )}
    </div>
  );
}
