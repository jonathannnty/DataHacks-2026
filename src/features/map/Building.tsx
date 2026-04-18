export type BuildingProps = {
  assetId: string;
  label?: string;
  tone?: "default" | "danger" | "success" | "warning";
};

const toneToBg: Record<NonNullable<BuildingProps["tone"]>, string> = {
  default: "bg-slate-100 text-slate-900 ring-slate-400",
  danger: "bg-red-200 text-red-900 ring-red-500 animate-shake",
  success: "bg-emerald-200 text-emerald-900 ring-emerald-500",
  warning: "bg-amber-200 text-amber-900 ring-amber-500",
};

export function Building({ assetId, label, tone = "default" }: BuildingProps) {
  return (
    <div
      data-building-asset-id={assetId}
      className={`rounded-md px-2 py-1 text-[10px] font-semibold leading-tight shadow ring-2 ${toneToBg[tone]}`}
    >
      {label ?? assetId}
    </div>
  );
}
