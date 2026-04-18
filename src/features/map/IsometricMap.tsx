import { GridMap } from "./GridMap";
import { Tile, type TileKind } from "./Tile";
import { Building } from "./Building";
import { CitizenBlob } from "./CitizenBlob";
import { GRID_SIZE } from "./iso";
import type { MapStateEntry } from "../../game/state/gameStore";

export type IsometricMapProps = {
  mapState: Record<string, MapStateEntry>;
  publicSentiment: number;
  infraLoad: number;
  ecoHealth: number;
};

type BuildingSpec = {
  key: string;
  x: number;
  y: number;
  defaultAsset: string;
  label: string;
};

const BUILDINGS: BuildingSpec[] = [
  { key: "city_hall", x: 4, y: 4, defaultAsset: "city_hall_v1", label: "City Hall" },
  { key: "landfill", x: 8, y: 1, defaultAsset: "landfill_empty_v1", label: "Landfill" },
  { key: "recycling_center", x: 1, y: 7, defaultAsset: "recycling_center_v1", label: "MRF" },
  { key: "industrial_zone", x: 7, y: 7, defaultAsset: "industrial_zone_v1", label: "Industrial" },
  { key: "park_zone", x: 2, y: 2, defaultAsset: "park_zone_v1", label: "Park" },
  { key: "residential", x: 5, y: 1, defaultAsset: "residential_v1", label: "Residential" },
  { key: "road_network", x: 4, y: 6, defaultAsset: "paved_road_v1", label: "Main Road" },
];

function tileKindFor(
  x: number,
  y: number,
  ecoHealth: number,
): TileKind {
  const polluted = ecoHealth < 35;
  if (x === 4 && y >= 0 && y <= 9) return polluted ? "littered_road" : "paved_road";
  if (y === 4 && x >= 0 && x <= 9) return polluted ? "littered_road" : "paved_road";
  if (x === 0 || x === 9) return polluted ? "toxic_water" : "clean_water";
  return polluted ? "polluted_grass" : "clean_grass";
}

function toneFor(key: string, infraLoad: number, ecoHealth: number) {
  if (key === "landfill" && infraLoad > 80) return "danger" as const;
  if (key === "landfill" && infraLoad > 65) return "warning" as const;
  if (key === "recycling_center" && ecoHealth > 65) return "success" as const;
  return "default" as const;
}

export function IsometricMap({
  mapState,
  publicSentiment,
  infraLoad,
  ecoHealth,
}: IsometricMapProps) {
  const tiles: React.ReactNode[] = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      tiles.push(
        <Tile
          key={`t-${x}-${y}`}
          x={x}
          y={y}
          kind={tileKindFor(x, y, ecoHealth)}
        />,
      );
    }
  }

  return (
    <div className="iso-scene flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/90 p-4 ring-1 ring-slate-700 shadow-inner min-h-[420px]">
      <GridMap>
        {tiles}
        {BUILDINGS.map((b) => {
          const override = mapState[b.key];
          const assetId = override?.assetId ?? b.defaultAsset;
          return (
            <Tile key={`b-${b.key}`} x={b.x} y={b.y} kind="paved_road">
              <Building
                assetId={assetId}
                label={b.label}
                tone={toneFor(b.key, infraLoad, ecoHealth)}
              />
            </Tile>
          );
        })}
        {Array.from({ length: 6 }).map((_, i) => (
          <CitizenBlob
            key={`c-${i}`}
            seed={i}
            publicSentiment={publicSentiment}
          />
        ))}
      </GridMap>
    </div>
  );
}
