import { bishopMove } from "./BishopMove";
import { rookMove } from "./RookMove";

export function queenMove(from, to, turn, board) {
  return rookMove(from, to, turn, board) || bishopMove(from, to, turn, board);
}
