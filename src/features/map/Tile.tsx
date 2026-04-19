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
  zOffset?: number;
  children?: React.ReactNode;
};

const kindToClass: Record<TileKind, string> = {
  clean_grass:
    "bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-700 ring-emerald-900/45",
  polluted_grass:
    "bg-gradient-to-br from-amber-600 via-amber-700 to-stone-800 ring-stone-900/55",
  clean_water:
    "bg-gradient-to-br from-cyan-300 via-sky-500 to-blue-700 ring-blue-900/45",
  toxic_water:
    "bg-gradient-to-br from-lime-600 via-emerald-900 to-stone-950 ring-lime-950/65",
  paved_road:
    "bg-gradient-to-br from-slate-300 via-slate-500 to-slate-700 ring-slate-900/50",
  littered_road:
    "bg-gradient-to-br from-amber-700 via-stone-700 to-slate-800 ring-stone-950/55",
};

export function Tile({ kind, x, y, zOffset = 0, children }: TileProps) {
  const { left, top } = gridToIso({ x, y });
  const depth = (x + y) * 100 + x + zOffset;
  return (
    <div
      data-tile-kind={kind}
      data-depth={depth}
      className="iso-tile"
      style={{
        left,
        top,
        zIndex: depth,
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
