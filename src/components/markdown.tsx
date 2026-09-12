import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function inlineFormat(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("`")) {
      parts.push(
        <code key={i++} className="rounded-[6px] bg-secondary px-1.5 py-0.5 font-mono text-[0.85em]">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      parts.push(
        <strong key={i++} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) {
        parts.push(
          <a
            key={i++}
            href={m[2]}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 decoration-border hover:text-foreground"
          >
            {m[1]}
          </a>,
        );
      }
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  const blocks = content.split("\n\n");
  return (
    <div className={cn("space-y-3 text-[15px] leading-relaxed text-foreground/92", className)}>
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith("```")) {
          const inner = trimmed.replace(/^```[a-zA-Z0-9]*\n?/, "").replace(/```$/, "");
          return (
            <pre
              key={idx}
              className="overflow-x-auto rounded-[var(--radius-md)] border border-border bg-secondary/50 p-3 font-mono text-[13px] leading-snug"
            >
              {inner}
            </pre>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-base font-semibold">
              {inlineFormat(trimmed.slice(4))}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-lg font-semibold tracking-tight">
              {inlineFormat(trimmed.slice(3))}
            </h2>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} className="font-display text-2xl tracking-tight">
              {inlineFormat(trimmed.slice(2))}
            </h1>
          );
        }
        if (trimmed.split("\n").every((l) => /^[-*]\s+/.test(l) || l.trim() === "")) {
          return (
            <ul key={idx} className="list-disc space-y-1 pl-5">
              {trimmed
                .split("\n")
                .filter(Boolean)
                .map((l, i) => (
                  <li key={i}>{inlineFormat(l.replace(/^[-*]\s+/, ""))}</li>
                ))}
            </ul>
          );
        }
        if (trimmed.split("\n").every((l) => /^\d+\.\s+/.test(l) || l.trim() === "")) {
          return (
            <ol key={idx} className="list-decimal space-y-1 pl-5">
              {trimmed
                .split("\n")
                .filter(Boolean)
                .map((l, i) => (
                  <li key={i}>{inlineFormat(l.replace(/^\d+\.\s+/, ""))}</li>
                ))}
            </ol>
          );
        }
        return (
          <p key={idx} className="whitespace-pre-wrap">
            {inlineFormat(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
