"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, inputClass, Panel } from "@/components/ui";
import type { CompareResult } from "@/lib/types";

export function AdvisorPanel({ result }: { result: CompareResult }) {
  const [text, setText] = useState(result.summary);
  const [source, setSource] = useState<"ai" | "rules">("rules");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async (q?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/advisor", { method: "POST", body: JSON.stringify({ result, question: q }) });
      const data = await res.json();
      setText(data.text);
      setSource(data.source);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setText(result.summary);
    void ask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <Panel className="space-y-3 border-violet-200 bg-gradient-to-br from-violet-50 to-white">
      <div className="flex items-center gap-2 text-sm font-semibold text-violet-800">
        <Sparkles className="h-4 w-4" /> SmartCompare Advisor
        <span className="text-xs font-normal text-violet-500">{source === "ai" ? "AI" : "Rule-based (set AI_API_KEY for AI)"}</span>
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      </div>
      <p className="text-slate-800">{text}</p>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (question.trim()) void ask(question.trim());
        }}
      >
        <input
          className={inputClass}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask: Is it worth waiting for a sale? Which is better if I need it today?"
        />
        <Button type="submit" disabled={loading} variant="secondary">
          Ask
        </Button>
      </form>
    </Panel>
  );
}
