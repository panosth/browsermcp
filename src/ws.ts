import { WebSocketServer } from "ws";

import { mcpConfig } from "@repo/config/mcp.config";
import { wait } from "@repo/utils";

import { isPortInUse, killProcessOnPort } from "@/utils/port";

export async function createWebSocketServer(
  port: number = mcpConfig.defaultWsPort,
): Promise<WebSocketServer> {
  killProcessOnPort(port);
  // Wait until the port is free
  let attempts = 0;
  while (await isPortInUse(port)) {
    if (attempts++ > 50) {
      throw new Error(`WebSocket server port ${port} did not become available`);
    }
    await wait(100);
  }
  return new WebSocketServer({ port });
}
