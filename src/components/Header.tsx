import { CreditCard, Bell, Scale } from "lucide-react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui";

export async function Header() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Scale className="h-6 w-6 text-indigo-600" />
          Smart<span className="text-indigo-600">Compare</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/cards" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
            <CreditCard className="h-4 w-4" /> My Cards
          </Link>
          <Link href="/alerts" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
            <Bell className="h-4 w-4" /> Alerts
          </Link>
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button variant="ghost" type="submit" title={session.user.email ?? ""}>
                Sign out
              </Button>
            </form>
          ) : (
            <Link href="/login" className="rounded-lg bg-indigo-600 px-3 py-2 font-medium text-white hover:bg-indigo-500">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
