"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"

import {
  AuthShell,
  Field,
  PasswordField,
  Checkbox,
  GoogleButton,
  OrDivider,
} from "@/components/ui/auth-ui"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Replace with your real authentication call.
    setTimeout(() => setLoading(false), 1400)
  }

  return (
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
  )
}
