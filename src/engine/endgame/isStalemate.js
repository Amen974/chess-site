import { files, ranks } from "../../constant";
import { isKingInCheck } from "../validation/isKingInCheck";
import { isLegalMove } from "../validation/isLegalMove";


export function isStalemate(color, board) {
  if (isKingInCheck(color, board)) return false;

  for (const from in board) {
    const piece = board[from];
    if (!piece || piece.color !== color) continue;

    for (const file of files) {
      for (const rank of ranks) {
        const to = `${file}${rank}`;
        if (from === to) continue;

        if (isLegalMove(from, to, board, color)) {
          return false;
        }
      }
    }
  }

  return true;
}
