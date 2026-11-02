import { CreditCard, Sparkles, Trophy, Zap } from "lucide-react";
import { ProductGrid } from "@/components/ProductGrid";
import { SearchBar } from "@/components/SearchBar";
import { CATALOG } from "@/lib/platforms/catalog";
import { PLATFORMS } from "@/lib/platforms/platforms";

const FEATURES = [
  { icon: Trophy, title: "Best Buy winner", text: "We rank every store on final price, delivery speed and trust, then tell you where to buy." },
  { icon: CreditCard, title: "Your card offers applied", text: "Add the cards you own. We apply bank discounts and cashback to show your real price." },
  { icon: Zap, title: "10-minute apps too", text: "Blinkit, Zepto, Instamart and BigBasket compared side by side for groceries." },
  { icon: Sparkles, title: "AI shopping advisor", text: "Ask follow-up questions and get a plain-English recommendation." },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="mx-auto max-w-3xl space-y-6 pt-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          One search. Every store. <span className="text-indigo-600">Your best price.</span>
        </h1>
        <p className="text-slate-600">
          Compare {Object.values(PLATFORMS).map((p) => p.name).join(", ")}, with your credit and debit card offers applied.
        </p>
        <div className="text-left">
          <SearchBar />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <Icon className="h-6 w-6 text-indigo-600" />
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Trending phones & electronics</h2>
        <ProductGrid products={CATALOG.filter((p) => p.category === "electronics").slice(0, 6)} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Daily essentials on quick-commerce</h2>
        <ProductGrid products={CATALOG.filter((p) => p.category === "grocery").slice(0, 6)} />
      </section>
    </div>
  );
}
