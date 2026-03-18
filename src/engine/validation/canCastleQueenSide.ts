import { CastlingRights, Piece } from "../../types";
import { isKingInCheck } from "./isKingInCheck";
import { isSquareAttacked } from "./isSquareAttacked";

export function canCastleQueenSide(
  piece: Piece,
  from: string,
  to: string,
  board: Record<string, Piece | null>,
  castlingRights: CastlingRights,
): boolean {
  if (
    piece.type === "king" &&
    piece.color === "white" &&
    from === "e1" &&
    to === "c1" &&
    !isKingInCheck("white", board, castlingRights) &&
    castlingRights.white.queenSide &&
    !board["d1"] &&
    !board["c1"] &&
    !board["b1"] &&
    !isSquareAttacked("d1", "black", board, castlingRights) &&
    !isSquareAttacked("c1", "black", board, castlingRights) &&
    !isSquareAttacked("b1", "black", board, castlingRights)
  ) {
    return true;
  }

  if (
    piece.type === "king" &&
    piece.color === "black" &&
    from === "e8" &&
    to === "c8" &&
    !isKingInCheck("black", board, castlingRights) &&
    castlingRights.black.kingSide &&
    !board["d8"] &&
    !board["c8"] &&
    !board["b8"] &&
    !isSquareAttacked("d8", "white", board, castlingRights) &&
    !isSquareAttacked("c8", "white", board, castlingRights) &&
    !isSquareAttacked("b8", "white", board, castlingRights)
  ) {
    return true;
  }

  return false;
}
