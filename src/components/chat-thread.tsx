import { Download, Paperclip, Waypoints } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { AppMark } from "@/components/logo";
import { SUGGESTIONS } from "@/lib/catalog";
import { APP_EDITION, APP_SHORT_NAME } from "@/lib/brand";
import type { ChatMessage } from "@/lib/store";
import { downloadBase64, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ChatThread({
  messages,
  pending,
  onSuggestion,
}: {
  messages: ChatMessage[];
  pending: boolean;
  onSuggestion: (prompt: string) => void;
}) {
  if (messages.length === 0 && !pending) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="lumen-stagger flex flex-col items-center text-center">
          <AppMark className="mb-5 size-14 text-brand" />
          <h1 className="font-display text-4xl tracking-[-0.03em] sm:text-5xl">{APP_SHORT_NAME}</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-subtle">{APP_EDITION}</p>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            An agent workspace for files, connectors, and skills. Attach a document or ask about your calendar.
          </p>
        </div>
        <div className="lumen-stagger mt-10 grid w-full gap-2 sm:grid-cols-2">
          {SUGGESTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSuggestion(item.prompt)}
              className="rounded-[20px] border border-border bg-card px-4 py-4 text-left transition-colors duration-[var(--motion-quick)] hover:bg-secondary"
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.prompt}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6">
      {messages.map((message) => (
        <MessageBlock key={message.id} message={message} />
      ))}
      {pending ? (
        <div className="flex items-start gap-3">
          <AppMark className="mt-0.5 size-7 shrink-0 text-muted-foreground" />
          <p className="lumen-shimmer pt-1 text-sm">Thinking</p>
        </div>
      ) : null}
    </div>
  );
}

function MessageBlock({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "items-start")}>
      {!isUser ? <AppMark className="mt-1 size-7 shrink-0 text-muted-foreground" /> : null}
      <div className={cn("min-w-0 max-w-[min(100%,40rem)]", isUser && "flex flex-col items-end")}>
        {message.files && message.files.length > 0 ? (
          <div className="mb-2 flex flex-wrap justify-end gap-1.5">
            {message.files.map((file) => (
              <span
                key={file.name}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground"
              >
                <Paperclip className="size-3" />
                {file.name}
                <span className="text-subtle">{formatBytes(file.size)}</span>
              </span>
            ))}
          </div>
        ) : null}
        <div
          className={cn(
            isUser
              ? "rounded-[22px] rounded-br-[8px] bg-secondary px-4 py-3 text-[15px] leading-relaxed"
              : "pt-1",
          )}
        >
          {isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : <Markdown content={message.content} />}
        </div>
        {message.traces && message.traces.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.traces.map((trace, i) => (
              <span
                key={`${trace.name}-${i}`}
                className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                <Waypoints className="size-3" />
                {trace.name}
              </span>
            ))}
          </div>
        ) : null}
        {message.artifacts && message.artifacts.length > 0 ? (
          <div className="mt-3 grid w-full gap-2">
            {message.artifacts.map((art) => (
              <div
                key={art.id}
                className="flex items-center justify-between gap-3 rounded-[18px] border border-border bg-card px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{art.filename}</p>
                  <p className="text-xs capitalize text-muted-foreground">{art.kind}</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => downloadBase64(art.filename, art.mimeType, art.base64)}
                >
                  <Download className="size-3.5" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
