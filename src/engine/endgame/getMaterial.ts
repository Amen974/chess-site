import { Material, Piece } from "../../types";

export function getMaterial(
  board: Record<string, Piece | null>,
): Material | null {
  const material = {
    white: { pawns: 0, bishops: [] as string[], knights: 0 },
    black: { pawns: 0, bishops: [] as string[], knights: 0 },
  };

  for (const square in board) {
    const piece = board[square];
    if (!piece) continue;

    const side = material[piece.color];

    if (piece.type === "pawn") side.pawns++;
    if (piece.type === "knight") side.knights++;
    if (piece.type === "bishop") side.bishops.push(square);
    if (piece.type === "rook" || piece.type === "queen") return null;
  }

  return material;
}
