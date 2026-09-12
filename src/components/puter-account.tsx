import { LogOut } from "lucide-react";
import { PuterMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { usePuterAuth } from "@/lib/puter-auth";

function syncLabel(syncStatus: ReturnType<typeof usePuterAuth>["syncStatus"], signedIn: boolean) {
  if (!signedIn) return "Local only · sign in with Puter";
  if (syncStatus === "syncing") return "Syncing with Puter…";
  if (syncStatus === "error") return "Cloud sync paused";
  if (syncStatus === "synced") return "Chats synced to Puter";
  return "Puter account";
}

export function PuterAccount() {
  const { status, user, pending, syncStatus, signIn, signOut } = usePuterAuth();
  const signedIn = status === "signed_in" && user;

  return (
    <div className="rounded-[16px] border border-border bg-secondary/40 p-2">
      <div className="flex items-center gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[12px] border border-border bg-card">
          {signedIn ? (
            <span className="text-xs font-medium uppercase">{user.username.slice(0, 2)}</span>
          ) : (
            <PuterMark className="size-4 text-muted-foreground" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{signedIn ? user.username : "Guest"}</span>
          <span className="block truncate text-[11px] text-subtle">{syncLabel(syncStatus, Boolean(signedIn))}</span>
        </span>
        {signedIn ? (
          <Button
            size="icon"
            variant="ghost"
            className="size-10 shrink-0"
            onClick={() => void signOut()}
            aria-label="Sign out of Puter"
          >
            <LogOut className="size-4" />
          </Button>
        ) : null}
      </div>
      {!signedIn ? (
        <Button
          size="sm"
          className="mt-2 h-10 w-full rounded-full text-xs"
          onClick={() => void signIn()}
          disabled={pending}
        >
          <PuterMark className="size-3.5" />
          {pending ? "Waiting for Puter…" : "Sign in with Puter"}
        </Button>
      ) : null}
    </div>
  );
}
