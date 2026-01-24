export function updateHalfmoveClock(
  previousHalfmoveClock,
  piece,
  capturedPiece
) {
  if (piece.type === "pawn" || capturedPiece !== null) {
    return 0;
  }

  return previousHalfmoveClock + 1;
}
