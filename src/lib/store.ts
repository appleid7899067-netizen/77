import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/utils";
import { SKILLS } from "@/lib/catalog";
import type { Artifact, AttachedFile, ToolTrace } from "@/lib/agent/types";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  files?: AttachedFile[];
  artifacts?: Artifact[];
  traces?: ToolTrace[];
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

export type CustomSkill = {
  id: string;
  name: string;
  description: string;
  instructions: string;
};

export type WorkspaceSlice = {
  conversations: Conversation[];
  activeId: string | null;
  enabledConnectorIds: string[];
  enabledSkillIds: string[];
  customSkills: CustomSkill[];
  aiProvider: "puter" | "xai";
  puterModel: string;
};

type LumenState = WorkspaceSlice & {
  hydrated: boolean;
  markHydrated: () => void;
  newConversation: () => string;
  setActive: (id: string) => void;
  deleteConversation: (id: string) => void;
  appendMessage: (conversationId: string, message: ChatMessage) => void;
  patchMessage: (conversationId: string, messageId: string, patch: Partial<ChatMessage>) => void;
  renameConversation: (conversationId: string, title: string) => void;
  toggleConnector: (id: string) => void;
  setConnectorEnabled: (id: string, enabled: boolean) => void;
  toggleSkill: (id: string) => void;
  addCustomSkill: (skill: Omit<CustomSkill, "id">) => CustomSkill;
  removeCustomSkill: (id: string) => void;
  setAiProvider: (provider: "puter" | "xai") => void;
  setPuterModel: (model: string) => void;
  replaceWorkspace: (slice: WorkspaceSlice) => void;
};

function blankConversation(): Conversation {
  const now = Date.now();
  return {
    id: uid("chat"),
    title: "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

const defaultSkillIds = SKILLS.map((s) => s.id);

export const useLumenStore = create<LumenState>()(
  persist(
    (set) => ({
      hydrated: false,
      conversations: [],
      activeId: null,
      enabledConnectorIds: [],
      enabledSkillIds: defaultSkillIds,
      customSkills: [],
      aiProvider: "puter",
      puterModel: "",
      markHydrated: () => set({ hydrated: true }),
      newConversation: () => {
        const convo = blankConversation();
        set((state) => ({
          conversations: [convo, ...state.conversations],
          activeId: convo.id,
        }));
        return convo.id;
      },
      setActive: (id) => set({ activeId: id }),
      deleteConversation: (id) =>
        set((state) => {
          const conversations = state.conversations.filter((c) => c.id !== id);
          const activeId = state.activeId === id ? (conversations[0]?.id ?? null) : state.activeId;
          return { conversations, activeId };
        }),
      appendMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  updatedAt: Date.now(),
                  title: c.messages.length === 0 && message.role === "user" ? message.content.slice(0, 48) || c.title : c.title,
                  messages: [...c.messages, message],
                }
              : c,
          ),
        })),
      patchMessage: (conversationId, messageId, patch) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, updatedAt: Date.now(), messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)) }
              : c,
          ),
        })),
      renameConversation: (conversationId, title) =>
        set((state) => ({
          conversations: state.conversations.map((c) => (c.id === conversationId ? { ...c, title, updatedAt: Date.now() } : c)),
        })),
      toggleConnector: (id) =>
        set((state) => ({
          enabledConnectorIds: state.enabledConnectorIds.includes(id)
            ? state.enabledConnectorIds.filter((x) => x !== id)
            : [...state.enabledConnectorIds, id],
        })),
      setConnectorEnabled: (id, enabled) =>
        set((state) => ({
          enabledConnectorIds: enabled
            ? Array.from(new Set([...state.enabledConnectorIds, id]))
            : state.enabledConnectorIds.filter((x) => x !== id),
        })),
      toggleSkill: (id) => {
        const skill = SKILLS.find((s) => s.id === id);
        if (skill?.alwaysOn) return;
        set((state) => ({
          enabledSkillIds: state.enabledSkillIds.includes(id)
            ? state.enabledSkillIds.filter((x) => x !== id)
            : [...state.enabledSkillIds, id],
        }));
      },
      addCustomSkill: (skill) => {
        const created: CustomSkill = { ...skill, id: uid("skill") };
        set((state) => ({ customSkills: [created, ...state.customSkills] }));
        return created;
      },
      removeCustomSkill: (id) => set((state) => ({ customSkills: state.customSkills.filter((s) => s.id !== id) })),
      setAiProvider: (aiProvider) => set({ aiProvider }),
      setPuterModel: (puterModel) => set({ puterModel }),
      replaceWorkspace: (slice) =>
        set({
          conversations: slice.conversations,
          activeId: slice.activeId,
          enabledConnectorIds: slice.enabledConnectorIds,
          enabledSkillIds: slice.enabledSkillIds,
          customSkills: slice.customSkills,
          aiProvider: slice.aiProvider ?? "puter",
          puterModel: slice.puterModel ?? "",
        }),
    }),
    {
      name: "slieqwneb-workspace",
      partialize: (state) => ({
        conversations: state.conversations.slice(0, 40),
        activeId: state.activeId,
        enabledConnectorIds: state.enabledConnectorIds,
        enabledSkillIds: state.enabledSkillIds,
        customSkills: state.customSkills,
        aiProvider: state.aiProvider,
        puterModel: state.puterModel,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);
