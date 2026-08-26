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
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      console.log("Invalid credentials");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Error logging in, please re-enter your credentials.");
    setLoading(false);  
      return;
    }

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

      <AuthShell variant="login">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Sign in to Trackly
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Pick up where you left off and keep your applications under control.
          </p>
        </header>

        <GoogleButton label="Continue with Google" />
        <div className="my-5">
          <OrDivider />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            label="Email"
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="space-y-1.5">
            <PasswordField
              label="Password"
              id="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onValueChange={setPassword}
            />
          </div>

          <div className="flex items-center justify-between">
            <Checkbox id="remember" checked={remember} onChange={setRemember}>
              Remember me
            </Checkbox>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:ring-4 focus-visible:ring-ring/30 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          New to Trackly?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Create an account
          </Link>
        </p>
      </AuthShell>
    </>
  );
}
