import { describe, expect, it } from "vitest";
import {
  applyMetricModifiers,
  createDefaultMetrics,
} from "../../src/game/simulation/metrics";

describe("metrics", () => {
  it("clamps metric updates to the valid range", () => {
    const nextMetrics = applyMetricModifiers(createDefaultMetrics(), {
      Treasury: 100,
      EcoHealth: -100,
    });

    expect(nextMetrics.Treasury).toBe(100);
    expect(nextMetrics.EcoHealth).toBe(0);
  });
});
