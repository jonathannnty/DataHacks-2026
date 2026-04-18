import { gridToIso, TILE_HEIGHT, TILE_WIDTH } from "./iso";

export type TileKind =
  | "clean_grass"
  | "polluted_grass"
  | "clean_water"
  | "toxic_water"
  | "paved_road"
  | "littered_road";

export type TileProps = {
  kind: TileKind;
  x: number;
  y: number;
  children?: React.ReactNode;
};

const kindToClass: Record<TileKind, string> = {
  clean_grass:
    "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 ring-emerald-700/40",
  polluted_grass:
    "bg-gradient-to-br from-yellow-700 via-amber-700 to-stone-700 ring-stone-900/50",
  clean_water:
    "bg-gradient-to-br from-sky-300 via-sky-400 to-sky-600 ring-sky-700/40",
  toxic_water:
    "bg-gradient-to-br from-lime-500 via-emerald-800 to-stone-900 ring-lime-900/60",
  paved_road:
    "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 ring-slate-700/40",
  littered_road:
    "bg-gradient-to-br from-amber-700 via-stone-600 to-slate-700 ring-stone-900/50",
};

export function Tile({ kind, x, y, children }: TileProps) {
  const { left, top } = gridToIso({ x, y });
  return (
    <div
      data-tile-kind={kind}
      className="iso-tile"
      style={{
        left,
        top,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
      }}
    >
      <div
        className={`absolute inset-0 rounded-sm ring-1 shadow-[0_2px_0_rgba(0,0,0,0.2)] ${kindToClass[kind]}`}
      />
      {children ? (
        <div className="iso-tile-inner absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      ) : null}
    </div>
  );
}
