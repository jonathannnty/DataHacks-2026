export type MetricName =
  | "Treasury"
  | "EcoHealth"
  | "PublicSentiment"
  | "InfrastructureLoad"
  | "SocialEquity";

export type Metrics = Record<MetricName, number>;

export const METRIC_NAMES: MetricName[] = [
  "Treasury",
  "EcoHealth",
  "PublicSentiment",
  "InfrastructureLoad",
  "SocialEquity",
];

export const DEFAULT_METRIC_MIN = 0;
export const DEFAULT_METRIC_MAX = 100;

export function clampMetricValue(
  value: number,
  min = DEFAULT_METRIC_MIN,
  max = DEFAULT_METRIC_MAX,
): number {
  return Math.min(max, Math.max(min, value));
}

export function createDefaultMetrics(): Metrics {
  return {
    Treasury: 50,
    EcoHealth: 50,
    PublicSentiment: 50,
    InfrastructureLoad: 50,
    SocialEquity: 50,
  };
}

export function applyMetricModifiers(
  metrics: Metrics,
  modifiers: Partial<Metrics>,
): Metrics {
  const nextMetrics: Metrics = { ...metrics };

  for (const metricName of METRIC_NAMES) {
    const modifier = modifiers[metricName] ?? 0;
    nextMetrics[metricName] = clampMetricValue(metrics[metricName] + modifier);
  }

  return nextMetrics;
}
