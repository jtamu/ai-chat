import { Hono } from "hono";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import {
  createCharacterInstructions,
  type CharacterConfig,
} from "../../mastra/agents/character-agent";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  character: CharacterConfig;
}

const google = createGoogleGenerativeAI();

export const chatRoute = new Hono();

chatRoute.post("/", async (c) => {
  const body = await c.req.json<ChatRequest>();
  const { messages, character } = body;

  const systemPrompt = createCharacterInstructions(character);

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: systemPrompt,
    messages,
    maxOutputTokens: 500,
  });

  return result.toTextStreamResponse();
});
