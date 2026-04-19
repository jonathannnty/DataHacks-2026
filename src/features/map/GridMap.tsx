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
      style={{
        width,
        height,
        transform:
          "translateY(-34px) rotateX(60deg) rotateZ(-45deg) scale(0.84)",
        transformOrigin: "50% 44%",
      }}
      data-testid="grid-map"
    >
      {children}
    </div>
  );
}
