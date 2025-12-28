import { getMaterial } from "./getMaterial";
import { isLightSquare } from "./isLightSquare";

export function isInsufficientMaterial(board) {
  const material = getMaterial(board);
  if (!material) return false;

  const w = material.white;
  const b = material.black;

  // King vs King
  if (
    w.pawns === 0 && b.pawns === 0 &&
    w.knights === 0 && b.knights === 0 &&
    w.bishops.length === 0 && b.bishops.length === 0
  ) return true;

  // King + minor vs King
  if (
    w.pawns === 0 && b.pawns === 0 &&
    ((w.knights + w.bishops.length === 1 && b.knights + b.bishops.length === 0) ||
     (b.knights + b.bishops.length === 1 && w.knights + w.bishops.length === 0))
  ) return true;

  // King + bishop vs King + bishop (same color)
  if (
    w.pawns === 0 && b.pawns === 0 &&
    w.knights === 0 && b.knights === 0 &&
    w.bishops.length === 1 && b.bishops.length === 1
  ) {
    const wColor = isLightSquare(w.bishops[0]);
    const bColor = isLightSquare(b.bishops[0]);
    return wColor === bColor;
  }

  return false;
}
