export function updateCastlingRights(fromSquare, piece, setCastlingRights) {
  if (piece.type === "king") {
    setCastlingRights(prev => ({
      ...prev,
      [piece.color]: {
        kingSide: false,
        queenSide: false,
      },
    }));
    return;
  }

  if (piece.type === "rook") {
    setCastlingRights(prev => {
      const next = { ...prev };

      if (piece.color === "white") {
        if (fromSquare === "h1") next.white.kingSide = false;
        if (fromSquare === "a1") next.white.queenSide = false;
      }

      if (piece.color === "black") {
        if (fromSquare === "h8") next.black.kingSide = false;
        if (fromSquare === "a8") next.black.queenSide = false;
      }

      return next;
    });
  }
}