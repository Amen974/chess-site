import { evaluateGameEnd } from "./endgame/evaluateGameEnd";
import { exportFEN } from "./exportFEN";
import { updateCastlingRights } from "./state/updateCastlingRights";
import { updateEnPassantSquare } from "./state/updateEnPassantSquare";
import { updateFullmoveNumber } from "./state/updateFullmoveNumber";
import { updateHalfmoveClock } from "./state/updateHalfmoveClock";
import { canCastleKingSide } from "./validation/canCastleKingSide";
import { canCastleQueenSide } from "./validation/canCastleQueenSide";
import { isLegalMove } from "./validation/isLegalMove";
import { isPromotionSquare } from "./validation/isPromotionSquare";
import { generateSAN } from "./generateSAN";
import { createMoveSnapshot } from "./createMoveSnapshot";
import { createNextState } from "./createNextState";
import { handleCastle } from "./helpers/handleCastle";

export function applyPlayerMove({ from, to, state }) {
  const {
    board,
    turn,
    castlingRights,
    enPassantSquare,
    halfmoveClock,
    fullmoveNumber,
  } = state;

  const piece = board[from];
  if (!piece || piece.color !== turn) return null;

  const move = createMoveSnapshot(state, from, to);
  const nextState = createNextState(state);
  nextState.promotion = null;

  const enemyColor = turn === "white" ? "black" : "white";
  const capturedPiece = board[to];


  /* ================= CASTLING ================= */

  if (canCastleKingSide(piece, from, to, board, castlingRights)) {
    nextState.board = handleCastle(nextState.board, piece.color, "king");
    move.special = "castle-king";
    move.san = "O-O";
  } else if (
    canCastleQueenSide(piece, from, to, board, castlingRights)
  ) {
    nextState.board = handleCastle(nextState.board, piece.color, "queen");
    move.special = "castle-queen";
    move.san = "O-O-O";
  }

  /* ================= NORMAL / SPECIAL MOVES ================= */

  else {
    if (!isLegalMove(from, to, board, turn, enPassantSquare)) return null;

    /* -------- EN PASSANT -------- */
    if (piece.type === "pawn" && to === enPassantSquare) {
      const dir = piece.color === "white" ? -1 : 1;
      const capturedSquare = to[0] + (Number(to[1]) + dir);

      move.captured = board[capturedSquare];
      move.special = "en-passant";

      nextState.board[capturedSquare] = null;
    }

    nextState.board[to] = piece;
    nextState.board[from] = null;

    /* -------- PROMOTION -------- */
    if (isPromotionSquare(to, nextState.board)) {
      nextState.promotion = { square: to, color: piece.color };
      move.promotion = nextState.promotion;
    }
  }

  /* ================= STATE UPDATES ================= */

  nextState.castlingRights = updateCastlingRights(
    castlingRights,
    from,
    piece
  );

  nextState.enPassantSquare = updateEnPassantSquare(
    from,
    to,
    piece,
    nextState.board
  );

  nextState.halfmoveClock = updateHalfmoveClock(
    halfmoveClock,
    piece,
    capturedPiece
  );

  nextState.fullmoveNumber = updateFullmoveNumber(
    fullmoveNumber,
    turn
  );

  /* ================= SAN ================= */

  if (!move.special) {
    move.san = generateSAN(
      from,
      to,
      piece,
      board,
      turn,
      nextState.promotion,
      enPassantSquare
    );
  }

  /* ================= FINALIZE ================= */

  const fen = exportFEN({
    board: nextState.board,
    turn: enemyColor,
    castlingRights: nextState.castlingRights,
    enPassantSquare: nextState.enPassantSquare,
    halfmoveClock: nextState.halfmoveClock,
    fullmoveNumber: nextState.fullmoveNumber,
  });

  move.fen = fen;

  const gameResult = evaluateGameEnd(turn, enemyColor, nextState.board, nextState.halfmoveClock, fen, nextState.enPassantSquare);

  return {
    board: nextState.board,
    turn: enemyColor,
    castlingRights: nextState.castlingRights,
    enPassantSquare: nextState.enPassantSquare,
    halfmoveClock: nextState.halfmoveClock,
    fullmoveNumber: nextState.fullmoveNumber,
    promotion: nextState.promotion,
    move,
    gameResult,
  };
}
