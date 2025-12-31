export function updateHalfmoveClock(
  from,
  to,
  piece,
  boardBefore,
  setHalfmoveClock
) {
  const isPawnMove = piece.type === "pawn";
  const isCapture = boardBefore[to] !== null;

  if (isPawnMove || isCapture) {
    setHalfmoveClock(0);
  } else {
    setHalfmoveClock((prev) => prev + 1);
  }
}