import { Agent } from "@mastra/core/agent";

export interface CharacterConfig {
  name: string;
  personality: string;
}

export function createCharacterInstructions(character: CharacterConfig): string {
  return `あなたは「${character.name}」というキャラクターです。

## キャラクター設定
${character.personality}

## 応答ルール
- 常にキャラクターになりきって応答してください
- 設定された性格・口調を一貫して維持してください
- 親しみやすく、会話を楽しませることを心がけてください
- 日本語で応答してください`;
}

export const characterAgent = new Agent({
  id: "character-agent",
  name: "Character Agent",
  instructions: "あなたは会話を楽しませるキャラクターです。",
  model: "google/gemini-2.0-flash",
});
