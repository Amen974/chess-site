import { CastlingRights, Color, Piece } from "../../types";
import { canCastleKingSide } from "../validation/canCastleKingSide";
import { canCastleQueenSide } from "../validation/canCastleQueenSide";
import { isSquareAttacked } from "../validation/isSquareAttacked";

export function kingMove(
  from: string,
  to: string,
  turn: Color,
  board: Record<string, Piece | null>,
  castlingRights: CastlingRights,
): boolean {
  const fromFile = from[0];
  const fromRank = Number(from[1]);
  const toFile = to[0];
  const toRank = Number(to[1]);

  const fileDiff = Math.abs(toFile.charCodeAt(0) - fromFile.charCodeAt(0));
  const rankDiff = Math.abs(toRank - fromRank);

  const piece = board[from];
  
  if (!piece) return false;

  if (canCastleKingSide(piece, from, to, board, castlingRights)) {
    return true;
  }

  if (canCastleQueenSide(piece, from, to, board, castlingRights)) {
    return true;
  }

  if (fileDiff > 1 || rankDiff > 1) return false;
  if (fileDiff === 0 && rankDiff === 0) return false;

  const targetPiece = board[to];
  if (targetPiece && targetPiece.color === turn) return false;

  const enemyColor = turn === "white" ? "black" : "white";
  if (isSquareAttacked(to, enemyColor, board, castlingRights)) return false;

  return true;
}
