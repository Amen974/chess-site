export function updateFullmoveNumber(
  to,
  boardBefore,
  piece,
  setFullmoveNumber
){
  const isBlackMove = piece.color === "black";
  if (boardBefore[to] && isBlackMove) {
     setFullmoveNumber((prev) => prev + 1)
  }
}