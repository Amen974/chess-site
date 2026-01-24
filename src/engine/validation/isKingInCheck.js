import { isSquareAttacked } from "./isSquareAttacked";

export function isKingInCheck(turn, board) {
  let kingSquare = null;

  for (const square in board) {
    const piece = board[square];
    if (piece && piece.type === "king" && piece.color === turn) {
      kingSquare = square;
      break;
    }
  }

  if (!kingSquare) return false;

  const enemyColor = turn === "white" ? "black" : "white";
  return isSquareAttacked(kingSquare, enemyColor, board);
}
