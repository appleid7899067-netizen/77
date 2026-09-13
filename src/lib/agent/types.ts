export type ChatRole = "user" | "assistant" | "system";

export type AttachedFile = {
  name: string;
  mimeType: string;
  size: number;
  text: string;
  puterPath?: string;
};

export type Artifact = {
  id: string;
  filename: string;
  mimeType: string;
  base64: string;
  kind: "word" | "pdf" | "spreadsheet" | "presentation" | "text";
};

export type ToolTrace = {
  name: string;
  summary: string;
  ok: boolean;
};

export type ConnectorProbeResult = {
  ok: boolean;
  pending?: boolean;
  loginRequired?: boolean;
  loginUrl?: string;
  message: string;
  kind?: "pending" | "login" | "not_connected" | "scope_denied" | "access_denied" | "error";
};

export type ChatRequest = {
  messages: { role: ChatRole; content: string }[];
  files: AttachedFile[];
  enabledConnectors: string[];
  enabledSkills: string[];
  customSkills: { id: string; name: string; description: string; instructions: string }[];
};

export type ChatSuccess = {
  ok: true;
  content: string;
  artifacts: Artifact[];
  traces: ToolTrace[];
};

export type ChatFailure = {
  ok: false;
  error: string;
  loginRequired?: boolean;
  loginUrl?: string;
};

export type ChatResponse = ChatSuccess | ChatFailure;
