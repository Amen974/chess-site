import { isKingInCheck } from "./IsKingInCheck";
import { isLegalMove } from "./IsLegalMove";

export function isCheckmate(color, board) {
  if (!isKingInCheck(color, board)) return false;

  for (const from in board) {
    const piece = board[from];
    if (!piece || piece.color !== color) continue;

    for (const to in board) {
      if (from === to) continue;

      if (isLegalMove(from, to, board, color)) {
        return false;
      }
    }
  }

  return true;
}