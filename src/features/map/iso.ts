export const TILE_WIDTH = 128;
export const TILE_HEIGHT = 64;
export const GRID_SIZE = 9;

export type GridCoord = { x: number; y: number };

/**
 * Project a grid coordinate (x, y) into 2D isometric screen space (px).
 *
 * The CSS transform on .iso-grid also rotates the board, but for citizen
 * movement we compute positions relative to the grid's local space so the
 * same transform applies to blobs as tiles.
 */
export function gridToIso({ x, y }: GridCoord): { left: number; top: number } {
  return {
    left: x * TILE_WIDTH,
    top: y * TILE_HEIGHT,
  };
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function interpolateCoord(
  from: GridCoord,
  to: GridCoord,
  t: number,
): GridCoord {
  return { x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t) };
}

export function randomGridCoord(size = GRID_SIZE): GridCoord {
  return {
    x: Math.floor(Math.random() * size),
    y: Math.floor(Math.random() * size),
  };
}
