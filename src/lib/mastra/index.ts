import { Mastra } from "@mastra/core";

import { characterAgent } from "./agents/character-agent";

export const mastra = new Mastra({
  agents: {
    characterAgent,
  },
});
