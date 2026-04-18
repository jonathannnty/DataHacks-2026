import { motion } from "framer-motion";
import {
  METRIC_NAMES,
  type MetricName,
  type Metrics,
} from "../../game/simulation/metrics";

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

const METRIC_ICON: Record<MetricName, string> = {
  Treasury: "$",
  EcoHealth: "🌿",
  PublicSentiment: "🙂",
  InfrastructureLoad: "⚙",
  SocialEquity: "⚖",
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

export function HeadsUpDisplay({ metrics }: HeadsUpDisplayProps) {
  return (
    <section
      aria-label="Heads Up Display"
      className="grid grid-cols-2 gap-2 sm:grid-cols-5 rounded-lg bg-white/70 backdrop-blur p-3 ring-1 ring-slate-200 shadow-sm"
    >
      {METRIC_NAMES.map((name) => {
        const value = metrics[name];
        return (
          <div key={name} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-civic-slate">
              <span>
                <span className="mr-1">{METRIC_ICON[name]}</span>
                {METRIC_LABELS[name]}
              </span>
              <span className="tabular-nums text-civic-slateDark">
                {Math.round(value)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                className={`h-full ${barColor(name, value)}`}
                initial={false}
                animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
