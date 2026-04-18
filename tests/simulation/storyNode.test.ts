import { describe, expect, it } from "vitest";
import type { StoryNode } from "../../src/game/simulation/storyNode";

describe("story nodes", () => {
  it("supports the required StoryNode shape", () => {
    const node: StoryNode = {
      NodeID: "ROOT_001",
      Title: "Test Node",
      Context: "Context",
      Choices: [],
    };

    expect(node.NodeID).toBe("ROOT_001");
  });
});
