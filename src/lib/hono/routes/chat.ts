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
  try {
    const body = await c.req.json<ChatRequest>();
    const { messages, character } = body;

    if (!character?.name || !character?.personality) {
      return c.json({ error: "キャラクター情報が不正です" }, 400);
    }

    if (!messages || !Array.isArray(messages)) {
      return c.json({ error: "メッセージが不正です" }, 400);
    }

    const systemPrompt = createCharacterInstructions(character);

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      messages,
      maxOutputTokens: 500,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return c.json(
      { error: "メッセージの処理中にエラーが発生しました" },
      500
    );
  }
});
