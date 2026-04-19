import { beforeEach, describe, expect, it } from "vitest";
import { useGameStore } from "../../src/game/state/gameStore";

describe("day dossier queue", () => {
  beforeEach(() => {
    useGameStore.getState().startNewGame();
  });

  it("starts with a concrete queue for day 1", () => {
    const state = useGameStore.getState();
    expect(state.currentDay).toBe(1);
    expect(state.dayQueueNodeIds).toEqual(["ROOT_001"]);
    expect(state.dayCompletedNodeIds).toEqual([]);
  });

  it("advances through same-day follow-up dossiers before changing day", () => {
    const store = useGameStore;

    // Day 1 -> Day 2 (status-quo branch)
    store.getState().makeChoice(2);
    let state = store.getState();
    expect(state.currentNodeId).toBe("STRICT_CRISIS_01");
    expect(state.currentDay).toBe(2);
    expect(state.dayQueueNodeIds).toEqual(["STRICT_CRISIS_01"]);

    // Day 2 -> Day 3
    store.getState().makeChoice(0);
    state = store.getState();
    expect(state.currentNodeId).toBe("CRISIS_GATE_01");
    expect(state.currentDay).toBe(3);
    expect(state.dayQueueNodeIds).toEqual(["CRISIS_GATE_01"]);

    // Day 3 -> same Day 3 follow-up
    store.getState().makeChoice(0);
    state = store.getState();
    expect(state.currentNodeId).toBe("CRISIS_PROTEST_01");
    expect(state.currentDay).toBe(3);
    expect(state.dayQueueNodeIds).toEqual(["CRISIS_PROTEST_01"]);
    expect(state.dayCompletedNodeIds).toContain("CRISIS_GATE_01");

    // Day 3 -> Day 4 resets queue
    store.getState().makeChoice(0);
    state = store.getState();
    expect(state.currentNodeId).toBe("PHASE1_STABILIZE_01");
    expect(state.currentDay).toBe(4);
    expect(state.dayQueueNodeIds).toEqual(["PHASE1_STABILIZE_01"]);
    expect(state.dayCompletedNodeIds).toEqual([]);
  });
});
