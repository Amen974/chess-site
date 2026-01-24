import { getRepetitionResult } from "./getRepetitionResult";
import { isCheckmate } from "./isCheckmate";
import { isInsufficientMaterial } from "./isInsufficientMaterial";
import { isStalemate } from "./isStalemate";


export function evaluateGameEnd(turn, enemy, board, halfmoveClock, fen) {

  if (isCheckmate(enemy, board)) {
    return { result: "checkmate", winner: turn };
  }

  if (isStalemate(enemy, board)) {
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

  return null;
}
