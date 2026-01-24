import { isKingInCheck } from "../validation/isKingInCheck";
import { isLegalMove } from "../validation/isLegalMove";

export function isCheckmate(turn, board, enPassantSquare) {
  if (!isKingInCheck(turn, board)) return false;

  // Find the king's position
  let kingSquare = null;
  for (const square in board) {
    const piece = board[square];
    if (piece && piece.type === "king" && piece.color === turn) {
      kingSquare = square;
      break;
    }
  }
  if (!kingSquare) return false;

  // Check 1: Can the king move to any of the 8 surrounding squares?
  const kingMoves = [
    {file: -1, rank: -1}, {file: -1, rank: 0}, {file: -1, rank: 1},
    {file: 0, rank: -1}, {file: 0, rank: 1},
    {file: 1, rank: -1}, {file: 1, rank: 0}, {file: 1, rank: 1}
  ];

  for (const move of kingMoves) {
    const currentFile = kingSquare[0].charCodeAt(0);
    const currentRank = Number(kingSquare[1]);
    
    const newFile = String.fromCharCode(currentFile + move.file);
    const newRank = currentRank + move.rank;
    
    if (newFile < 'a' || newFile > 'h' || newRank < 1 || newRank > 8) {
      continue;
    }
    
    const toSquare = newFile + newRank;
    
    const targetPiece = board[toSquare];
    if (targetPiece && targetPiece.color === turn) {
      continue;
    }
    
    if (isLegalMove(kingSquare, toSquare, board, turn, enPassantSquare)) {
      return false; 
    }
  }

  // Check 2: Can any piece block the check or capture the checking piece?
  for (const from in board) {
    const piece = board[from];
    if (!piece || piece.color !== turn || piece.type === "king") continue;

    for (const to in board) {
      if (from === to) continue;

      if (isLegalMove(from, to, board, turn, enPassantSquare)) {
        const tempBoard = { ...board };
        tempBoard[to] = piece;
        tempBoard[from] = null;
        
        if (!isKingInCheck(turn, tempBoard)) {
          return false;
        }
      }
    }
  }

  return true;
}