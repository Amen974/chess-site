import { bishopMove } from "./BishopMove";
import { isKingInCheck } from "./IsKingInCheck";
import { kingMove } from "./KingMove";
import { knightMove } from "./KnightMove";
import { pawnMove } from "./PawnMove";
import { queenMove } from "./QueenMove";
import { rookMove } from "./RookMove";

export function isLegalMove(from, to, board, turn) {
  const piece = board[from];
  if (!piece) return false;

  let valid = false;

  switch (piece.type) {
    case "pawn":
      valid = pawnMove(from, to, turn, board);
      break;
    case "knight":
      valid = knightMove(from, to, turn, board);
      break;
    case "bishop":
      valid = bishopMove(from, to, turn, board);
      break;
    case "rook":
      valid = rookMove(from, to, turn, board);
      break;
    case "queen":
      valid = queenMove(from, to, turn, board);
      break;
    case "king":
      valid = kingMove(from, to, turn, board);
      break;
    default:
      return false;
  }

  if (!valid) return false;

  const newBoard = { ...board };
  newBoard[to] = piece;
  newBoard[from] = null;

  if (isKingInCheck(turn, newBoard)) return false;

  return true;
}
