import { useEffect, useRef, useState } from "react";
import { redirectToLoginIfRequired } from "@/lib/app-data";
import { sendChat } from "@/lib/agent/functions";
import type { AttachedFile } from "@/lib/agent/types";
import { chatWithPuter, puterAiErrorMessage } from "@/lib/puter-ai";
import { useLumenStore } from "@/lib/store";
import { uid } from "@/lib/utils";
import { ChatThread } from "@/components/chat-thread";
import { Composer } from "@/components/composer";
import { PluginsDialog } from "@/components/plugins-dialog";
import { MobileTopBar, SidebarBody } from "@/components/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModelPicker } from "@/components/model-picker";

export function Workspace() {
  const hydrated = useLumenStore((s) => s.hydrated);
  const conversations = useLumenStore((s) => s.conversations);
  const activeId = useLumenStore((s) => s.activeId);
  const newConversation = useLumenStore((s) => s.newConversation);
  const appendMessage = useLumenStore((s) => s.appendMessage);
  const enabledConnectorIds = useLumenStore((s) => s.enabledConnectorIds);
  const enabledSkillIds = useLumenStore((s) => s.enabledSkillIds);
  const customSkills = useLumenStore((s) => s.customSkills);
  const aiProvider = useLumenStore((s) => s.aiProvider);
  const puterModel = useLumenStore((s) => s.puterModel);
  const setAiProvider = useLumenStore((s) => s.setAiProvider);
  const setPuterModel = useLumenStore((s) => s.setPuterModel);

  const [pluginsOpen, setPluginsOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [loginUrl, setLoginUrl] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const convo = conversations.find((c) => c.id === activeId) ?? conversations[0];

  useEffect(() => {
    if (hydrated && conversations.length === 0) newConversation();
  }, [hydrated, conversations.length, newConversation]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [convo?.messages.length, pending]);

  const send = async (text: string, files: AttachedFile[]) => {
    let id = convo?.id;
    if (!id) id = newConversation();
    const userMsgId = uid("msg");
    appendMessage(id, {
      id: userMsgId,
      role: "user",
      content: text,
      createdAt: Date.now(),
      files: files.length ? files : undefined,
    });
    setPending(true);
    setBanner(null);
    setLoginUrl(null);
    try {
      const history = (useLumenStore.getState().conversations.find((c) => c.id === id)?.messages ?? [])
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-48)
        .map((m) => ({ role: m.role, content: m.content }));

      if (aiProvider === "puter") {
        const result = await chatWithPuter({
          model: puterModel,
          files,
          messages: [
            {
              role: "system",
              content:
                "You are the workspace AI. Use the selected Puter model. Analyze attached files directly through their Puter file references when provided. Use the files as authoritative source material. Never invent access to files that were not attached. For code, reason carefully and provide complete, production-ready solutions.",
            },
            ...history.slice(0, -1),
            { role: "user", content: text || "Analyze the attached files and help me." },
          ],
        });
        appendMessage(id, {
          id: uid("msg"),
          role: "assistant",
          content: result.text,
          createdAt: Date.now(),
          traces: [{ name: `Puter · ${result.model}`, summary: "selected free model · max compatible context/output", ok: true }],
        });
        return;
      }

      const result = await sendChat({
        data: {
          messages: history,
          files,
          enabledConnectors: enabledConnectorIds,
          enabledSkills: enabledSkillIds,
          customSkills,
        },
      });
      if (!result.ok) {
        if (result.loginRequired && result.loginUrl) setLoginUrl(result.loginUrl);
        appendMessage(id, {
          id: uid("msg"),
          role: "assistant",
          content: result.error,
          createdAt: Date.now(),
        });
        setBanner(result.error);
        return;
      }
      appendMessage(id, {
        id: uid("msg"),
        role: "assistant",
        content: result.content,
        createdAt: Date.now(),
        artifacts: result.artifacts.length ? result.artifacts : undefined,
        traces: result.traces.length ? result.traces : undefined,
      });
    } catch (err) {
      const message = aiProvider === "puter" ? puterAiErrorMessage(err) : err instanceof Error ? err.message : "Something went wrong.";
      appendMessage(id, {
        id: uid("msg"),
        role: "assistant",
        content: message,
        createdAt: Date.now(),
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-[100dvh] bg-background">
        <aside className="hidden w-[280px] shrink-0 border-r border-border lg:block">
          <SidebarBody onOpenPlugins={() => setPluginsOpen(true)} />
        </aside>
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetContent side="left" className="p-0">
            <SidebarBody
              onOpenPlugins={() => {
                setNavOpen(false);
                setPluginsOpen(true);
              }}
              onNavigate={() => setNavOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <main className="flex min-w-0 flex-1 flex-col">
          <MobileTopBar onOpenNav={() => setNavOpen(true)} onOpenPlugins={() => setPluginsOpen(true)} />
          <div ref={scroller} className="lumen-scroll flex-1 overflow-y-auto">
            <ChatThread
              messages={convo?.messages ?? []}
              pending={pending}
              onSuggestion={(prompt) => void send(prompt, [])}
            />
          </div>
          {banner || loginUrl ? (
            <div className="mx-auto w-full max-w-3xl px-4 pb-2 text-center text-xs text-muted-foreground">
              {banner}
              {loginUrl ? (
                <button
                  type="button"
                  className="ml-2 font-medium text-foreground underline underline-offset-2"
                  onClick={() =>
                    redirectToLoginIfRequired({
                      ok: false,
                      data: null,
                      loginRequired: true,
                      loginUrl,
                    })
                  }
                >
                  Continue with Grok
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="mx-auto w-full max-w-3xl px-4 pb-2">
            <ModelPicker
              provider={aiProvider}
              model={puterModel}
              onProviderChange={setAiProvider}
              onModelChange={setPuterModel}
            />
          </div>
          <Composer disabled={pending} onSend={(text, files) => void send(text, files)} onOpenPlugins={() => setPluginsOpen(true)} />
        </main>
        <PluginsDialog open={pluginsOpen} onOpenChange={setPluginsOpen} />
      </div>
    </TooltipProvider>
  );
}
