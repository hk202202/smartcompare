import { LoginForm } from "@/components/LoginForm";
import { Panel } from "@/components/ui";

export default function RegisterPage() {
  return (
    <Panel className="mx-auto max-w-sm space-y-5">
      <div>
        <h1 className="text-xl font-bold">Create your account</h1>
        <p className="text-sm text-slate-500">Save cards and get price-drop alerts.</p>
      </div>
      <LoginForm mode="register" />
    </Panel>
  );
}
