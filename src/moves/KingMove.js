import { isSquareAttacked } from "./IsSquareAttacked";

export function kingMove(from, to, turn, board){
    const fromFile = from[0];
    const fromRank = Number(from[1]);
    const toFile = to[0];
    const toRank = Number(to[1]);

    const fileDiff = Math.abs(toFile.charCodeAt(0) - fromFile.charCodeAt(0));
    const rankDiff = Math.abs(toRank - fromRank);

    if (fileDiff > 1 || rankDiff > 1) return false;
    if (fileDiff === 0 && rankDiff === 0) return false;

    const targetPiece = board[to];
    if (targetPiece && targetPiece.color === turn) return false;

    const enemyColor = turn === 'white' ? 'black' : 'white';
     if (isSquareAttacked(to, enemyColor, board)) return false;

    return true;
  };