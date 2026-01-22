export function updateCastlingRights(castlingRights, fromSquare, piece) {
  const next = structuredClone(castlingRights);
  const color = piece.color;

  if (piece.type === "king") {
    next[color].kingSide = false;
    next[color].queenSide = false;
    return next;
  }

  if (piece.type === "rook") {
    if (color === "white") {
      if (fromSquare === "h1") next.white.kingSide = false;
      if (fromSquare === "a1") next.white.queenSide = false;
    }

    if (color === "black") {
      if (fromSquare === "h8") next.black.kingSide = false;
      if (fromSquare === "a8") next.black.queenSide = false;
    }

    return next;
  }

  return next;
}
