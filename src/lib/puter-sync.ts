import { getPuterKv, type PuterSDK } from "@/lib/puter";
import { useLumenStore, type Conversation, type CustomSkill } from "@/lib/store";

const KV_KEY = "slieqwneb:workspace:v1";

export type CloudSnapshot = {
  v: 1;
  conversations: Conversation[];
  activeId: string | null;
  enabledConnectorIds: string[];
  enabledSkillIds: string[];
  customSkills: CustomSkill[];
  aiProvider?: "puter" | "xai";
  puterModel?: string;
};

function clipText(text: string, max = 4_000) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n\n[truncated]`;
}

export function snapshotWorkspace(): CloudSnapshot {
  const state = useLumenStore.getState();
  return {
    v: 1,
    conversations: state.conversations.slice(0, 30).map((convo) => ({
      ...convo,
      messages: convo.messages.slice(-40).map((message) => ({
        id: message.id,
        role: message.role,
        content: clipText(message.content, 8_000),
        createdAt: message.createdAt,
        files: message.files?.map((file) => ({
          name: file.name,
          mimeType: file.mimeType,
          size: file.size,
          text: clipText(file.text),
        })),
        traces: message.traces,
      })),
    })),
    activeId: state.activeId,
    enabledConnectorIds: state.enabledConnectorIds,
    enabledSkillIds: state.enabledSkillIds,
    customSkills: state.customSkills,
    aiProvider: state.aiProvider,
    puterModel: state.puterModel,
  };
}

function isSnapshot(value: unknown): value is CloudSnapshot {
  if (!value || typeof value !== "object") return false;
  const record = value as CloudSnapshot;
  return record.v === 1 && Array.isArray(record.conversations);
}

export async function pullWorkspace(puter: PuterSDK): Promise<CloudSnapshot | null> {
  const kv = await getPuterKv(puter);
  const raw = await kv.get(KV_KEY);
  if (typeof raw === "string") {
    try {
      const parsed: unknown = JSON.parse(raw);
      return isSnapshot(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return isSnapshot(raw) ? raw : null;
}

export async function pushWorkspace(puter: PuterSDK, snap = snapshotWorkspace()): Promise<void> {
  const kv = await getPuterKv(puter);
  await kv.set(KV_KEY, snap);
}

export function applyWorkspace(snap: CloudSnapshot) {
  useLumenStore.getState().replaceWorkspace({
    conversations: snap.conversations,
    activeId: snap.activeId,
    enabledConnectorIds: snap.enabledConnectorIds,
    enabledSkillIds: snap.enabledSkillIds,
    customSkills: snap.customSkills,
    aiProvider: snap.aiProvider ?? "puter",
    puterModel: snap.puterModel ?? "gemma-4-26b-a4b-it",
  });
}
