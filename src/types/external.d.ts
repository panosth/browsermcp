declare module "@repo/config/mcp.config" {
  export const mcpConfig: {
    defaultWsPort: number;
    errors: { noConnectedTab: string };
  };
}

declare module "@repo/config/app.config" {
  export const appConfig: { name: string };
}

declare module "@repo/messaging/types" {
  export type MessageType<T> = keyof T & string;
  export type MessagePayload<T, K extends MessageType<T>> = T[K];
}

declare module "@repo/types/messages/ws" {
  export type SocketMessageMap = Record<string, any>;
}

declare module "@repo/types/mcp/tool" {
  import { z } from "zod";

  export const NavigateTool: {
    shape: {
      name: { value: string };
      description: { value: string };
      arguments: z.ZodObject<any>;
    };
  };

  export const GoBackTool: typeof NavigateTool;
  export const GoForwardTool: typeof NavigateTool;
  export const WaitTool: typeof NavigateTool;
  export const PressKeyTool: typeof NavigateTool;
  export const ClickTool: typeof NavigateTool;
  export const DragTool: typeof NavigateTool;
  export const HoverTool: typeof NavigateTool;
  export const TypeTool: typeof NavigateTool;
  export const SelectOptionTool: typeof NavigateTool;
  export const ScrollUpTool: typeof NavigateTool;
  export const ScrollDownTool: typeof NavigateTool;
  export const SnapshotTool: typeof NavigateTool;
  export const GetConsoleLogsTool: typeof NavigateTool;
  export const ScreenshotTool: typeof NavigateTool;
}

declare module "@repo/utils" {
  export function wait(ms: number): Promise<void>;
}

declare module "@r2r/messaging/ws/sender" {
  import { WebSocket } from "ws";

  export function createSocketMessageSender<T>(ws: WebSocket): {
    sendSocketMessage: (
      type: keyof T & string,
      payload: any,
      options?: { timeoutMs?: number },
    ) => Promise<any>;
  };
}

declare module "ws" {
  export class WebSocket {
    static readonly CONNECTING: 0;
    static readonly OPEN: 1;
    static readonly CLOSING: 2;
    static readonly CLOSED: 3;
    readyState: number;
    close(code?: number, reason?: string): void;
    on(event: "close" | "error", listener: () => void): void;
    off(event: "close" | "error", listener: () => void): void;
  }

  export class WebSocketServer {
    constructor(options: { port: number });
    on(event: "connection", listener: (socket: WebSocket) => void): void;
    on(event: "error", listener: (error: unknown) => void): void;
    close(): Promise<void>;
  }
}

declare module "@modelcontextprotocol/sdk/server/index.js" {
  export class Server {
    constructor(metadata: { name: string; version: string }, options: any);
    connect(transport: any): Promise<void>;
    close(): Promise<void>;
    setRequestHandler(schema: any, handler: (...args: any[]) => any): void;
  }
}

declare module "@modelcontextprotocol/sdk/server/stdio.js" {
  export class StdioServerTransport {
    constructor();
  }
}

declare module "@modelcontextprotocol/sdk/types.js" {
  export const ListToolsRequestSchema: any;
  export const ListResourcesRequestSchema: any;
  export const CallToolRequestSchema: any;
  export const ReadResourceRequestSchema: any;
  export type ImageContent = { type: "image"; data: string; mimeType: string };
  export type TextContent = { type: "text"; text: string };
}

declare module "commander" {
  export const program: any;
}

declare module "zod-to-json-schema" {
  export function zodToJsonSchema(schema: any): any;
  export type JsonSchema7Type = any;
}
