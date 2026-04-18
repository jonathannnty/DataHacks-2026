import type { ReactNode } from "react";
import { GRID_SIZE, TILE_HEIGHT, TILE_WIDTH } from "./iso";

export type GridMapProps = {
  children?: ReactNode;
};

export function GridMap({ children }: GridMapProps) {
  const width = GRID_SIZE * TILE_WIDTH;
  const height = GRID_SIZE * TILE_HEIGHT;
  return (
    <div
      className="iso-grid relative"
      style={{ width, height }}
      data-testid="grid-map"
    >
      {children}
    </div>
  );
}
