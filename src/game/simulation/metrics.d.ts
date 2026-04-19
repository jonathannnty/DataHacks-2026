export type MetricName = "Treasury" | "EcoHealth" | "PublicSentiment" | "InfrastructureLoad" | "SocialEquity";
export type Metrics = Record<MetricName, number>;
export declare const METRIC_NAMES: MetricName[];
export declare const DEFAULT_METRIC_MIN = 0;
export declare const DEFAULT_METRIC_MAX = 100;
export declare function clampMetricValue(value: number, min?: number, max?: number): number;
export declare function createDefaultMetrics(): Metrics;
export declare function applyMetricModifiers(metrics: Metrics, modifiers: Partial<Metrics>): Metrics;
