declare namespace NodeJS {
  interface ReadStream {
    on(event: "close", listener: () => void): this;
  }

  interface Process {
    stdin: ReadStream;
    platform: string;
    env: Record<string, string | undefined>;
    argv: string[];
    exit(code?: number): never;
  }
}

declare var process: NodeJS.Process;

declare module "node:child_process" {
  export function execSync(
    command: string,
    options?: { encoding?: BufferEncoding },
  ): string;
}

declare module "node:net" {
  import { EventEmitter } from "events";

  class Server extends EventEmitter {
    listen(port: number): void;
    close(callback?: () => void): void;
  }

  export function createServer(): Server;
}

declare module "events" {
  class EventEmitter {
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
  }

  export { EventEmitter };
}
