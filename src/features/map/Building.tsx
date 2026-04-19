export type BuildingProps = {
  assetId: string;
  label?: string;
  tone?: "default" | "danger" | "success" | "warning";
};

const toneToBg: Record<NonNullable<BuildingProps["tone"]>, string> = {
  default: "bg-paper-50 text-ink-900 border-oak-500/80",
  danger: "bg-red-100 text-red-900 border-red-700 animate-shake",
  success: "bg-emerald-50 text-emerald-900 border-emerald-700",
  warning: "bg-amber-100 text-amber-900 border-amber-700",
};

export function Building({ assetId, label, tone = "default" }: BuildingProps) {
  return (
    <div
      data-building-asset-id={assetId}
      className={`whitespace-nowrap rounded-[5px] border-[1.5px] px-2 py-[3px] font-sans text-[9px] font-extrabold uppercase tracking-[0.08em] ${toneToBg[tone]}`}
      style={{
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.35) inset, 0 3px 6px rgba(0,0,0,0.4)",
      }}
    >
      {label ?? assetId}
    </div>
  );
}
