import { catalogById, CONNECTORS } from "@/lib/catalog";
import { classifyCallToolError } from "@/lib/app-data";
import type { Artifact, ChatRequest, ChatResponse, ToolTrace } from "./types.ts";
import { createArtifact } from "./artifacts.server.ts";

type GrokMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
};

type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

const MODEL = "grok-4.5";
const MAX_TOKENS = 1600;
const MAX_ROUNDS = 4;

function jsonArgs(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    /* ignore */
  }
  return {};
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.trim() ? v : fallback;
}

function connectorFor(id: string) {
  return CONNECTORS.find((c) => c.id === id);
}

async function githubSearch(query: string): Promise<unknown> {
  const url = new URL("https://api.github.com/search/repositories");
  url.searchParams.set("q", query.slice(0, 200));
  url.searchParams.set("per_page", "5");
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "SLIeQwneB-Agent",
    },
  });
  if (!res.ok) return { error: `GitHub search failed (${res.status})` };
  const body = (await res.json()) as {
    items?: { full_name: string; description: string | null; html_url: string; stargazers_count: number }[];
  };
  return (body.items ?? []).map((r) => ({
    repo: r.full_name,
    description: r.description,
    url: r.html_url,
    stars: r.stargazers_count,
  }));
}

function buildTools(req: ChatRequest) {
  const tools: {
    type: "function";
    function: { name: string; description: string; parameters: Record<string, unknown> };
  }[] = [];

  if (req.enabledConnectors.includes("google-drive")) {
    tools.push(
      {
        type: "function",
        function: {
          name: "search_google_drive",
          description: "Search the user's Google Drive by keyword or title.",
          parameters: {
            type: "object",
            properties: { query: { type: "string" } },
            required: ["query"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "read_google_drive_file",
          description: "Read a Google Drive file by id.",
          parameters: {
            type: "object",
            properties: { fileId: { type: "string" } },
            required: ["fileId"],
          },
        },
      },
    );
  }
  if (req.enabledConnectors.includes("gmail")) {
    tools.push({
      type: "function",
      function: {
        name: "search_gmail",
        description: "Search the user's Gmail with a Gmail query string.",
        parameters: {
          type: "object",
          properties: { query: { type: "string" } },
          required: ["query"],
        },
      },
    });
  }
  if (req.enabledConnectors.includes("google-calendar")) {
    tools.push({
      type: "function",
      function: {
        name: "search_google_calendar",
        description: "Search upcoming Google Calendar events.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string" },
            timeMin: { type: "string", description: "ISO datetime lower bound" },
            timeMax: { type: "string", description: "ISO datetime upper bound" },
          },
        },
      },
    });
  }
  if (req.enabledConnectors.includes("outlook")) {
    tools.push({
      type: "function",
      function: {
        name: "search_outlook",
        description: "Search Outlook mail.",
        parameters: {
          type: "object",
          properties: { query: { type: "string" } },
          required: ["query"],
        },
      },
    });
  }
  if (req.enabledConnectors.includes("outlook-calendar")) {
    tools.push({
      type: "function",
      function: {
        name: "search_outlook_calendar",
        description: "Search Outlook calendar events.",
        parameters: {
          type: "object",
          properties: { query: { type: "string" } },
        },
      },
    });
  }
  if (req.enabledConnectors.includes("teams")) {
    tools.push({
      type: "function",
      function: {
        name: "search_teams",
        description: "Search Microsoft Teams messages.",
        parameters: {
          type: "object",
          properties: { query: { type: "string" } },
          required: ["query"],
        },
      },
    });
  }
  if (req.enabledSkills.includes("github")) {
    tools.push({
      type: "function",
      function: {
        name: "search_github",
        description: "Search public GitHub repositories.",
        parameters: {
          type: "object",
          properties: { query: { type: "string" } },
          required: ["query"],
        },
      },
    });
  }
  const docSkills = ["word", "pdf", "spreadsheet", "presentation"].filter((id) =>
    req.enabledSkills.includes(id),
  );
  if (docSkills.length > 0) {
    tools.push({
      type: "function",
      function: {
        name: "create_file",
        description:
          "Create a downloadable file for the user. Use word, pdf, spreadsheet, or presentation.",
        parameters: {
          type: "object",
          properties: {
            kind: { type: "string", enum: docSkills },
            title: { type: "string" },
            content: {
              type: "string",
              description: "Full file body. For slides, use markdown headings per slide.",
            },
          },
          required: ["kind", "title", "content"],
        },
      },
    });
  }
  return tools;
}

