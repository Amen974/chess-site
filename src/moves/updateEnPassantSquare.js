export function updateEnPassantSquare(
  from,
  to,
  piece,
  setEnPassantSquare
) {
  if (piece.type !== "pawn") {
    setEnPassantSquare(null);
    return;
  }

  const fromRank = Number(from[1]);
  const toRank = Number(to[1]);

  if (piece.color === "white" && fromRank === 2 && toRank === 4) {
    setEnPassantSquare(from[0] + "3");
    return;
  }

  if (piece.color === "black" && fromRank === 7 && toRank === 5) {
    setEnPassantSquare(from[0] + "6");
    return;
  }

  setEnPassantSquare(null);
}
