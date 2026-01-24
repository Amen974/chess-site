import { isCheckmate } from "./endgame/isCheckmate";
import { isKingInCheck } from "./validation/isKingInCheck";
import { isLegalMove } from "./validation/isLegalMove";

export function generateSAN(
  from,
  to,
  piece,
  board,
  turn,
  promotion,
  enPassantSquare
) {
  const enemyColor = turn === "white" ? "black" : "white";

  const pieceMap = {
    pawn: "",
    knight: "N",
    bishop: "B",
    rook: "R",
    queen: "Q",
    king: "K",
  };

  let pieceLetter = pieceMap[piece.type];
  let disambiguation = "";
  let capture = "";
  let promotionSuffix = "";
  let checkSuffix = "";

  if (piece.type !== "pawn" && piece.type !== "king") {
    let sameFile = false;
    let sameRank = false;

    for (const square in board) {
      if (square === from) continue;

      const other = board[square];
      if (!other) continue;
      if (other.type !== piece.type) continue;
      if (other.color !== piece.color) continue;

      if (isLegalMove(square, to, board, turn, enPassantSquare)) {
        if (square[0] === from[0]) sameFile = true;
        if (square[1] === from[1]) sameRank = true;
      }
    }

    if (sameFile && !sameRank) disambiguation = from[1];
    else if (!sameFile && sameRank) disambiguation = from[0];
    else if (sameFile && sameRank) disambiguation = from;
  }

  if (board[to]) {
    capture = "x";
    if (piece.type === "pawn") {
      pieceLetter = from[0];
    }
  }

  if (promotion) {
    promotionSuffix = "=" + pieceMap[promotion.type];
  }

  const newBoard = { ...board };
  newBoard[to] = piece;
  newBoard[from] = null;

  if (isCheckmate(enemyColor, newBoard, enPassantSquare)) checkSuffix = "#";
  else if (isKingInCheck(enemyColor, newBoard)) checkSuffix = "+";

  return (
    pieceLetter +
    disambiguation +
    capture +
    to +
    promotionSuffix +
    checkSuffix
  );
}
