import { Color } from "../../types";

export function updateFullmoveNumber(
  previousFullmoveNumber: number,
  turn: Color,
): number {
  return turn === "black" ? previousFullmoveNumber + 1 : previousFullmoveNumber;
}
