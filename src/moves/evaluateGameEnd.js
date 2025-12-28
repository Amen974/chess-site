import { isCheckmate } from "./IsCheckmate";
import { isFiftyMoveDraw } from "./isFiftyMoveDraw";
import { isInsufficientMaterial } from "./isInsufficientMaterial";
import { isStalemate } from "./IsStalemate";

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

  if (isFiftyMoveDraw(halfmoveClock)) {
    return { result: "draw", reason: "50-move rule" };
  }

  return null;
}
