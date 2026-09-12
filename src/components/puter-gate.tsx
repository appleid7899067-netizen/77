import { Cloud, Shield, UserRound } from "lucide-react";
import { AppMark, PuterMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { APP_DESCRIPTION, APP_EDITION, APP_SHORT_NAME } from "@/lib/brand";
import { usePuterAuth } from "@/lib/puter-auth";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const BENEFITS = [
  { icon: UserRound, label: "Puter identity, not a local nickname" },
  { icon: Cloud, label: "Chats sync to your Puter cloud" },
  { icon: Shield, label: "Guest mode stays on this device" },
];

export function PuterGate({ children }: { children: ReactNode }) {
  const { status } = usePuterAuth();
  if (status === "signed_in" || status === "guest") return <>{children}</>;
  return <PuterLoginScreen />;
}

export function PuterLoginScreen() {
  const { status, error, pending, signIn, continueAsGuest, retry } = usePuterAuth();
  const loading = status === "loading";
  const unavailable = status === "unavailable";

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-5 py-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 puter-login-glow" />
      <div className="relative w-full max-w-md">
        <div className="lumen-stagger rounded-[32px] border border-border bg-card px-6 py-8 sm:px-8">
          <div className="flex flex-col items-center text-center">
            <AppMark className="size-16 text-brand" />
            <h1 className="mt-5 font-display text-4xl tracking-[-0.03em] sm:text-5xl">{APP_SHORT_NAME}</h1>
            <p className="mt-2 text-sm uppercase tracking-[0.22em] text-subtle">{APP_EDITION}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{APP_DESCRIPTION}</p>
          </div>

          <ul className="mt-7 space-y-2.5">
            {BENEFITS.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-left text-sm text-muted-foreground">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-[12px] border border-border bg-secondary">
                  <item.icon className="size-4 text-foreground" />
                </span>
                {item.label}
              </li>
            ))}
          </ul>

          {loading ? (
            <div className="mt-8 space-y-3">
              <div className="flex h-12 items-center justify-center rounded-full bg-secondary text-sm text-muted-foreground">
                Connecting to Puter…
              </div>
              <Button size="lg" variant="ghost" className="h-12 w-full rounded-full text-sm" onClick={continueAsGuest}>
                Continue as guest
              </Button>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              <Button
                size="lg"
                className="h-12 w-full rounded-full text-sm"
                onClick={() => void signIn()}
                disabled={unavailable || pending}
              >
                <PuterMark className="size-4" />
                {pending ? "Waiting for Puter…" : "Continue with Puter"}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-12 w-full rounded-full text-sm"
                onClick={continueAsGuest}
                disabled={pending}
              >
                Continue as guest
              </Button>
              {unavailable ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full rounded-full text-sm"
                  onClick={() => void retry()}
                >
                  Retry Puter
                </Button>
              ) : null}
            </div>
          )}

          {error ? (
            <p
              className={cn(
                "mt-5 text-center text-xs leading-relaxed",
                unavailable ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {error}
            </p>
          ) : (
            <p className="mt-5 text-center text-xs leading-relaxed text-subtle">
              Puter opens a sign-in window. Allow popups, then return here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
