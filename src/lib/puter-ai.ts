import { loadPuter, puterErrorMessage, type PuterSDK } from "@/lib/puter";
import { executePuterTool, PUTER_AGENT_TOOLS, type PuterToolDefinition } from "@/lib/puter-tools";
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

export type PuterToolCall = {
  id: string;
  type?: "function";
  function: { name: string; arguments: string };
};

export type PuterChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: PuterChatContent;
  tool_call_id?: string;
  tool_calls?: PuterToolCall[];
};

const MAX_HISTORY_MESSAGES = 48;
const DEFAULT_MAX_OUTPUT_TOKENS = 16_384;
const MAX_TOOL_ROUNDS = 5;

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
  const limits = [
    model.context ? `ctx ${model.context.toLocaleString()}` : "",
    model.max_tokens ? `out ${model.max_tokens.toLocaleString()}` : "",
  ]
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

async function resolveFreeModel(requestedModel: string | undefined): Promise<PuterModel> {
  const models = await listFreePuterModels();
  if (!models.length) throw new Error("Puter returned no free AI models available to this app.");
  const selected = requestedModel ? models.find((item) => item.id === requestedModel) : undefined;
  return selected ?? models[0];
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

function toolCallsFromResponse(response: unknown): PuterToolCall[] {
  const message = (response as { message?: { tool_calls?: unknown } })?.message;
  return Array.isArray(message?.tool_calls) ? (message.tool_calls as PuterToolCall[]) : [];
}

async function callPuter(puter: PuterSDK, messages: PuterChatMessage[], options: Record<string, unknown>): Promise<unknown> {
  try {
    return await puter.ai.chat(messages, options);
  } catch (firstError) {
    try {
      const { max_tokens: _ignored, ...compatibleOptions } = options;
      return await puter.ai.chat(messages, compatibleOptions);
    } catch (secondError) {
      if (options.tools) {
        const { tools: _ignoredTools, ...noToolsOptions } = options;
        try {
          return await puter.ai.chat(messages, noToolsOptions);
        } catch {
          throw secondError;
        }
      }
      throw firstError;
    }
  }
}

export async function chatWithPuter(options: {
  messages: PuterChatMessage[];
  model?: string;
  files?: AttachedFile[];
  onDelta?: (text: string) => void;
  enableTools?: boolean;
  tools?: PuterToolDefinition[];
}): Promise<{ text: string; model: string; toolCalls: string[] }> {
  const puter = await loadPuter();
  const modelInfo = await resolveFreeModel(options.model);
  const model = modelInfo.id;
  const messages = options.messages.slice(-MAX_HISTORY_MESSAGES).map((message) => ({ ...message }));
  const files = (options.files ?? []).filter((file) => file.puterPath);
  const toolNames: string[] = [];

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

  const maxTokens = Math.min(modelInfo.max_tokens ?? DEFAULT_MAX_OUTPUT_TOKENS, DEFAULT_MAX_OUTPUT_TOKENS);
  const tools = options.enableTools && !options.onDelta ? options.tools ?? PUTER_AGENT_TOOLS : undefined;
  const aiOptions: Record<string, unknown> = {
    model,
    stream: Boolean(options.onDelta),
    normalize: true,
    temperature: 0.2,
    max_tokens: maxTokens,
    ...(tools?.length ? { tools } : {}),
  };

  let text = "";
  let currentMessages = messages;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const response = await callPuter(puter, currentMessages, aiOptions);

    if (response && typeof (response as AsyncIterable<unknown>)[Symbol.asyncIterator] === "function") {
      for await (const chunk of response as AsyncIterable<unknown>) {
        const part = chunk as { type?: string; text?: unknown; delta?: unknown; message?: { content?: unknown } };
        if (part.type === "error") throw new Error(contentText(part.message));
        const delta = contentText(part.text) || contentText(part.delta) || contentText(part.message?.content);
        if (delta) {
          text += delta;
          options.onDelta?.(delta);
        }
      }
      break;
    }

    const toolCalls = toolCallsFromResponse(response);
    const body = response as { message?: { content?: unknown } };
    const responseText = contentText(body.message?.content) || contentText(response);
    if (responseText) text += responseText;

    if (!toolCalls.length || !tools?.length) break;

    const assistantContent = contentText(body.message?.content);
    currentMessages = [
      ...currentMessages,
      { role: "assistant", content: assistantContent, tool_calls: toolCalls },
    ];

    for (const call of toolCalls) {
      const name = call.function?.name;
      toolNames.push(name);
      let result: string;
      try {
        const args = JSON.parse(call.function?.arguments || "{}") as Record<string, unknown>;
        result = await executePuterTool(puter, name, args);
      } catch (error) {
        result = JSON.stringify({ ok: false, error: puterErrorMessage(error) });
      }
      currentMessages.push({ role: "tool", tool_call_id: call.id, content: result });
    }
  }

  if (!text.trim()) throw new Error("Puter returned an empty response.");
  return { text: text.trim(), model, toolCalls: toolNames };
}

export function puterAiErrorMessage(error: unknown): string {
  return puterErrorMessage(error) || "Puter AI could not answer. Try another free model.";
}

export type PuterAIReady = PuterSDK["ai"];

export function isPuterAIReady(puter: PuterSDK | null): boolean {
  return Boolean(puter?.ai?.chat);
}

export const PUTER_FREE_MODEL_FALLBACK = "";
