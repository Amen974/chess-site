import { isSquareAttacked } from "./isSquareAttacked";



export function isKingInCheck(color, board) {
  let kingSquare = null;

  for (const square in board) {
    const piece = board[square];
    if (piece && piece.type === "king" && piece.color === color) {
      kingSquare = square;
      break;
    }
  }

  if (!kingSquare) return false;

  const enemyColor = color === "white" ? "black" : "white";
  return isSquareAttacked(kingSquare, enemyColor, board);
}
