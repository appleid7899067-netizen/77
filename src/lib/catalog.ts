import type { ConnectorTypeName } from "@/lib/app-data";
import { ConnectorType } from "@/lib/app-data";

export type PluginKind = "connector" | "skill";

export type CatalogItem = {
  id: string;
  name: string;
  description: string;
  kind: PluginKind;
  group: string;
  icon: "drive" | "mail" | "calendar" | "outlook" | "teams" | "word" | "pdf" | "sheet" | "slides" | "github" | "custom";
  connectorType?: ConnectorTypeName;
  probeTool?: string;
  probeArgs?: Record<string, unknown>;
  actions?: string[];
  alwaysOn?: boolean;
};

export const CONNECTORS: CatalogItem[] = [
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Search files, docs, and folders",
    kind: "connector",
    group: "Google",
    icon: "drive",
    connectorType: ConnectorType.GoogleDrive,
    probeTool: "google_drive_search",
    probeArgs: { query: "type:folder", page_size: 1 },
    actions: ["search", "read", "list"],
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Search threads and read mail",
    kind: "connector",
    group: "Google",
    icon: "mail",
    connectorType: ConnectorType.Gmail,
    probeTool: "gmail_search",
    probeArgs: { query: "in:inbox", max_results: 1 },
    actions: ["search", "read"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Check events and availability",
    kind: "connector",
    group: "Google",
    icon: "calendar",
    connectorType: ConnectorType.GoogleCalendar,
    probeTool: "google_calendar_list_calendars",
    probeArgs: {},
    actions: ["events", "availability"],
  },
  {
    id: "outlook",
    name: "Outlook",
    description: "Search and read Outlook mail",
    kind: "connector",
    group: "Microsoft",
    icon: "outlook",
    connectorType: ConnectorType.Outlook,
    probeTool: "outlook_search",
    probeArgs: { query: "", max_results: 1 },
    actions: ["search", "read"],
  },
  {
    id: "outlook-calendar",
    name: "Outlook Calendar",
    description: "Read Outlook calendar events",
    kind: "connector",
    group: "Microsoft",
    icon: "calendar",
    connectorType: ConnectorType.OutlookCalendar,
    probeTool: "outlook_calendar_search",
    probeArgs: {},
    actions: ["events"],
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Search chats and channels",
    kind: "connector",
    group: "Microsoft",
    icon: "teams",
    connectorType: ConnectorType.MicrosoftTeams,
    probeTool: "microsoft_teams_search",
    probeArgs: { query: "" },
    actions: ["search"],
  },
];

export const SKILLS: CatalogItem[] = [
  {
    id: "word",
    name: "Word documents",
    description: "Read .docx and draft downloadable documents",
    kind: "skill",
    group: "Documents",
    icon: "word",
    actions: ["read", "create"],
    alwaysOn: true,
  },
  {
    id: "pdf",
    name: "PDFs",
    description: "Extract text and generate printable PDFs",
    kind: "skill",
    group: "Documents",
    icon: "pdf",
    actions: ["read", "create"],
    alwaysOn: true,
  },
  {
    id: "spreadsheet",
    name: "Spreadsheets",
    description: "Parse CSV/XLSX and export tables",
    kind: "skill",
    group: "Documents",
    icon: "sheet",
    actions: ["read", "create"],
    alwaysOn: true,
  },
  {
    id: "presentation",
    name: "Presentations",
    description: "Turn notes into a slide deck",
    kind: "skill",
    group: "Documents",
    icon: "slides",
    actions: ["create"],
    alwaysOn: true,
  },
  {
    id: "github",
    name: "GitHub public search",
    description: "Search public repositories without a login",
    kind: "skill",
    group: "Development",
    icon: "github",
    actions: ["search"],
    alwaysOn: true,
  },
];

export const SUGGESTIONS = [
  {
    id: "analyze",
    title: "Analyze files",
    prompt: "Analyze the attached files. Summarize each one, tag the themes, and list action items.",
  },
  {
    id: "calendar",
    title: "Upcoming schedule",
    prompt: "What meetings or events do I have coming up? Use my calendar if it is connected.",
  },
  {
    id: "drive",
    title: "Find a file",
    prompt: "Search my Google Drive for recent briefs, decks, or reports and summarize the most relevant ones.",
  },
  {
    id: "report",
    title: "Draft a report",
    prompt: "Write a one-page status report and save it as a Word document I can download.",
  },
] as const;

export function catalogById(id: string): CatalogItem | undefined {
  return CONNECTORS.find((c) => c.id === id) ?? SKILLS.find((s) => s.id === id);
}
