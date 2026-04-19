import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  METRIC_NAMES,
  type MetricName,
  type Metrics,
} from "../../game/simulation/metrics";
import { MetricIcon } from "./MetricIcon";

export type HeadsUpDisplayProps = {
  metrics: Metrics;
};

const METRIC_LABELS: Record<MetricName, string> = {
  Treasury: "Treasury",
  EcoHealth: "Eco-Health",
  PublicSentiment: "Public Sentiment",
  InfrastructureLoad: "Infra-Load",
  SocialEquity: "Social Equity",
};

function barColor(name: MetricName, value: number): string {
  // Infra-Load is inverted: low = good.
  const isInverted = name === "InfrastructureLoad";
  const normalized = isInverted ? 100 - value : value;
  if (normalized < 25) return "bg-civic-danger";
  if (normalized < 50) return "bg-civic-warning";
  if (normalized < 75) return "bg-civic-emerald";
  return "bg-civic-emeraldDark";
}

// Track the previous metrics snapshot so we can surface a signed delta
// indicator (▲/▼) the moment a value changes after a decision.
function useMetricDeltas(
  metrics: Metrics,
): Partial<Record<MetricName, number>> {
  const prev = useRef<Metrics | null>(null);
  const [deltas, setDeltas] = useState<Partial<Record<MetricName, number>>>({});
  useEffect(() => {
    if (prev.current) {
      const next: Partial<Record<MetricName, number>> = {};
      for (const name of METRIC_NAMES) {
        const d = Math.round(metrics[name] - prev.current[name]);
        if (d !== 0) next[name] = d;
      }
      setDeltas(next);
      if (Object.keys(next).length > 0) {
        const t = window.setTimeout(() => setDeltas({}), 1800);
        prev.current = metrics;
        return () => window.clearTimeout(t);
      }
    }
    prev.current = metrics;
  }, [metrics]);
  return deltas;
}

export function HeadsUpDisplay({ metrics }: HeadsUpDisplayProps) {
  const deltas = useMetricDeltas(metrics);
  return (
    <section
      aria-label="Heads Up Display"
      className="hud-panel grid grid-cols-2 gap-3 rounded-[10px] border border-oak-700/20 bg-white/82 p-3.5 backdrop-blur-[6px] sm:grid-cols-5"
      style={{
        boxShadow:
          "0 1px 0 rgba(0,0,0,0.05), 0 10px 24px -12px rgba(59,42,26,0.4)",
      }}
    >
      {METRIC_NAMES.map((name) => {
        const value = metrics[name];
        const delta = deltas[name];
        return (
          <div key={name} className="hud-metric flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-[0.12em] text-civic-slate">
              <span className="flex items-center gap-1.5 font-sans">
                <MetricIcon
                  name={name}
                  className="h-3.5 w-3.5 text-oak-700"
                  aria-hidden="true"
                />
                {METRIC_LABELS[name]}
              </span>
              <span className="font-mono tabular-nums text-[10.5px] font-medium text-civic-slateDark">
                {Math.round(value)}
                {delta !== undefined && delta !== 0 ? (
                  <motion.span
                    key={`${name}-${delta}`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`ml-1 text-[10px] ${
                      delta > 0 ? "text-civic-emeraldDark" : "text-civic-danger"
                    }`}
                  >
                    {delta > 0 ? "▲" : "▼"}
                    {Math.abs(delta)}
                  </motion.span>
                ) : null}
              </span>
            </div>
            <div className="hud-bar h-3 overflow-hidden rounded-[2px] bg-[#e7e1cf]">
              <motion.div
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                className={`hud-fill h-full ${barColor(name, value)}`}
                initial={false}
                animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
            <div className="hud-ticks">
              <span>0</span>
              <span>20</span>
              <span>40</span>
              <span>60</span>
              <span>80</span>
              <span>100</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
