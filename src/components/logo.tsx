import { cn } from "@/lib/utils";

export function AppMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-foreground", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
      <circle cx="16" cy="16" r="8.2" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
      <path
        d="M21.9 10.1 25.2 6.8M10.1 10.1 6.8 6.8M10.1 21.9 6.8 25.2M21.9 21.9 25.2 25.2"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path d="M11 10.3h10.2v2.85h-3.85L13.35 21.9h-2.95l4.55-8.75H11z" fill="currentColor" />
    </svg>
  );
}

export function PuterMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-current", className)} fill="none" aria-hidden="true">
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.5 16V8.6h4.15c2.2 0 3.55 1.2 3.55 3.05 0 1.9-1.4 3.15-3.6 3.15H10.7"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
