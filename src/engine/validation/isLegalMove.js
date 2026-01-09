import { bishopMove } from "../moveGeneration/bishop";
import { kingMove } from "../moveGeneration/king";
import { knightMove } from "../moveGeneration/knight";
import { pawnMove } from "../moveGeneration/pawn";
import { queenMove } from "../moveGeneration/queen";
import { rookMove } from "../moveGeneration/rook";
import { isKingInCheck } from "./isKingInCheck";


export function isLegalMove(from, to, board, turn, enPassantSquare) {
  const piece = board[from];
  if (!piece) return false;
  if (board[to] && board[to].color === turn) return false

  let valid = false;

  switch (piece.type) {
    case "pawn":
      valid = pawnMove(from, to, turn, board, enPassantSquare);
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
