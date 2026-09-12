import { useRef, useState } from "react";
import { ArrowUp, Paperclip, Puzzle, X } from "lucide-react";
import { FILE_ACCEPT, extractAttachedFiles } from "@/lib/files";
import type { AttachedFile } from "@/lib/agent/types";
import { APP_SHORT_NAME } from "@/lib/brand";
import { formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function Composer({
  disabled,
  onSend,
  onOpenPlugins,
}: {
  disabled?: boolean;
  onSend: (text: string, files: AttachedFile[]) => void;
  onOpenPlugins: () => void;
}) {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const text = value.trim();
    if (disabled || parsing) return;
    if (!text && files.length === 0) return;
    onSend(text || "Analyze the attached files. Summarize, tag themes, and list action items.", files);
    setValue("");
    setFiles([]);
    setError(null);
    if (areaRef.current) areaRef.current.style.height = "auto";
  };

  const onPick = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setParsing(true);
    setError(null);
    try {
      const extracted = await extractAttachedFiles(Array.from(list));
      setFiles((prev) => [...prev, ...extracted].slice(0, 6));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that file.");
    } finally {
      setParsing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
      {error ? <p className="mb-2 text-center text-xs text-destructive">{error}</p> : null}
      <div
        className={cn(
          "rounded-[28px] border border-border bg-card p-3 shadow-[var(--shadow-soft)]",
          "focus-within:ring-1 focus-within:ring-ring/40",
        )}
      >
        {files.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {files.map((file) => (
              <span
                key={file.name + file.size}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs"
              >
                <span className="max-w-[160px] truncate">{file.name}</span>
                <span className="text-subtle">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  className="text-subtle hover:text-foreground"
                  onClick={() => setFiles((prev) => prev.filter((f) => f !== file))}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <Textarea
          ref={areaRef}
          value={value}
          disabled={disabled}
          placeholder={`Ask ${APP_SHORT_NAME} anything`}
          rows={1}
          onChange={(e) => {
            setValue(e.target.value);
            const el = e.target;
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          className="max-h-44 min-h-[44px] px-3 py-2"
        />
        <div className="mt-1 flex items-center gap-1">
          <input
            ref={fileRef}
            type="file"
            multiple
            accept={FILE_ACCEPT}
            className="hidden"
            onChange={(e) => void onPick(e.target.files)}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-10 rounded-full"
            onClick={() => fileRef.current?.click()}
            disabled={disabled || parsing}
            aria-label="Attach files"
          >
            <Paperclip className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-10 rounded-full"
            onClick={onOpenPlugins}
            aria-label="Plugins"
          >
            <Puzzle className="size-4" />
          </Button>
          <span className="flex-1 text-xs text-subtle">
            {parsing ? "Reading files…" : files.length ? `${files.length} attached` : ""}
          </span>
          <Button
            type="button"
            size="icon"
            className="size-10 rounded-full"
            onClick={submit}
            disabled={disabled || parsing || (!value.trim() && files.length === 0)}
            aria-label="Send"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
