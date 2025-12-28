import { createSocketMessageSender } from "@r2r/messaging/ws/sender";
import { WebSocket } from "ws";

import { mcpConfig } from "@repo/config/mcp.config";
import { MessagePayload, MessageType } from "@repo/messaging/types";
import { SocketMessageMap } from "@repo/types/messages/ws";

const noConnectionMessage = `No connection to browser extension. In order to proceed, you must first connect a tab by clicking the Browser MCP extension icon in the browser toolbar and clicking the 'Connect' button.`;

export class Context {
  private _ws: WebSocket | undefined;
  private wsCleanup: (() => void) | undefined;

  get ws(): WebSocket {
    if (!this.isWsReady() || !this._ws) {
      throw new Error(noConnectionMessage);
    }
    return this._ws;
  }

  set ws(ws: WebSocket) {
    this.attachWebSocket(ws);
  }

  hasWs(): boolean {
    return this.isWsReady();
  }

  private isWsReady(): boolean {
    return this._ws?.readyState === WebSocket.OPEN;
  }

  private attachWebSocket(ws: WebSocket) {
    this.cleanupWebSocket(1001, "Replaced by new browser extension connection");

    const handleClose = () => this.cleanupWebSocket();
    const handleError = () => this.cleanupWebSocket();

    ws.on("close", handleClose);
    ws.on("error", handleError);

    this.wsCleanup = () => {
      ws.off("close", handleClose);
      ws.off("error", handleError);
    };

    this._ws = ws;
  }

  private cleanupWebSocket(code?: number, reason?: string) {
    if (!this._ws) return;

    const socket = this._ws;
    this.wsCleanup?.();
    this.wsCleanup = undefined;
    this._ws = undefined;

    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
      socket.close(code, reason);
    }
  }

  async sendSocketMessage<T extends MessageType<SocketMessageMap>>(
    type: T,
    payload: MessagePayload<SocketMessageMap, T>,
    options: { timeoutMs?: number } = { timeoutMs: 30000 },
  ) {
    if (!this.isWsReady()) {
      throw new Error(noConnectionMessage);
    }

    const { sendSocketMessage } = createSocketMessageSender<SocketMessageMap>(
      this.ws,
    );
    try {
      return await sendSocketMessage(type, payload, options);
    } catch (e) {
      if (e instanceof Error && e.message === mcpConfig.errors.noConnectedTab) {
        throw new Error(noConnectionMessage);
      }
      if (e instanceof Error && e.message.includes("WebSocket is not open")) {
        this.cleanupWebSocket();
        throw new Error(noConnectionMessage);
      }
      throw e;
    }
  }

  async close() {
    this.cleanupWebSocket();
  }
}
