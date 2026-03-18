import { CastlingRights, Move, Piece } from "../types";

export function undoMove({
  board,
  lastMove,
  castlingRights,
  enPassantSquare,
  halfmoveClock,
  fullmoveNumber,
}: {
  board: Record<string, Piece | null>;
  lastMove: Move;
  castlingRights: CastlingRights;
  enPassantSquare: string | null
  halfmoveClock: number
  fullmoveNumber: number
}) {
  if (!lastMove) return null;
  if (!lastMove.piece) return null;

  const newBoard = { ...board };

  /* ===== NORMAL UNDO ===== */
  newBoard[lastMove.from] = lastMove.piece;
  newBoard[lastMove.to] = lastMove.captured ?? null;

  /* ===== EN PASSANT ===== */
  if (lastMove.special === "en-passant") {
    newBoard[lastMove.to] = null;
    const dir = lastMove.piece.color === "white" ? -1 : 1;
    const capturedSquare =
      lastMove.to[0] + (Number(lastMove.to[1]) + dir);
    newBoard[capturedSquare] = lastMove.captured;
  }

  /* ===== CASTLING ===== */
  if (lastMove.special === "castle-king") {
    if (lastMove.piece.color === "white") {

      newBoard.h1 = newBoard.f1;
      newBoard.f1 = null;
    } else {
      newBoard.h8 = newBoard.f8;
      newBoard.f8 = null;
    }
  }

  if (lastMove.special === "castle-queen") {
    if (lastMove.piece.color === "white") {
      newBoard.a1 = newBoard.d1;
      newBoard.d1 = null;
    } else {
      newBoard.a8 = newBoard.d8;
      newBoard.d8 = null;
    }
  }

  /* ===== PROMOTION ===== */
  if (lastMove.promotion) {
    newBoard[lastMove.from] = {
      type: "pawn",
      color: lastMove.piece.color,
      img: `/pieces-basic-svg/pawn-${lastMove.piece.color[0]}.svg`,
      value: lastMove.piece.value,
    };
    newBoard[lastMove.to] = lastMove.captured ?? null;
  }

  return {
    board: newBoard,
    turn: lastMove.piece.color,
    castlingRights: lastMove.prevCastlingRights,
    enPassantSquare: lastMove.prevEnPassantSquare,
    halfmoveClock: lastMove.prevHalfmoveClock,
    fullmoveNumber: lastMove.prevFullmoveNumber
  };
}
