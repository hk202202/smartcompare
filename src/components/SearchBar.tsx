"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, cn } from "@/components/ui";

const TABS = [
  { id: "", label: "All" },
  { id: "electronics", label: "Phones & Electronics" },
  { id: "grocery", label: "Groceries (10-min apps)" },
];

export function SearchBar({ initialQuery = "", initialCategory = "" }: { initialQuery?: string; initialCategory?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ q });
    if (category) params.set("category", category);
    router.push(`/search?${params}`);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100">
        <Search className="ml-2 h-5 w-5 self-center text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search iPhone 16, Galaxy S25, milk, atta..."
          className="flex-1 bg-transparent px-1 py-2 outline-none"
        />
        <Button type="submit">Compare</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setCategory(t.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              category === t.id ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-600",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    </form>
  );
}
