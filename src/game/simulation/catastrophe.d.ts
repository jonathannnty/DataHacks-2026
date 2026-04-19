import type { Metrics } from "./metrics";
export type CatastropheKind = "LANDFILL_FIRE" | "MARKET_CRASH";
export declare const INFRA_LOAD_CATASTROPHE_THRESHOLD = 80;
export declare const MARKET_CRASH_PROBABILITY = 0.05;
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
export declare function rollCatastrophe({ metrics, random, }: CatastropheRollInput): CatastropheKind | null;
export declare function catastropheToNodeId(kind: CatastropheKind): string;
