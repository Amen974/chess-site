export function rookMove(from, to, turn, board) {
  const fromFile = from[0];
    const fromRank = Number(from[1]);

    const toFile = to[0];
    const toRank = Number(to[1]);

    const targetPiece = board[to];

    if (fromFile !== toFile && fromRank !== toRank) {
      return false;
    }

    const fileStep = fromFile === toFile ? 0 : fromFile < toFile ? 1 : -1;
    const rankStep = fromRank === toRank ? 0 : fromRank < toRank ? 1 : -1;

    let currentFile = fromFile.charCodeAt(0) + fileStep;
    let currentRank = fromRank + rankStep;

    while (currentFile !== toFile.charCodeAt(0) || currentRank !== toRank) {
      const square = String.fromCharCode(currentFile) + currentRank;

      if (board[square]) return false;

      currentFile += fileStep;
      currentRank += rankStep;
    }

    if (targetPiece && targetPiece.color === turn) {
      return false;
    }

    return true;
}