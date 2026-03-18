import { CastlingRights, Color, Piece } from "../../types";
import { isSquareAttacked } from "./isSquareAttacked";

export function isKingInCheck(
  turn: Color,
  board: Record<string, Piece | null>,
  castlingRights: CastlingRights,
): boolean {
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
  return isSquareAttacked(kingSquare, enemyColor, board, castlingRights);
}
