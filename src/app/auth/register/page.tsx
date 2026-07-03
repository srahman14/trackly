"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

import {
  AuthShell,
  Field,
  PasswordField,
  Checkbox,
  GoogleButton,
  OrDivider,
} from "@/components/ui/auth-ui";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);

    // Replace with react-hot-toast instead of logging
    if (!password) {
      console.log("Invalid password");
    }

    if (!email) {
      console.log("Invalid email");
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error(error.message);
      return;
    }

    setTimeout(() => setLoading(false), 1400);
    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <>
      <div className="relative md:hidden">
        <div
          className="absolute inset-x-0 top-0 h-64 -z-10 pointer-events-none
        bg-[linear-gradient(to_bottom,rgba(219,234,254,0.9)_0%,rgba(224,231,255,0.6)_60%,transparent_100%)]"
        />
        <div className="flex justify-center pt-6 pb-1">
          <Link href="/" className="flex flex-col items-center gap-1">
            <Image
              src="/icons/watermark-logo-dark.svg"
              alt="icon"
              width={120}
              height={40}
              className="object-contain shrink-0 cursor-default"
              priority
            />
            <p className="text-xs text-muted-foreground">
              privacy-first job tracker
            </p>
          </Link>
        </div>
      </div>

      <AuthShell variant="signup">
        <header className="mb-8 mt-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Start tracking applications in minutes — and stay in control of your
            data.
          </p>
        </header>

        <GoogleButton label="Sign up with Google" />
        <div className="my-5">
          <OrDivider />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            label="Full name"
            id="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Alex Morgan"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Field
            label="Work email"
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordField
            label="Password"
            id="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={password}
            onValueChange={setPassword}
            showStrength
          />

          <Checkbox id="agree" checked={agreed} onChange={setAgreed}>
            I agree to Trackly&apos;s{" "}
            <Link
              href="/terms"
              className="font-medium text-primary hover:underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-primary hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </Checkbox>

          <button
            type="submit"
            disabled={loading || !agreed}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:ring-4 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </AuthShell>
    </>
  );
}
