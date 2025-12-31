import { bishopMove } from "./bishop";
import { rookMove } from "./rook";


export function queenMove(from, to, turn, board) {
  return rookMove(from, to, turn, board) || bishopMove(from, to, turn, board);
}
