export function updateEnPassantSquare(
  from,
  to,
  piece,
  board,
  setEnPassantSquare
) {
  if (piece.type !== "pawn") {
    setEnPassantSquare(null);
    return;
  }

  const fromRank = Number(from[1]);
  const toRank = Number(to[1]);
  const file = from[0];

  if (piece.color === "white" && fromRank === 2 && toRank === 4) {
    const left = String.fromCharCode(file.charCodeAt(0) - 1) + "4";
    const right = String.fromCharCode(file.charCodeAt(0) + 1) + "4";

    if (
      board[left]?.type === "pawn" && board[left]?.color === "black" ||
      board[right]?.type === "pawn" && board[right]?.color === "black"
    ) {
      setEnPassantSquare(file + "3");
      return;
    }
  }

  if (piece.color === "black" && fromRank === 7 && toRank === 5) {
    const left = String.fromCharCode(file.charCodeAt(0) - 1) + "5";
    const right = String.fromCharCode(file.charCodeAt(0) + 1) + "5";

    if (
      board[left]?.type === "pawn" && board[left]?.color === "white" ||
      board[right]?.type === "pawn" && board[right]?.color === "white"
    ) {
      setEnPassantSquare(file + "6");
      return;
    }
  }

  setEnPassantSquare(null);
}
