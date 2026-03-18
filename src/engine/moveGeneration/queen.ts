import { Color, Piece } from "../../types";
import { bishopMove } from "./bishop";
import { rookMove } from "./rook";

export function queenMove(
  from: string,
  to: string,
  turn: Color,
  board: Record<string, Piece | null>,
): boolean {
  return rookMove(from, to, turn, board) || bishopMove(from, to, turn, board);
}
