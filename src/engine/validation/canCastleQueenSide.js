import { isKingInCheck } from "./isKingInCheck";
import { isSquareAttacked } from "./isSquareAttacked";

export function canCastleQueenSide(piece, from, to, board, castlingRights) {
  if (
    piece.type === "king" &&
    piece.color === "white" &&
    from === "e1" &&
    to === "c1" &&
    !isKingInCheck("white", board) &&
    castlingRights.white.queenSide &&
    !board["d1"] &&
    !board["c1"] &&
    !board["b1"] &&
    !isSquareAttacked('d1', 'black', board) &&
    !isSquareAttacked('c1', 'black', board)&&
    !isSquareAttacked('b1', 'black', board)
  ) {
    return true;
  }

  if (
    piece.type === "king" &&
    piece.color === "black" &&
    from === "e8" &&
    to === "c8" &&
    !isKingInCheck("black", board) &&
    castlingRights.black.kingSide &&
    !board["d8"] &&
    !board["c8"] &&
    !board["b8"] &&
    !isSquareAttacked('d8', 'white', board) &&
    !isSquareAttacked('c8', 'white', board) &&
    !isSquareAttacked('b8', 'white', board)
  ) {
    return true;
  }

  return false;
}
