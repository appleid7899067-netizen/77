import { loadPuter, puterErrorMessage, type PuterSDK } from "@/lib/puter";
import type { AttachedFile } from "@/lib/agent/types";

export type PuterModel = {
  id: string;
  provider: string;
  name?: string;
  context?: number;
  max_tokens?: number;
  cost?: { input?: number; output?: number; tokens?: number; currency?: string };
  costs?: { prompt_tokens?: number; completion_tokens?: number; input?: number; output?: number };
};

export type PuterChatContent =
  | string
  | Array<
      | { type: "text"; text: string }
      | { type: "file"; puter_path: string }
    >;

export type PuterChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: PuterChatContent;
};

const MAX_HISTORY_MESSAGES = 48;
const DEFAULT_MAX_OUTPUT_TOKENS = 16_384;

function getCost(model: PuterModel): { input: number; output: number } | null {
  const cost = model.cost;
  if (cost) return { input: Number(cost.input ?? NaN), output: Number(cost.output ?? NaN) };
  const costs = model.costs;
  if (costs) {
    return {
      input: Number(costs.input ?? costs.prompt_tokens ?? NaN),
      output: Number(costs.output ?? costs.completion_tokens ?? NaN),
    };
  }
  return null;
}

export function isFreePuterModel(model: PuterModel): boolean {
  const cost = getCost(model);
  return cost !== null && cost.input === 0 && cost.output === 0;
}

export function modelLabel(model: PuterModel): string {
  const limits = [model.context ? `ctx ${model.context.toLocaleString()}` : "", model.max_tokens ? `out ${model.max_tokens.toLocaleString()}` : ""]
    .filter(Boolean)
    .join(" · ");
  const base = model.name && model.name !== model.id ? `${model.name} · ${model.provider}` : `${model.id} · ${model.provider}`;
  return limits ? `${base} · ${limits}` : base;
}

export async function listFreePuterModels(): Promise<PuterModel[]> {
  const puter = await loadPuter();
  const response = await puter.ai.listModels();
  const models = (Array.isArray(response) ? response : (response as { models?: unknown[] }).models ?? []) as PuterModel[];
  return models
    .filter(isFreePuterModel)
    .sort((a, b) => {
      const contextDelta = (b.context ?? 0) - (a.context ?? 0);
      return contextDelta || modelLabel(a).localeCompare(modelLabel(b));
    })
    .slice(0, 80);
}

async function selectedModelInfo(modelId: string): Promise<PuterModel | undefined> {
  try {
    const models = await listFreePuterModels();
    return models.find((item) => item.id === modelId);
  } catch {
    return undefined;
  }
}

function contentText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((part) => (typeof part === "string" ? part : typeof part?.text === "string" ? part.text : ""))
      .join("");
  }
  if (value && typeof value === "object" && typeof (value as { text?: unknown }).text === "string") {
    return (value as { text: string }).text;
  }
  return "";
}

export async function chatWithPuter(options: {
  messages: PuterChatMessage[];
  model?: string;
  files?: AttachedFile[];
  onDelta?: (text: string) => void;
}): Promise<{ text: string; model: string }> {
  const puter = await loadPuter();
  const requestedModel = options.model || PUTER_FREE_MODEL_FALLBACK;
  const modelInfo = await selectedModelInfo(requestedModel);
  const model = modelInfo?.id || requestedModel;
  const messages = options.messages.slice(-MAX_HISTORY_MESSAGES).map((message) => ({ ...message }));
  const files = (options.files ?? []).filter((file) => file.puterPath);

  if (files.length) {
    const lastUserIndex = [...messages].map((m) => m.role).lastIndexOf("user");
    if (lastUserIndex >= 0) {
      const last = messages[lastUserIndex];
      const text = typeof last.content === "string" ? last.content : "Analyze the attached files and answer the user's request.";
      messages[lastUserIndex] = {
        ...last,
        content: [
          ...files.map((file) => ({ type: "file" as const, puter_path: file.puterPath! })),
          { type: "text" as const, text },
        ],
      };
    }
  }

  const maxTokens = Math.min(modelInfo?.max_tokens ?? DEFAULT_MAX_OUTPUT_TOKENS, DEFAULT_MAX_OUTPUT_TOKENS);
  const aiOptions: Record<string, unknown> = {
    model,
    stream: Boolean(options.onDelta),
    normalize: true,
    temperature: 0.2,
    max_tokens: maxTokens,
  };

  let response: unknown;
  try {
    response = await puter.ai.chat(messages, aiOptions);
  } catch (firstError) {
    // Some Puter model adapters reject optional generation-limit parameters.
    // Retry the same selected model without max_tokens rather than switching models.
    try {
      const { max_tokens: _ignored, ...compatibleOptions } = aiOptions;
      response = await puter.ai.chat(messages, compatibleOptions);
    } catch {
      throw firstError;
    }
  }

  let text = "";
  if (response && typeof (response as AsyncIterable<unknown>)[Symbol.asyncIterator] === "function") {
    for await (const chunk of response as AsyncIterable<unknown>) {
      const delta = contentText((chunk as { text?: unknown; delta?: unknown; message?: { content?: unknown } }).text)
        || contentText((chunk as { delta?: unknown }).delta)
        || contentText((chunk as { message?: { content?: unknown } }).message?.content);
      if (delta) {
        text += delta;
        options.onDelta?.(delta);
      }
    }
  } else {
    const body = response as { message?: { content?: unknown }; text?: unknown };
    text = contentText(body.message?.content) || contentText(body.text) || contentText(response);
    if (text) options.onDelta?.(text);
  }

  if (!text.trim()) throw new Error("Puter returned an empty response.");
  return { text: text.trim(), model };
}

export function puterAiErrorMessage(error: unknown): string {
  return puterErrorMessage(error) || "Puter AI could not answer. Try another free model.";
}

export type PuterAIReady = PuterSDK["ai"];

export function isPuterAIReady(puter: PuterSDK | null): boolean {
  return Boolean(puter?.ai?.chat);
}

export const PUTER_FREE_MODEL_FALLBACK = "gemma-4-26b-a4b-it";
