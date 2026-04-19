import type { CSSProperties } from "react";

export type StampKind = "approved" | "denied" | "pending" | "catastrophe";

const LABELS: Record<StampKind, string> = {
  approved: "Approved",
  denied: "Denied",
  pending: "Pending",
  catastrophe: "Catastrophe",
};

export function Stamp({ kind }: { kind: StampKind }) {
  const label = LABELS[kind];
  const rotate = kind === "catastrophe" ? "rotate(5deg)" : "rotate(-6deg)";
  const style = {
    "--stamp-rotate": rotate,
  } as CSSProperties;
  return (
    <div
      aria-label={`${label} stamp`}
      className={`czar-stamp czar-stamp--${kind} absolute right-5 top-4 bg-white/40`}
      style={style}
    >
      {label}
    </div>
  );
}
