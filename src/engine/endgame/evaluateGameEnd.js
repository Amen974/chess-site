import { isCheckmate } from "./isCheckmate";
import { isInsufficientMaterial } from "./isInsufficientMaterial";
import { isStalemate } from "./isStalemate";


export function evaluateGameEnd(turn, board, halfmoveClock) {
  const enemy = turn === "white" ? "black" : "white";

  if (isCheckmate(enemy, board)) {
    return { result: "checkmate", winner: turn };
  }

  if (isStalemate(enemy, board)) {
    return { result: "stalemate" };
  }

  if (isInsufficientMaterial(board)) {
    return { result: "draw", reason: "insufficient material" };
  }

  if (halfmoveClock >= 100) {
    return { result: "draw", reason: "50-move rule" };
  }

  return null;
}
