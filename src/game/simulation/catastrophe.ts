import type { Metrics } from "./metrics";

export type CatastropheKind = "LANDFILL_FIRE" | "MARKET_CRASH";

export const INFRA_LOAD_CATASTROPHE_THRESHOLD = 80;
export const MARKET_CRASH_PROBABILITY = 0.05;

export type CatastropheRollInput = {
  metrics: Metrics;
  random?: () => number;
};

/**
 * Pure, deterministic catastrophe evaluator.
 *
 * Why pure: exercised both client-side (optimistic next-node preview) and
 * server-side (authoritative resolution in Lambda). Passing `random` keeps
 * it seedable for tests and reproducible runs.
 */
export function rollCatastrophe({
  metrics,
  random = Math.random,
}: CatastropheRollInput): CatastropheKind | null {
  if (metrics.InfrastructureLoad > INFRA_LOAD_CATASTROPHE_THRESHOLD) {
    return "LANDFILL_FIRE";
  }

  if (random() < MARKET_CRASH_PROBABILITY) {
    return "MARKET_CRASH";
  }

  return null;
}

export function catastropheToNodeId(kind: CatastropheKind): string {
  return kind;
}
