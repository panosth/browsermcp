import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import {
  GoBackTool,
  GoForwardTool,
  NavigateTool,
  PressKeyTool,
  ScrollDownTool,
  ScrollUpTool,
  WaitTool,
} from "@repo/types/mcp/tool";

import { captureAriaSnapshot } from "@/utils/aria-snapshot";

import type { Tool, ToolFactory } from "./tool";

export const navigate: ToolFactory = (snapshot) => ({
  schema: {
    name: NavigateTool.shape.name.value,
    description: NavigateTool.shape.description.value,
    inputSchema: zodToJsonSchema(NavigateTool.shape.arguments),
  },
  handle: async (context, params) => {
    const { url } = NavigateTool.shape.arguments.parse(params);
    await context.sendSocketMessage("browser_navigate", { url });
    if (snapshot) {
      return captureAriaSnapshot(context);
    }
    return {
      content: [
        {
          type: "text",
          text: `Navigated to ${url}`,
        },
      ],
    };
  },
});

const scrollArguments = z.object({
  percentage: z
    .number()
    .min(0, { message: "percentage must be between 0 and 100" })
    .max(100, { message: "percentage must be between 0 and 100" })
    .describe(
      "Percentage of the page height to scroll. 100 scrolls a full page; 50 scrolls half a page.",
    ),
});

type ScrollToolShape = typeof ScrollUpTool.shape;

const createScrollTool: (
  shape: ScrollToolShape,
  direction: "up" | "down",
) => ToolFactory = (shape, direction) => (snapshot) => ({
  schema: {
    name: shape.name.value,
    description: shape.description.value,
    inputSchema: zodToJsonSchema(scrollArguments),
  },
  handle: async (context, params) => {
    const validatedParams = scrollArguments.parse(params);
    await context.sendSocketMessage(`browser_scroll_${direction}`, validatedParams);

    if (snapshot) {
      const ariaSnapshot = await captureAriaSnapshot(context);
      return {
        content: [
          {
            type: "text",
            text: `Scrolled ${direction} ${validatedParams.percentage}% of the page`,
          },
          ...ariaSnapshot.content,
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Scrolled ${direction} ${validatedParams.percentage}% of the page`,
        },
      ],
    };
  },
});

export const goBack: ToolFactory = (snapshot) => ({
  schema: {
    name: GoBackTool.shape.name.value,
    description: GoBackTool.shape.description.value,
    inputSchema: zodToJsonSchema(GoBackTool.shape.arguments),
  },
  handle: async (context) => {
    await context.sendSocketMessage("browser_go_back", {});
    if (snapshot) {
      return captureAriaSnapshot(context);
    }
    return {
      content: [
        {
          type: "text",
          text: "Navigated back",
        },
      ],
    };
  },
});

export const goForward: ToolFactory = (snapshot) => ({
  schema: {
    name: GoForwardTool.shape.name.value,
    description: GoForwardTool.shape.description.value,
    inputSchema: zodToJsonSchema(GoForwardTool.shape.arguments),
  },
  handle: async (context) => {
    await context.sendSocketMessage("browser_go_forward", {});
    if (snapshot) {
      return captureAriaSnapshot(context);
    }
    return {
      content: [
        {
          type: "text",
          text: "Navigated forward",
        },
      ],
    };
  },
});

export const scrollUp: ToolFactory = createScrollTool(ScrollUpTool.shape, "up");

export const scrollDown: ToolFactory = createScrollTool(
  ScrollDownTool.shape,
  "down",
);

export const wait: Tool = {
  schema: {
    name: WaitTool.shape.name.value,
    description: WaitTool.shape.description.value,
    inputSchema: zodToJsonSchema(WaitTool.shape.arguments),
  },
  handle: async (context, params) => {
    const { time } = WaitTool.shape.arguments.parse(params);
    await context.sendSocketMessage("browser_wait", { time });
    return {
      content: [
        {
          type: "text",
          text: `Waited for ${time} seconds`,
        },
      ],
    };
  },
};

export const pressKey: Tool = {
  schema: {
    name: PressKeyTool.shape.name.value,
    description: PressKeyTool.shape.description.value,
    inputSchema: zodToJsonSchema(PressKeyTool.shape.arguments),
  },
  handle: async (context, params) => {
    const { key } = PressKeyTool.shape.arguments.parse(params);
    await context.sendSocketMessage("browser_press_key", { key });
    return {
      content: [
        {
          type: "text",
          text: `Pressed key ${key}`,
        },
      ],
    };
  },
};
