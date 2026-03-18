
const positionCount: Record<string, number> = {};

export function resetRepetitionCount() {
  Object.keys(positionCount).forEach((k) => delete positionCount[k]);
}

export function getRepetitionResult(fen: string): boolean {
  const parts = fen.trim().split(" ");

  if (parts.length < 4) {
    throw new Error("Invalid FEN");
  }

  const [
    piecePlacement,
    activeColor,
    castlingAvailability,
    enPassantTarget,
  ] = parts;

  const key = [
    piecePlacement,
    activeColor,
    castlingAvailability,
    enPassantTarget,
  ].join(" ");

  positionCount[key] = (positionCount[key] || 0) + 1;

  if (positionCount[key] >= 3) {
    return true;
  }

  return false;
}
