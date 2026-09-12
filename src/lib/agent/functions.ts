import { createServerFn } from "@tanstack/react-start";
import type { ChatRequest, ChatResponse, ConnectorProbeResult } from "./types.ts";

export const sendChat = createServerFn({ method: "POST" })
  .validator((input: ChatRequest) => input)
  .handler(async ({ data }): Promise<ChatResponse> => {
    const { runChat } = await import("./runtime.server.ts");
    return runChat(data);
  });

export const probeConnectorFn = createServerFn({ method: "POST" })
  .validator((input: { connectorId: string }) => input)
  .handler(async ({ data }): Promise<ConnectorProbeResult> => {
    const { probeConnector } = await import("./runtime.server.ts");
    return probeConnector(data.connectorId);
  });
