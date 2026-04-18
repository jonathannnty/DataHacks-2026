import { describe, expect, it } from "vitest";
import { createDefaultMetrics } from "../../src/game/simulation/metrics";
import {
  MARKET_CRASH_PROBABILITY,
  rollCatastrophe,
} from "../../src/game/simulation/catastrophe";
import { resolveChoiceOutcome } from "../../src/game/simulation/processChoice";
import { getWasteVilleStoryNode } from "../../src/game/simulation/storyNodes.wasteVille";

describe("catastrophe engine", () => {
  it("triggers LANDFILL_FIRE when InfrastructureLoad exceeds 80", () => {
    const result = rollCatastrophe({
      metrics: { ...createDefaultMetrics(), InfrastructureLoad: 90 },
      random: () => 0.99,
    });
    expect(result).toBe("LANDFILL_FIRE");
  });

  it("triggers MARKET_CRASH when the random roll is below 0.05", () => {
    const result = rollCatastrophe({
      metrics: createDefaultMetrics(),
      random: () => MARKET_CRASH_PROBABILITY - 0.001,
    });
    expect(result).toBe("MARKET_CRASH");
  });

  it("does not trigger when neither condition fires", () => {
    const result = rollCatastrophe({
      metrics: createDefaultMetrics(),
      random: () => 0.99,
    });
    expect(result).toBeNull();
  });

  it("routes processChoice through LANDFILL_FIRE when infra load spikes", () => {
    const node = getWasteVilleStoryNode("ROOT_001");
    if (!node) throw new Error("ROOT_001 missing");
    // Industrial-expansion choice (+14 InfrastructureLoad) pushes us over 80.
    const result = resolveChoiceOutcome(
      {
        SessionID: "sess-fire",
        CurrentNodeID: "ROOT_001",
        Metrics: {
          ...createDefaultMetrics(),
          InfrastructureLoad: 75,
        },
        MapState: {},
      },
      node,
      node.Choices[1],
      { random: () => 0.99 },
    );
    expect(result.nextNodeId).toBe("LANDFILL_FIRE");
    expect(result.catastrophe).toBe("LANDFILL_FIRE");
    expect(result.endStateReasonCode).toBe("CATASTROPHE");
  });
});
