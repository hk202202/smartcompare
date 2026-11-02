import { googleEnabled, signIn } from "@/auth";
import { LoginForm } from "@/components/LoginForm";
import { Button, Panel } from "@/components/ui";

export default function LoginPage() {
  return (
    <Panel className="mx-auto max-w-sm space-y-5">
      <div>
        <h1 className="text-xl font-bold">Sign in to SmartCompare</h1>
        <p className="text-sm text-slate-500">Sync your cards and price alerts across devices.</p>
      </div>
      {googleEnabled && (
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <Button variant="secondary" className="w-full" type="submit">Continue with Google</Button>
        </form>
      )}
      <LoginForm />
    </Panel>
  );
}
