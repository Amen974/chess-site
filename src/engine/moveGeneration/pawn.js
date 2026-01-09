export function pawnMove(from, to, turn, board, enPassantSquare) {
  const fromFile = from[0];
  const fromRank = Number(from[1]);

  const toFile = to[0];
  const toRank = Number(to[1]);

  const targetPiece = board[to];

  const direction = turn === "white" ? 1 : -1;

  const startSquare = turn === "white" ? 2 : 7;

  const middleRank = fromRank + direction;
  const middlesquare = fromFile + middleRank;

  //one square
  if (fromFile === toFile && toRank === fromRank + direction && !targetPiece) {
    return true;
  }

  //2 square
  if (
    fromRank === startSquare &&
    fromFile === toFile &&
    toRank === fromRank + 2 * direction &&
    !board[middlesquare] &&
    !targetPiece
  ) {
    return true;
  }

  //capture
  if (
    Math.abs(toFile.charCodeAt(0) - fromFile.charCodeAt(0)) === 1 &&
    toRank === fromRank + direction &&
    targetPiece &&
    targetPiece.color !== turn
  ) {
    return true;
  }

  //en passant
  if (to === enPassantSquare) {
    const enPassantRank = turn === 'white' ? Number(enPassantSquare[1]) - 1 : Number(enPassantSquare[1]) + 1
    const enPassantRightFile = String.fromCharCode((enPassantSquare[0].charCodeAt(0) + 1))
    const enPassantLeftFile = String.fromCharCode((enPassantSquare[0].charCodeAt(0) - 1))
    if (fromRank === enPassantRank && (fromFile === enPassantRightFile || fromFile === enPassantLeftFile)) {
      return true;
    }
  }

  return false;
}
