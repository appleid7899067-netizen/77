import {
  CalendarDays,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Github,
  Mail,
  MessagesSquare,
  Presentation,
  Puzzle,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import type { CatalogItem } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const MAP: Record<CatalogItem["icon"], LucideIcon> = {
  drive: FolderOpen,
  mail: Mail,
  calendar: CalendarDays,
  outlook: Inbox,
  teams: MessagesSquare,
  word: FileText,
  pdf: FileText,
  sheet: FileSpreadsheet,
  slides: Presentation,
  github: Github,
  custom: Puzzle,
};

export function PluginIcon({
  icon,
  className,
}: {
  icon: CatalogItem["icon"];
  className?: string;
}) {
  const Icon = MAP[icon] ?? Puzzle;
  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-border bg-secondary text-foreground",
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={1.6} />
    </div>
  );
}
