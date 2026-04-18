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
});
