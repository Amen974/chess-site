import { Piece } from "../../types";

export function updateHalfmoveClock(
  previousHalfmoveClock: number,
  piece: Piece,
  capturedPiece: Piece | null,
): number {
  if (piece.type === "pawn" || capturedPiece !== null) {
    return 0;
  }

  return previousHalfmoveClock + 1;
}
