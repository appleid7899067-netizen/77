import { chatWithPuter, type PuterChatMessage } from "@/lib/puter-ai";
import type { AttachedFile } from "@/lib/agent/types";

export type BossesAgentPhase = "plan" | "act" | "observe" | "refine";
export type BossesAgentStep = { phase: BossesAgentPhase; detail: string };
export type BossesAgentResult = { text: string; model: string; steps: BossesAgentStep[]; toolCalls: string[] };

/**
 * Bosses/CodingFleet-style Plan → Act → Observe → Refine orchestration,
 * adapted to 77's verified Puter AI, cloud, network and tool pipeline.
 *
 * The resolved free Puter model is reused for every iteration. Tool calls are
 * bounded by chatWithPuter and iterations are capped at 3.
 */
export async function runBossesAgent(options: {
  model: string;
  messages: PuterChatMessage[];
  files?: AttachedFile[];
  maxIterations?: number;
}): Promise<BossesAgentResult> {
  const limit = Math.max(1, Math.min(options.maxIterations ?? 3, 3));
  const steps: BossesAgentStep[] = [{ phase: "plan", detail: "Task decomposed using the Bosses Plan → Act → Observe → Refine protocol." }];
  let current = options.messages;
  let last = "";
  let model = options.model;
  const toolCalls: string[] = [];

  for (let iteration = 0; iteration < limit; iteration += 1) {
    steps.push({ phase: "act", detail: `Iteration ${iteration + 1}: selected Puter model execution with tools enabled.` });
    const result = await chatWithPuter({ model, files: options.files, messages: current, enableTools: true });
    last = result.text;
    model = result.model;
    toolCalls.push(...result.toolCalls);
    steps.push({
      phase: "observe",
      detail: result.toolCalls.length
        ? `Iteration ${iteration + 1}: model response verified after tools: ${result.toolCalls.join(", ")}.`
        : `Iteration ${iteration + 1}: received a verified model response without tool calls.`,
    });

    if (iteration === limit - 1) break;
    current = [
      ...options.messages,
      { role: "assistant", content: last },
      {
        role: "user",
        content:
          "Refine the previous answer using only verified information from the attached files, tool results, and prior response. Correct mistakes, preserve useful details, and do not claim an action succeeded unless the evidence is present.",
      },
    ];
    steps.push({ phase: "refine", detail: "Feeding the verified observation back into the selected model." });
  }

  return { text: last, model, steps, toolCalls };
}
