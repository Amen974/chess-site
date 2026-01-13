const positionCount = {};

export function getRepetitionResult(fen){
  const parts = fen.trim().split(" ");

   if (parts.length < 4) {
    throw new Error("Invalid FEN");
  }

  const [
    piecePlacement,
    activeColor,
    castlingAvailability,
    enPassantTarget,
    halfmoveClock = "0",
    fullmoveNumber = "1",
  ] = parts;

  const key = [piecePlacement, activeColor, castlingAvailability, enPassantTarget].join(" ")

  positionCount[key] = (positionCount[key] || 0) +1;

  if (positionCount[key] >= 3) {
    return true;
  }

  return false;
}