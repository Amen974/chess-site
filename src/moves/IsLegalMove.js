import { bishopMove } from "./BishopMove";
import { kingMove } from "./KingMove";
import { knightMove } from "./KnightMove";
import { pawnMove } from "./PawnMove";
import { queenMove } from "./QueenMove";
import { rookMove } from "./RookMove";

export function isLegalMove(from, to, board, turn) {
  const piece = board[from];
  if (!piece) return false;

  switch (piece.type) {
    case "pawn":
      return pawnMove(from, to, turn, board);
    case "knight":
      return knightMove(from, to, turn, board);
    case "bishop":
      return bishopMove(from, to, turn, board);
    case "rook":
      return rookMove(from, to, turn, board);
    case "queen":
      return queenMove(from, to, turn, board);
    case "king":
      return kingMove(from, to, turn, board);
    default:
      return false;
  }
}
