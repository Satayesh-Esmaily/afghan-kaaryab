import Link from "next/link";
import AuthPageShell from "@/components/auth/AuthPageShell";
import SignupForm from "@/components/auth/SignupForm";
import { authCopy } from "@/config/auth";

export default function SignupView() {
  return (
    <AuthPageShell title={authCopy.signupTitle}>
      <SignupForm />
      <p className="mt-5 text-center text-sm text-[color:var(--foreground-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[color:var(--accent-strong)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthPageShell>
  );
}
