import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import AuthPageShell from "@/components/auth/AuthPageShell";
import { authCopy } from "@/config/auth";

export default function LoginView() {
  return (
    <AuthPageShell title={authCopy.loginTitle} subtitle={authCopy.loginSubtitle}>
      <LoginForm />
      <p className="mt-4 text-center text-xs leading-6 text-[color:var(--foreground-muted)]">
        {authCopy.loginHint}
      </p>
      <p className="mt-5 text-center text-sm text-[color:var(--foreground-muted)]">
        {`Don't have an account? `}
        <Link href="/signup" className="font-semibold text-[color:var(--accent-strong)] hover:underline">
          Sign up
        </Link>
      </p>
    </AuthPageShell>
  );
}
