import { files, ranks } from "../../constant";
import { CastlingRights, Color, Piece } from "../../types";
import { isKingInCheck } from "../validation/isKingInCheck";
import { isLegalMove } from "../validation/isLegalMove";

export function isStalemate(
  color: Color,
  board: Record<string, Piece | null>,
  enPassantSquare: string | null,
  castlingRights: CastlingRights,
): boolean {
  if (isKingInCheck(color, board, castlingRights)) return false;

  for (const from in board) {
    const piece = board[from];
    if (!piece || piece.color !== color) continue;

    for (const file of files) {
      for (const rank of ranks) {
        const to = `${file}${rank}`;
        if (from === to) continue;

        if (
          isLegalMove(from, to, board, color, enPassantSquare, castlingRights)
        ) {
          return false;
        }
      }
    }
  }

  return true;
}
