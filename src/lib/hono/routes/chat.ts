import { Hono } from "hono";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import {
  createCharacterInstructions,
  type CharacterConfig,
} from "../../mastra/agents/character-agent";

interface MessagePart {
  type: string;
  text?: string;
  image?: string;
}

interface UIMessage {
  role: "user" | "assistant" | "system";
  content?: string;
  parts?: MessagePart[];
}

interface ChatRequest {
  messages: UIMessage[];
  character: CharacterConfig;
  imageData?: string;
  imageMimeType?: string;
}

const google = createGoogleGenerativeAI();

export const chatRoute = new Hono();

chatRoute.post("/", async (c) => {
  try {
    const body = await c.req.json<ChatRequest>();
    const { messages, character, imageData, imageMimeType } = body;

    if (!character?.name || !character?.personality) {
      return c.json({ error: "キャラクター情報が不正です" }, 400);
    }

    if (!messages || !Array.isArray(messages)) {
      return c.json({ error: "メッセージが不正です" }, 400);
    }

    // UIMessage形式からModelMessage形式に変換
    const convertedMessages = messages.map((msg, index) => {
      let content = msg.content;
      if (!content && msg.parts) {
        content = msg.parts
          .filter((part) => part.type === "text" && part.text)
          .map((part) => part.text)
          .join("");
      }

      // 最後のユーザーメッセージに画像を追加
      const isLastUserMessage =
        index === messages.length - 1 &&
        msg.role === "user" &&
        imageData &&
        imageMimeType;

      if (isLastUserMessage) {
        return {
          role: msg.role,
          content: [
            { type: "text", text: content || "" },
            {
              type: "image",
              image: imageData,
              mimeType: imageMimeType,
            },
          ],
        };
      }

      return {
        role: msg.role,
        content: content || "",
      };
    });

    const systemPrompt = createCharacterInstructions(character);

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      messages: convertedMessages,
      maxOutputTokens: 500,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return c.json(
      { error: "メッセージの処理中にエラーが発生しました" },
      500
    );
  }
});