function systemPrompt(req: ChatRequest): string {
  const connectors = req.enabledConnectors
    .map((id) => catalogById(id)?.name ?? id)
    .join(", ");
  const skills = [
    ...req.enabledSkills.map((id) => catalogById(id)?.name ?? id),
    ...req.customSkills.map((s) => s.name),
  ].join(", ");
  const custom =
    req.customSkills.length === 0
      ? ""
      : `\nCustom skills:\n${req.customSkills
          .map((s) => `- ${s.name}: ${s.description}. Instructions: ${s.instructions}`)
          .join("\n")}`;
  const files =
    req.files.length === 0
      ? "No files attached."
      : req.files
          .map(
            (f) =>
              `FILE ${f.name} (${f.mimeType}, ${f.size} bytes)\n${f.text.slice(0, 12000)}`,
          )
          .join("\n\n---\n\n");

  return `You are SLIeQwneB oss 7×, a precise workspace agent. You help with documents, connected accounts, and file skills.
Write in clear prose. Prefer short sections over filler. Never use emoji.
When a connector is needed, call the matching tool instead of pretending you fetched data.
If a tool returns login_required, not_connected, or pending, explain that the user must connect the service in Grok — do not invent emails, files, or events.
When asked to create a document, spreadsheet, PDF, or deck, call create_file with the full content.
Enabled connectors: ${connectors || "none"}.
Enabled skills: ${skills || "none"}.${custom}

Attached files:
${files}`;
}

async function grokChat(
  apiKey: string,
  messages: GrokMessage[],
  tools: ReturnType<typeof buildTools>,
): Promise<{ message: GrokMessage; error?: string }> {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools: tools.length ? tools : undefined,
      max_tokens: MAX_TOKENS,
      temperature: 0.4,
    }),
  });
  if (!res.ok) {
    return { message: { role: "assistant", content: "" }, error: `xAI API error ${res.status}` };
  }
  const body = (await res.json()) as {
    choices?: { message?: GrokMessage }[];
  };
  return { message: body.choices?.[0]?.message ?? { role: "assistant", content: "" } };
}

async function runConnectorTool(
  name: string,
  args: Record<string, unknown>,
): Promise<{ payload: unknown; loginRequired?: boolean; loginUrl?: string }> {
  const { callTool, GoogleDriveTools, GoogleCalendarTools } = await import(
    "@/lib/app-data/client.server"
  );

  const map: Record<
    string,
    { tool: string; connectorId: string; args: Record<string, unknown> }
  > = {
    search_google_drive: {
      tool: GoogleDriveTools.search,
      connectorId: "google-drive",
      args: { query: str(args.query) },
    },
    read_google_drive_file: {
      tool: GoogleDriveTools.readFile,
      connectorId: "google-drive",
      args: { file_id: str(args.fileId || args.file_id) },
    },
    search_gmail: {
      tool: "gmail_search",
      connectorId: "gmail",
      args: { query: str(args.query) },
    },
    search_google_calendar: {
      tool: GoogleCalendarTools.search,
      connectorId: "google-calendar",
      args: {
        query: str(args.query),
        time_min: str(args.timeMin || args.time_min) || undefined,
        time_max: str(args.timeMax || args.time_max) || undefined,
      },
    },
    search_outlook: {
      tool: "outlook_search",
      connectorId: "outlook",
      args: { query: str(args.query) },
    },
    search_outlook_calendar: {
      tool: "outlook_calendar_search",
      connectorId: "outlook-calendar",
      args: { query: str(args.query) },
    },
    search_teams: {
      tool: "microsoft_teams_search",
      connectorId: "teams",
      args: { query: str(args.query) },
    },
  };

  const spec = map[name];
  if (!spec) return { payload: { error: `Unknown tool ${name}` } };
  const item = connectorFor(spec.connectorId);
  if (!item?.connectorType) return { payload: { error: "Connector not configured" } };

  const result = await callTool(spec.tool, spec.args, { connectorType: item.connectorType });
  const classified = classifyCallToolError(result);
  if (!result.ok) {
    return {
      payload: {
        ok: false,
        kind: classified?.kind,
        message: classified?.message ?? result.errorMessage,
      },
      loginRequired: result.loginRequired,
      loginUrl: result.loginUrl,
    };
  }
  return { payload: result.data };
}

