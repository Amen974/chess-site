import { bishopMove } from "../moveGeneration/bishop";
import { kingMove } from "../moveGeneration/king";
import { knightMove } from "../moveGeneration/knight";
import { pawnAttacks } from "../moveGeneration/pawnAttacks";
import { queenMove } from "../moveGeneration/queen";
import { rookMove } from "../moveGeneration/rook";


export function isSquareAttacked(to, enemyColor, board) {
  for (const from in board) {
    const piece = board[from];
    if (!piece) continue;
    if (piece.color !== enemyColor) continue;

    switch (piece.type) {
      case "pawn":
        // pawns attack differently than they move
        if (pawnAttacks(from, to, enemyColor)) return true;
        break;
      case "knight":
        if (knightMove(from, to, enemyColor, board)) return true;
        break;
      case "bishop":
        if (bishopMove(from, to, enemyColor, board)) return true;
        break;
      case "rook":
        if (rookMove(from, to, enemyColor, board)) return true;
        break;
      case "queen":
        if (queenMove(from, to, enemyColor, board)) return true;
        break;
      case "king":
        if (kingMove(from, to, enemyColor, board)) return true;
        break;
    }
  }
  return false;
}
