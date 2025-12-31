export function knightMove(from, to, turn, board){
  const fromFile = from[0];
  const fromRank = Number(from[1]);

  const toFile = to[0];
  const toRank = Number(to[1]);

  const fileDiff = Math.abs(
    toFile.charCodeAt(0) - fromFile.charCodeAt(0)
  );
  const rankDiff = Math.abs(toRank - fromRank);
  
  const isKnightShape =
    (fileDiff === 2 && rankDiff === 1) ||
    (fileDiff === 1 && rankDiff === 2);

  if (!isKnightShape) return false;

  const targetPiece = board[to];
  if (targetPiece && targetPiece.color === turn) {
    return false;
  }

  return true;
};