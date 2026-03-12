import { getRepetitionResult } from "./getRepetitionResult";
import { isCheckmate } from "./isCheckmate";
import { isInsufficientMaterial } from "./isInsufficientMaterial";
import { isStalemate } from "./isStalemate";


export function evaluateGameEnd(turn, enemy, board, halfmoveClock, fen, enPassantSquare, resign, aiTurn, castlingRights) {

  if (isCheckmate(enemy, board, enPassantSquare, castlingRights)) {
    return { result: "checkmate", winner: turn, reason: "checkmate" };
  }

  if (isStalemate(enemy, board, enPassantSquare, castlingRights)) {
    return { result: "draw", reason: "stalemate" };
  }

  if (isInsufficientMaterial(board)) {
    return { result: "draw", reason: "insufficient material" };
  }

  if (halfmoveClock >= 100) {
    return { result: "draw", reason: "50-move rule" };
  }

  if (getRepetitionResult(fen)) {
    return { result: "draw", reason: "threefold repetition" }
  }

  if (resign) {
    return { result: "win", winner: aiTurn, reason: "Resign" };
  }

  return null;
}
