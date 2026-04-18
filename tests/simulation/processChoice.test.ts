import { describe, expect, it } from "vitest";
import { createDefaultMetrics } from "../../src/game/simulation/metrics";
import { resolveChoiceOutcome } from "../../src/game/simulation/processChoice";
import { getWasteVilleStoryNode } from "../../src/game/simulation/storyNodes.wasteVille";

describe("processChoice", () => {
  it("routes crisis gate nodes based on equity and sentiment thresholds", () => {
    const node = getWasteVilleStoryNode("CRISIS_GATE_01");

    if (!node) {
      throw new Error("Missing crisis gate node");
    }

    const result = resolveChoiceOutcome(
      {
        SessionID: "session-1",
        CurrentNodeID: "CRISIS_GATE_01",
        Metrics: {
          ...createDefaultMetrics(),
          SocialEquity: 20,
          PublicSentiment: 25,
        },
        MapState: {},
      },
      node,
      node.Choices[0],
    );

    expect(result.nextNodeId).toBe("CRISIS_PROTEST_01");
    expect(result.endStateReasonCode).toBe("PROTEST");
  });
});
