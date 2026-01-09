export function bishopMove (from, to, turn, board){
    const fromFile = from[0];
    const fromRank = Number(from[1]);

    const toFile = to[0];
    const toRank = Number(to[1]);

    const targetPiece = board[to];

    const fileDiff = Math.abs(toFile.charCodeAt(0) - fromFile.charCodeAt(0));
    const rankDiff = Math.abs(toRank - fromRank);

    if (fileDiff !== rankDiff) return false;

    const fileStep = toFile > fromFile ? 1 : -1;
    const rankStep = toRank > fromRank ? 1 : -1;

    let currentFile = fromFile.charCodeAt(0) + fileStep;
    let currentRank = fromRank + rankStep;

    while (currentFile !== toFile.charCodeAt(0) && currentRank !== toRank) {
      const square = String.fromCharCode(currentFile) + currentRank;

      if (board[square]) {
        return false;
      }

      currentFile += fileStep;
      currentRank += rankStep;
    }

    if (targetPiece && targetPiece.color === turn) {
        return false;
      }

    return true;
  };