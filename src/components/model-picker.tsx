import { useEffect, useState } from "react";
import { listFreePuterModels, modelLabel, type PuterModel } from "@/lib/puter-ai";
import { cn } from "@/lib/utils";

export function ModelPicker({
  provider,
  model,
  onProviderChange,
  onModelChange,
}: {
  provider: "puter" | "xai";
  model: string;
  onProviderChange: (provider: "puter" | "xai") => void;
  onModelChange: (model: string) => void;
}) {
  const [models, setModels] = useState<PuterModel[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    void listFreePuterModels()
      .then((next) => {
        if (cancelled) return;
        setModels(next);
        setStatus("ready");
        if (next.length > 0 && !next.some((item) => item.id === model)) onModelChange(next[0].id);
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [model, onModelChange]);

  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <select
        aria-label="AI provider"
        value={provider}
        onChange={(event) => onProviderChange(event.target.value as "puter" | "xai")}
        className="h-8 max-w-[110px] rounded-full border border-border bg-secondary px-2 text-[11px] outline-none"
      >
        <option value="puter">Puter · ฟรี</option>
        <option value="xai">xAI · server</option>
      </select>
      {provider === "puter" ? (
        <select
          aria-label="เลือกโมเดล Puter ฟรี"
          value={model}
          onChange={(event) => onModelChange(event.target.value)}
          disabled={status === "loading"}
          className={cn(
            "h-8 min-w-0 flex-1 rounded-full border border-border bg-secondary px-3 text-[11px] outline-none",
            "hover:bg-accent/50 focus:ring-1 focus:ring-ring/40",
            status === "error" && "text-destructive",
          )}
        >
          {status === "loading" ? <option>กำลังโหลดโมเดล Puter…</option> : null}
          {status === "error" ? <option value="gemma-4-26b-a4b-it">โหลดรายการไม่สำเร็จ · Gemma 4 26B</option> : null}
          {models.map((item) => (
            <option key={`${item.provider}:${item.id}`} value={item.id}>
              {modelLabel(item)}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}
