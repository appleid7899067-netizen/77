import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { redirectToLoginIfRequired } from "@/lib/app-data";
import { CONNECTORS, SKILLS, type CatalogItem } from "@/lib/catalog";
import { probeConnectorFn } from "@/lib/agent/functions";
import { useLumenStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PluginIcon } from "@/components/plugin-icon";
import { cn } from "@/lib/utils";

export function PluginsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [tab, setTab] = useState("connectors");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col p-0">
        <DialogHeader>
          <DialogTitle>Plugins</DialogTitle>
          <DialogDescription>Connect accounts and enable document skills for SLIeQwneB.</DialogDescription>
        </DialogHeader>
        <div className="px-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="connectors">Connectors</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="pl-9"
              />
            </div>
            <div className="lumen-scroll mt-4 max-h-[46vh] overflow-y-auto pr-1">
              <TabsContent value="connectors" className="mt-0">
                <PluginList items={CONNECTORS} query={query} mode="connectors" />
              </TabsContent>
              <TabsContent value="skills" className="mt-0">
                <PluginList items={SKILLS} query={query} mode="skills" />
                <CustomSkills />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <DialogFooter>
          {tab === "skills" ? (
            <Button className="w-full rounded-full" onClick={() => setCreating(true)}>
              <Plus className="size-4" />
              New skill
            </Button>
          ) : (
            <p className="w-full text-center text-xs text-muted-foreground">
              Connectors use your Grok grants. Enable one here so SLIeQwneB can call it in chat.
            </p>
          )}
        </DialogFooter>
        <NewSkillDialog open={creating} onOpenChange={setCreating} />
      </DialogContent>
    </Dialog>
  );
}

function PluginList({
  items,
  query,
  mode,
}: {
  items: CatalogItem[];
  query: string;
  mode: "connectors" | "skills";
}) {
  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          !q ||
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q),
      ),
    [items, q],
  );
  const groups = [...new Set(filtered.map((i) => i.group))];
  if (filtered.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">No matches.</p>;
  }
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group}>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">{group}</p>
          <div className="space-y-2">
            {filtered
              .filter((i) => i.group === group)
              .map((item) =>
                mode === "connectors" ? (
                  <ConnectorRow key={item.id} item={item} />
                ) : (
                  <SkillRow key={item.id} item={item} />
                ),
              )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ConnectorRow({ item }: { item: CatalogItem }) {
  const enabled = useLumenStore((s) => s.enabledConnectorIds.includes(item.id));
  const setEnabled = useLumenStore((s) => s.setConnectorEnabled);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [loginUrl, setLoginUrl] = useState<string | null>(null);

  const onToggle = async () => {
    if (enabled) {
      setEnabled(item.id, false);
      setNote(null);
      setLoginUrl(null);
      return;
    }
    setBusy(true);
    setNote(null);
    setLoginUrl(null);
    try {
      const result = await probeConnectorFn({ data: { connectorId: item.id } });
      if (result.ok) {
        setEnabled(item.id, true);
        setNote("Ready for chat.");
      } else if (result.loginRequired && result.loginUrl) {
        setLoginUrl(result.loginUrl);
        setNote(result.message);
        setEnabled(item.id, true);
      } else if (result.kind === "not_connected") {
        setNote(result.message);
        setEnabled(item.id, true);
      } else if (result.pending) {
        setNote("Waiting for a connector grant. SLIeQwneB will retry in chat.");
        setEnabled(item.id, true);
      } else {
        setNote(result.message);
        setEnabled(item.id, true);
      }
    } catch {
      setNote("Could not verify this connector. It is still enabled for chat.");
      setEnabled(item.id, true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-border bg-secondary/30 p-3">
      <PluginIcon icon={item.icon} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="truncate text-xs text-muted-foreground">{item.description}</p>
        {note ? <p className="mt-1 text-xs text-subtle">{note}</p> : null}
        {loginUrl ? (
          <button
            type="button"
            className="mt-1 text-xs font-medium text-foreground underline underline-offset-2"
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
      <Button
        size="pill"
        variant={enabled ? "secondary" : "default"}
        disabled={busy}
        onClick={() => void onToggle()}
        className={cn(enabled && "text-success")}
      >
        {busy ? "Checking" : enabled ? "Added" : "Add"}
      </Button>
    </div>
  );
}

function SkillRow({ item }: { item: CatalogItem }) {
  const enabled = useLumenStore((s) => s.enabledSkillIds.includes(item.id));
  const toggle = useLumenStore((s) => s.toggleSkill);
  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-border bg-secondary/30 p-3">
      <PluginIcon icon={item.icon} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="truncate text-xs text-muted-foreground">{item.description}</p>
      </div>
      <Button
        size="pill"
        variant={enabled ? "secondary" : "outline"}
        onClick={() => toggle(item.id)}
        disabled={item.alwaysOn}
      >
        {item.alwaysOn || enabled ? "On" : "Off"}
      </Button>
    </div>
  );
}

function CustomSkills() {
  const skills = useLumenStore((s) => s.customSkills);
  const remove = useLumenStore((s) => s.removeCustomSkill);
  if (skills.length === 0) return null;
  return (
    <div className="mt-5">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">Personal</p>
      <div className="space-y-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-3 rounded-[20px] border border-border bg-secondary/30 p-3"
          >
            <PluginIcon icon="custom" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{skill.name}</p>
              <p className="truncate text-xs text-muted-foreground">{skill.description}</p>
            </div>
            <Button size="pill" variant="ghost" onClick={() => remove(skill.id)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewSkillDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const add = useLumenStore((s) => s.addCustomSkill);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");

  const save = () => {
    if (!name.trim() || !instructions.trim()) return;
    add({
      name: name.trim(),
      description: description.trim() || "Custom skill",
      instructions: instructions.trim(),
    });
    setName("");
    setDescription("");
    setInstructions("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle>New skill</DialogTitle>
          <DialogDescription>
            Skills are instruction recipes SLIeQwneB follows in chat. They never run arbitrary code.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 px-6 pb-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
          />
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instructions for SLIeQwneB"
            className="min-h-32 w-full rounded-[var(--radius-md)] border border-input bg-secondary/40 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          />
        </div>
        <DialogFooter>
          <Button className="w-full rounded-full" onClick={save} disabled={!name.trim() || !instructions.trim()}>
            Save skill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
