import { files, ranks } from "../constant";
import { PIECE_VALUE } from "../constant/PIECE_VALUE";
import { FENData, Piece, PieceType } from "../types";

export function importFEN(fen: string): FENData {
  const parts = fen.trim().split(" ");

  if (parts.length < 4) {
    throw new Error("Invalid FEN");
  }

  const [
    piecePlacement,
    activeColor,
    castlingAvailability,
    enPassantTarget,
    halfmoveClock = "0",
    fullmoveNumber = "1",
  ] = parts;

  /* ================= PIECE MAP ================= */
  const charToPiece: Record<string, PieceType> = {
    p: "pawn",
    n: "knight",
    b: "bishop",
    r: "rook",
    q: "queen",
    k: "king",
  };

  /* ================= BOARD ================= */
  const board: Record<string, Piece | null> = {};
  let fileIndex = 0;
  let rankIndex = 0;

  for (let i = 0; i < piecePlacement.length; i++) {
    const char = piecePlacement[i];

    if (char === "/") {
      rankIndex++;
      fileIndex = 0;
      continue;
    }

    if (char >= "1" && char <= "8") {
      fileIndex += Number(char);
      continue;
    }

    const lower = char.toLowerCase();
    if (!(lower in charToPiece)) {
      throw new Error("Invalid piece character in FEN");
    }

    const square = files[fileIndex] + ranks[rankIndex];

    board[square] = {
      type: charToPiece[lower],
      color: char === lower ? "black" : "white",
      img: `/pieces-basic-svg/${charToPiece[lower]}-${char === lower ? "b" : "w"}.svg`,
      value: PIECE_VALUE[charToPiece[lower]],
    };

    fileIndex++;
  }

  for (const r of ranks) {
    for (const f of files) {
      const sq = f + r;
      if (!(sq in board)) {
        board[sq] = null;
      }
    }
  }

  /* ================= TURN ================= */
  const turn = activeColor === "w" ? "white" : "black";

  /* ================= CASTLING ================= */
  const castlingRights = {
    white: { kingSide: false, queenSide: false },
    black: { kingSide: false, queenSide: false },
  };

  if (castlingAvailability !== "-") {
    for (const c of castlingAvailability) {
      if (c === "K") castlingRights.white.kingSide = true;
      if (c === "Q") castlingRights.white.queenSide = true;
      if (c === "k") castlingRights.black.kingSide = true;
      if (c === "q") castlingRights.black.queenSide = true;
    }
  }

  /* ================= EN PASSANT ================= */
  const enPassantSquare =
    enPassantTarget === "-" ? null : enPassantTarget;

  /* ================= CLOCKS ================= */
  const halfmoveClock_ = Number(halfmoveClock);
  const fullmoveNumber_ = Number(fullmoveNumber);

  /* ================= RETURN ================= */
  return {
    board,
    turn,
    castlingRights,
    enPassantSquare,
    halfmoveClock: Number(halfmoveClock),
    fullmoveNumber: Number(fullmoveNumber),
  };
}
