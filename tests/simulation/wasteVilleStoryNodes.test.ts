import { describe, expect, it } from "vitest";
import { WASTEVILLE_STORY_NODES } from "../../src/game/simulation/storyNodes.wasteVille";

describe("WasteVille story nodes", () => {
  it("includes the expected Phase 1 branch structure", () => {
    const rootNode = WASTEVILLE_STORY_NODES.find(
      (node) => node.NodeID === "ROOT_001",
    );

    expect(rootNode?.Choices).toHaveLength(3);
    expect(
      WASTEVILLE_STORY_NODES.some(
        (node) => node.NodeID === "CRISIS_PROTEST_01",
      ),
    ).toBe(true);
  });

  it("assigns every node a Day number", () => {
    for (const node of WASTEVILLE_STORY_NODES) {
      expect(
        typeof node.Day,
        `${node.NodeID} is missing a Day number`,
      ).toBe("number");
      expect(node.Day, `${node.NodeID} Day must be >= 1`).toBeGreaterThanOrEqual(1);
    }
  });

  it("keeps every choice within the same day or the next day", () => {
    const byId = new Map(WASTEVILLE_STORY_NODES.map((n) => [n.NodeID, n]));
    for (const node of WASTEVILLE_STORY_NODES) {
      for (const choice of node.Choices) {
        const next = byId.get(choice.NextNodeID);
        expect(
          next,
          `${node.NodeID} choice points at unknown node ${choice.NextNodeID}`,
        ).toBeDefined();
        if (!next) continue;
        const gap = next.Day - node.Day;
        expect(
          gap,
          `${node.NodeID} (Day ${node.Day}) → ${next.NodeID} (Day ${next.Day}) must be same-day or +1`,
        ).toBeGreaterThanOrEqual(0);
        expect(
          gap,
          `${node.NodeID} (Day ${node.Day}) → ${next.NodeID} (Day ${next.Day}) must be same-day or +1`,
        ).toBeLessThanOrEqual(1);
      }
    }
  });
});
