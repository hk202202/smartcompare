"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button, inputClass } from "@/components/ui";

export function LoginForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
        if (!res.ok) throw new Error((await res.json()).error);
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error("Invalid email or password");
      window.location.href = "/cards";
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {mode === "register" && <input className={inputClass} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />}
      <input className={inputClass} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className={inputClass} type="password" placeholder="Password (8+ characters)" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {mode === "register" ? "Create account" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-slate-500">
        {mode === "register" ? (
          <>Already have an account? <Link href="/login" className="text-indigo-600">Sign in</Link></>
        ) : (
          <>New here? <Link href="/register" className="text-indigo-600">Create an account</Link></>
        )}
      </p>
    </form>
  );
}
