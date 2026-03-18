import { Piece } from "../../types";

export function isPromotionSquare(
  to: string,
  board: Record<string, Piece | null>,
): boolean {
  const toRank = Number(to[1]);
  const piece = board[to];

  if (!piece || piece.type !== "pawn") return false;

  if (piece.color === "white" && toRank === 8) return true;
  if (piece.color === "black" && toRank === 1) return true;

  return false;
}
