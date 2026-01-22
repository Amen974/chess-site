export function updateEnPassantSquare(from, to, piece, board) {
  if (piece.type !== "pawn") return null;

  const fromRank = Number(from[1]);
  const toRank = Number(to[1]);
  const file = from[0];

  // White pawn double move
  if (piece.color === "white" && fromRank === 2 && toRank === 4) {
    const left = String.fromCharCode(file.charCodeAt(0) - 1) + "4";
    const right = String.fromCharCode(file.charCodeAt(0) + 1) + "4";

    if (
      (board[left]?.type === "pawn" && board[left]?.color === "black") ||
      (board[right]?.type === "pawn" && board[right]?.color === "black")
    ) {
      return file + "3";
    }
  }

  // Black pawn double move
  if (piece.color === "black" && fromRank === 7 && toRank === 5) {
    const left = String.fromCharCode(file.charCodeAt(0) - 1) + "5";
    const right = String.fromCharCode(file.charCodeAt(0) + 1) + "5";

    if (
      (board[left]?.type === "pawn" && board[left]?.color === "white") ||
      (board[right]?.type === "pawn" && board[right]?.color === "white")
    ) {
      return file + "6";
    }
  }

  return null;
}
