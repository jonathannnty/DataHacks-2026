import { describe, expect, it } from "vitest";
import type { StoryNode } from "../../src/game/simulation/storyNode";

describe("StoryConsole skeleton", () => {
  it("can be wired to a story node", () => {
    const node: StoryNode = {
      NodeID: "ROOT_001",
      Day: 1,
      Title: "Scaffold",
      Context: "Scaffold context",
      Choices: [],
    };

    expect(node.Title).toContain("Scaffold");
  });
});
