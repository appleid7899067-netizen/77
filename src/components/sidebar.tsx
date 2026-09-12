import { Menu, Plus, Puzzle, Trash2 } from "lucide-react";
import { AppMark } from "@/components/logo";
import { PuterAccount } from "@/components/puter-account";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { APP_EDITION, APP_SHORT_NAME } from "@/lib/brand";
import { useLumenStore } from "@/lib/store";
import { cn, relativeTime } from "@/lib/utils";

export function SidebarBody({
  onOpenPlugins,
  onNavigate,
}: {
  onOpenPlugins: () => void;
  onNavigate?: () => void;
}) {
  const conversations = useLumenStore((s) => s.conversations);
  const activeId = useLumenStore((s) => s.activeId);
  const setActive = useLumenStore((s) => s.setActive);
  const create = useLumenStore((s) => s.newConversation);
  const remove = useLumenStore((s) => s.deleteConversation);
  const connectors = useLumenStore((s) => s.enabledConnectorIds.length);
  const skills = useLumenStore((s) => s.enabledSkillIds.length + s.customSkills.length);

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center gap-2 px-4 pb-3 pt-[max(16px,env(safe-area-inset-top))]">
        <AppMark className="size-7" />
        <div className="min-w-0">
          <p className="truncate font-display text-lg leading-none">{APP_SHORT_NAME}</p>
          <p className="text-[11px] text-subtle">{APP_EDITION}</p>
        </div>
      </div>
      <div className="px-3">
        <Button
          className="w-full justify-start rounded-full"
          variant="secondary"
          onClick={() => {
            create();
            onNavigate?.();
          }}
        >
          <Plus className="size-4" />
          New chat
        </Button>
      </div>
      <ScrollArea className="mt-3 flex-1 px-2">
        <div className="space-y-0.5 pb-4">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              className={cn(
                "group flex items-center gap-1 rounded-[14px] pr-1",
                convo.id === activeId ? "bg-secondary" : "hover:bg-secondary/60",
              )}
            >
              <button
                type="button"
                className="min-w-0 flex-1 px-3 py-2.5 text-left"
                onClick={() => {
                  setActive(convo.id);
                  onNavigate?.();
                }}
              >
                <p className="truncate text-sm">{convo.title || "New chat"}</p>
                <p className="truncate text-[11px] text-subtle">{relativeTime(convo.updatedAt)}</p>
              </button>
              <button
                type="button"
                className="rounded-[var(--radius-sm)] p-2 text-subtle opacity-0 hover:bg-background hover:text-foreground group-hover:opacity-100"
                aria-label="Delete chat"
                onClick={() => remove(convo.id)}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="space-y-2 border-t border-border p-3">
        <button
          type="button"
          onClick={onOpenPlugins}
          className="flex w-full items-center gap-3 rounded-[16px] px-2 py-2 text-left hover:bg-secondary"
        >
          <span className="flex size-9 items-center justify-center rounded-[12px] border border-border bg-secondary">
            <Puzzle className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium">Plugins</span>
            <span className="block text-[11px] text-subtle tabular-nums">
              {connectors} connectors · {skills} skills
            </span>
          </span>
        </button>
        <PuterAccount />
      </div>
    </div>
  );
}

export function MobileTopBar({
  onOpenNav,
  onOpenPlugins,
}: {
  onOpenNav: () => void;
  onOpenPlugins: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-3 py-2 lg:hidden">
      <Button size="icon" variant="ghost" className="size-11" onClick={onOpenNav} aria-label="Open chats">
        <Menu className="size-5" />
      </Button>
      <div className="flex min-w-0 items-center gap-2">
        <AppMark className="size-5 shrink-0" />
        <span className="truncate font-display text-base">{APP_SHORT_NAME}</span>
      </div>
      <Button size="icon" variant="ghost" className="size-11" onClick={onOpenPlugins} aria-label="Plugins">
        <Puzzle className="size-5" />
      </Button>
    </div>
  );
}
