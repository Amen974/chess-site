import { files, ranks } from "../constant";

export function exportFEN({
  board,
  turn,
  castlingRights,
  enPassantSquare,
  halfmoveClock,
  fullmoveNumber = 1,
}) {
  /* ================= PIECE MAP ================= */

  const pieceToChar = {
    pawn: "p",
    knight: "n",
    bishop: "b",
    rook: "r",
    queen: "q",
    king: "k",
  };

  /* ================= BOARD ================= */

  const boardParts = [];

  for (let r = 0; r <= ranks.length -1; r++) {
    let emptyCount = 0;
    let rankStr = "";

    for (let f = 0; f < files.length; f++) {
      const square = files[f] + ranks[r];
      const piece = board[square];

      if (!piece) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          rankStr += emptyCount;
          emptyCount = 0;
        }

        const char = pieceToChar[piece.type];
        rankStr += piece.color === "white" ? char.toUpperCase() : char;
      }
    }

    if (emptyCount > 0) {
      rankStr += emptyCount;
    }

    boardParts.push(rankStr);
  }

  const boardField = boardParts.join("/");

  /* ================= TURN ================= */

  const turnField = turn === "white" ? "w" : "b";

  /* ================= CASTLING ================= */

  let castlingField = "";

  if (castlingRights.white.kingSide) castlingField += "K";
  if (castlingRights.white.queenSide) castlingField += "Q";
  if (castlingRights.black.kingSide) castlingField += "k";
  if (castlingRights.black.queenSide) castlingField += "q";

  if (castlingField === "") castlingField = "-";

  /* ================= EN PASSANT ================= */

  const enPassantField = enPassantSquare ?? "-";

  /* ================= HALF / FULL MOVE ================= */

  const halfmoveField = String(halfmoveClock);
  const fullmoveField = String(fullmoveNumber);

  /* ================= FINAL FEN ================= */

  return [
    boardField,
    turnField,
    castlingField,
    enPassantField,
    halfmoveField,
    fullmoveField,
  ].join(" ");
}
