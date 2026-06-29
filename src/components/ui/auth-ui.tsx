"use client"

import * as React from "react"
import Link from "next/link"
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  Trash2,
  BellRing,
  LockKeyhole,
} from "lucide-react"

import { cn } from "@/lib/utils"
import Image from "next/image"

export function TracklyLogo({
  className,
  invert = false,
}: {
  className?: string
  invert?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="Trackly home"
    >
      <span
        className="font-bold tracking-tighter text-2xl cursor-pointer duration-200 ease-in-out transition-all text-white"
      >
        Trackly
      </span>
    </Link>
  )
}


const FEATURES = [
  {
    icon: BellRing,
    title: "Never forgotten",
    body: "Stale applications resurface so you can act, not lose track.",
  },
  {
    icon: Trash2,
    title: "Intentionally removed",
    body: "Ask companies to delete your profile and confirm it's gone.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy-first by default",
    body: "Your application data stays yours, encrypted end to end.",
  },
]

export function BrandPanel({ variant }: { variant: "login" | "signup" }) {
  return (
    <aside className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
    <Image
        src="/backgrounds/background-2.png"
        alt="Background"
        fill
        className="object-cover opacity-40 scale-105"
        priority
        />

      {/* soft glow */}
      <div
        aria-hidden
        className="animate-float absolute -right-24 -top-24 size-80 rounded-full bg-primary-foreground/15 blur-3xl"
      />

      <div className="relative z-10">
        <TracklyLogo invert />
      </div>

      <div className="relative z-10 max-w-md">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground ring-1 ring-primary-foreground/20">
          <span className="animate-pulse-ring inline-block size-1.5 rounded-full bg-primary-foreground" />
          Privacy-first job tracking
        </p>
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-primary-foreground xl:text-4xl">
          {variant === "signup"
            ? "Track every application. Leave no data behind."
            : "Welcome back to a cleaner job hunt."}
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/70">
          Trackly follows your applications from "applied" to "archived" and
          makes sure the ones that go nowhere get your data wiped, not
          forgotten.
        </p>

        <ul className="mt-10 space-y-5">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-start gap-3.5">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-primary-foreground/10 text-primary-foreground ring-1 ring-primary-foreground/20">
                <Icon className="size-4.5" strokeWidth={2} />
              </span>
              <div>
                <p className="font-medium text-primary-foreground">{title}</p>
                <p className="text-sm leading-relaxed text-primary-foreground/65">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 flex items-center gap-3 text-sm text-primary-foreground/70">
        <div className="flex -space-x-2">

        </div>
        <span>Trackly, privacy-first job tracker.</span>
      </div>
    </aside>
  )
}

export function AuthShell({
  variant,
  children,
}: {
  variant: "login" | "signup"
  children: React.ReactNode
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <BrandPanel variant={variant} />
      <div className="flex flex-col px-6 py-8 sm:px-10">
        {/* mobile logo */}
        <div className="lg:hidden">
          <TracklyLogo />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="animate-rise w-full max-w-md">{children}</div>
        </div>
      </div>
    </main>
  )
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  id: string
  hint?: string
}

export function Field({ label, id, hint, className, ...props }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "h-11 w-full rounded-xl border border-input bg-card px-3.5 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground",
          "focus:border-ring focus:ring-4 focus:ring-ring/15",
          className,
        )}
        {...props}
      />
      {hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

type PasswordFieldProps = Omit<FieldProps, "type"> & {
  value: string
  onValueChange: (value: string) => void
  showStrength?: boolean
}

function scorePassword(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score // 0-4
}

const STRENGTH_LABELS = ["Too short", "Weak", "Okay", "Strong", "Excellent"]

export function PasswordField({
  label,
  id,
  hint,
  value,
  onValueChange,
  showStrength = false,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false)
  const score = scorePassword(value)
  const pct = (score / 4) * 100

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="h-11 w-full rounded-xl border border-input bg-card px-3.5 pr-11 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/15"
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {visible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>

      {showStrength && value.length > 0 ? (
        <div className="space-y-1 pt-0.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                score <= 1
                  ? "bg-destructive"
                  : score === 2
                    ? "bg-amber-500"
                    : "bg-primary",
              )}
              style={{ width: `${Math.max(pct, 8)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Password strength:{" "}
            <span className="font-medium text-foreground">
              {STRENGTH_LABELS[score]}
            </span>
          </p>
        </div>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export function Checkbox({
  id,
  checked,
  onChange,
  children,
}: {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground"
    >
      <span className="relative mt-0.5 inline-flex">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="grid size-4.5 place-items-center rounded-md border border-input bg-card transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-4 peer-focus-visible:ring-ring/20">
          <Check
            className="size-3 text-primary-foreground transition-opacity peer-checked:opacity-100"
            strokeWidth={3}
          />
        </span>
      </span>
      <span className="leading-relaxed">{children}</span>
    </label>
  )
}

/* -------------------------------------------------------------------------- */
/*  Social button                                                              */
/* -------------------------------------------------------------------------- */

export function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
    >
      <svg className="size-4.5" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        />
      </svg>
      {label}
    </button>
  )
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        or
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