export async function runChat(req: ChatRequest): Promise<ChatResponse> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "AI is not available in this environment." };
  }

  const tools = buildTools(req);
  const history = req.messages.slice(-16).map((m) => ({
    role: m.role,
    content: m.content.slice(0, 8000),
  })) as GrokMessage[];

  const messages: GrokMessage[] = [
    { role: "system", content: systemPrompt(req) },
    ...history,
  ];

  const artifacts: Artifact[] = [];
  const traces: ToolTrace[] = [];
  let loginRequired = false;
  let loginUrl: string | undefined;

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const { message, error } = await grokChat(apiKey, messages, tools);
    if (error) return { ok: false, error, loginRequired, loginUrl };

    const calls = message.tool_calls ?? [];
    if (calls.length === 0) {
      const content = (message.content ?? "").trim();
      if (!content && artifacts.length === 0) {
        return { ok: false, error: "The agent returned an empty response." };
      }
      return {
        ok: true,
        content: content || "Created the file. Download it from the card below.",
        artifacts,
        traces,
      };
    }

    messages.push(message);
    for (const call of calls) {
      const args = jsonArgs(call.function.arguments);
      let payload: unknown = { error: "unhandled tool" };
      if (call.function.name === "search_github") {
        payload = await githubSearch(str(args.query));
        traces.push({ name: "GitHub", summary: str(args.query, "search"), ok: true });
      } else if (call.function.name === "create_file") {
        const kind = str(args.kind) as Artifact["kind"];
        const title = str(args.title, "Untitled");
        const content = str(args.content);
        const allowed: Artifact["kind"][] = ["word", "pdf", "spreadsheet", "presentation", "text"];
        const safeKind = allowed.includes(kind) ? kind : "text";
        const artifact = createArtifact(safeKind, title, content);
        artifacts.push(artifact);
        payload = { ok: true, filename: artifact.filename, kind: artifact.kind };
        traces.push({ name: "Create file", summary: artifact.filename, ok: true });
      } else {
        const result = await runConnectorTool(call.function.name, args);
        payload = result.payload;
        if (result.loginRequired) {
          loginRequired = true;
          loginUrl = result.loginUrl;
        }
        const ok = !(payload && typeof payload === "object" && "ok" in payload && (payload as { ok?: boolean }).ok === false);
        traces.push({
          name: call.function.name.replaceAll("_", " "),
          summary: str(args.query) || str(args.fileId) || "lookup",
          ok,
        });
      }
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(payload).slice(0, 12000),
      });
    }
  }

  return {
    ok: true,
    content: "I reached the tool-call limit. Ask me to continue from the last result.",
    artifacts,
    traces,
  };
}

export async function probeConnector(connectorId: string) {
  const item = connectorFor(connectorId);
  if (!item?.connectorType || !item.probeTool) {
    return {
      ok: false,
      message: "This connector is not available here.",
      kind: "error" as const,
    };
  }
  const { callTool } = await import("@/lib/app-data/client.server");
  const result = await callTool(item.probeTool, item.probeArgs ?? {}, {
    connectorType: item.connectorType,
  });
  const classified = classifyCallToolError(result);
  if (result.ok) {
    return { ok: true, message: `Connected to ${item.name}.` };
  }
  return {
    ok: false,
    pending: result.pending,
    loginRequired: result.loginRequired,
    loginUrl: result.loginUrl,
    message: classified?.message ?? result.errorMessage ?? "Could not reach this connector.",
    kind: classified?.kind,
  };
}
