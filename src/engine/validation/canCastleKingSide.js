import { isKingInCheck } from "./isKingInCheck";
import { isSquareAttacked } from "./isSquareAttacked";

export function canCastleKingSide(piece, from, to, board, castlingRights) {
  if (
    piece.type === "king" &&
    piece.color === "white" &&
    from === "e1" &&
    to === "g1" &&
    !isKingInCheck("white", board, castlingRights) &&
    castlingRights.white.kingSide &&
    !board["f1"] &&
    !board["g1"] &&
    !isSquareAttacked('f1', 'black', board, castlingRights) &&
    !isSquareAttacked('g1', 'black', board, castlingRights)
  ) {
    return true;
  }

  if (
    piece.type === "king" &&
    piece.color === "black" &&
    from === "e8" &&
    to === "g8" &&
    !isKingInCheck("black", board, castlingRights) &&
    castlingRights.black.kingSide &&
    !board["f8"] &&
    !board["g8"] &&
    !isSquareAttacked('f8', 'white', board, castlingRights) &&
    !isSquareAttacked('g8', 'white', board, castlingRights)
  ) {
    return true;
  }

  return false;
}
