import type { PuterSDK } from "@/lib/puter";

export type PuterToolDefinition = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
    strict?: boolean;
  };
};

const githubRepoPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

export const PUTER_AGENT_TOOLS: PuterToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "github_get_repo",
      description: "Read metadata for a public GitHub repository. Use owner/name format.",
      parameters: {
        type: "object",
        properties: { repository: { type: "string", description: "GitHub repository, e.g. appleid7899067-netizen/77" } },
        required: ["repository"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "github_get_file",
      description: "Read a text file from a public GitHub repository. Use owner/name and an optional branch/ref.",
      parameters: {
        type: "object",
        properties: {
          repository: { type: "string" },
          path: { type: "string" },
          ref: { type: "string", description: "Branch, tag, or commit SHA; defaults to the repository default branch." },
        },
        required: ["repository", "path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "puter_read_file",
      description: "Read UTF-8 text from the signed-in user's Puter cloud filesystem.",
      parameters: {
        type: "object",
        properties: { path: { type: "string" } },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "puter_list_files",
      description: "List entries in a directory in the signed-in user's Puter cloud filesystem.",
      parameters: {
        type: "object",
        properties: { path: { type: "string" } },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "puter_write_file",
      description: "Write UTF-8 text to a Puter cloud file. Only use when the user explicitly asked to create or modify that cloud file.",
      parameters: {
        type: "object",
        properties: { path: { type: "string" }, content: { type: "string" } },
        required: ["path", "content"],
      },
    },
  },
];

function safeRepository(value: unknown): string {
  const repository = String(value ?? "").trim();
  if (!githubRepoPattern.test(repository)) throw new Error("Invalid GitHub repository. Expected owner/name.");
  return repository;
}

function safePath(value: unknown): string {
  const path = String(value ?? "").trim();
  if (!path || path.length > 1000 || path.includes("\\")) throw new Error("Invalid file path.");
  return path;
}

async function githubJson(puter: PuterSDK, url: string): Promise<unknown> {
  if (!puter.net?.fetch) throw new Error("Puter networking is unavailable.");
  const response = await puter.net.fetch(url, {
    headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`GitHub request failed (${response.status}): ${body.slice(0, 500)}`);
  return JSON.parse(body) as unknown;
}

function decodeGitHubContent(content: string): string {
  const normalized = content.replace(/\s/g, "");
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export async function executePuterTool(puter: PuterSDK, name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "github_get_repo": {
      const repository = safeRepository(args.repository);
      const data = (await githubJson(puter, `https://api.github.com/repos/${repository}`)) as Record<string, unknown>;
      return JSON.stringify({
        full_name: data.full_name,
        private: data.private,
        default_branch: data.default_branch,
        html_url: data.html_url,
        description: data.description,
        visibility: data.visibility,
        pushed_at: data.pushed_at,
      });
    }
    case "github_get_file": {
      const repository = safeRepository(args.repository);
      const path = safePath(args.path).split("/").map(encodeURIComponent).join("/");
      const ref = args.ref ? `?ref=${encodeURIComponent(String(args.ref))}` : "";
      const data = (await githubJson(puter, `https://api.github.com/repos/${repository}/contents/${path}${ref}`)) as Record<string, unknown>;
      if (data.type !== "file" || typeof data.content !== "string") throw new Error("GitHub path is not a readable text file.");
      const content = decodeGitHubContent(data.content);
      return JSON.stringify({ path: args.path, sha: data.sha, size: data.size, content: content.slice(0, 200_000) });
    }
    case "puter_read_file": {
      if (!puter.fs?.read) throw new Error("Puter filesystem read is unavailable.");
      const path = safePath(args.path);
      const blob = await puter.fs.read(path);
      return JSON.stringify({ path, content: (await blob.text()).slice(0, 200_000) });
    }
    case "puter_list_files": {
      if (!puter.fs?.readdir) throw new Error("Puter filesystem listing is unavailable.");
      const path = safePath(args.path);
      const items = await puter.fs.readdir(path);
      return JSON.stringify(items.slice(0, 500));
    }
    case "puter_write_file": {
      if (!puter.fs?.write) throw new Error("Puter filesystem write is unavailable.");
      const path = safePath(args.path);
      const content = String(args.content ?? "");
      if (content.length > 1_000_000) throw new Error("Refusing to write more than 1 MB through the agent tool.");
      const item = await puter.fs.write(path, content);
      return JSON.stringify({ ok: true, path: item.path, size: content.length });
    }
    default:
      throw new Error(`Unknown Puter tool: ${name}`);
  }
}
