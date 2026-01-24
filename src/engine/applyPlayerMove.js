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
  const piece = state.board[from];
  if (!piece || piece.color !== state.turn) return null;

  const move = createMoveSnapshot(state, from, to);
  const nextState = createNextState(state);
  nextState.promotion = null;

  const enemyColor = state.turn === "white" ? "black" : "white";
  const capturedPiece = state.board[to];


  /* ================= CASTLING ================= */

  if (canCastleKingSide(piece, from, to, state.board, state.castlingRights)) {
    nextState.board = handleCastle(nextState.board, piece.color, "king");
    move.special = "castle-king";
    move.san = "O-O";
  } else if (
    canCastleQueenSide(piece, from, to, state.board, state.castlingRights)
  ) {
    nextState.board = handleCastle(nextState.board, piece.color, "queen");
    move.special = "castle-queen";
    move.san = "O-O-O";
  }

  /* ================= NORMAL / SPECIAL MOVES ================= */

  else {
    if (!isLegalMove(from, to, state.board, state.turn, state.enPassantSquare)) return null;

    /* -------- EN PASSANT -------- */
    if (piece.type === "pawn" && to === state.enPassantSquare) {
      const dir = piece.color === "white" ? -1 : 1;
      const capturedSquare = to[0] + (Number(to[1]) + dir);

      move.captured = state.board[capturedSquare];
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
    state.castlingRights,
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
    state.halfmoveClock,
    piece,
    capturedPiece
  );

  nextState.fullmoveNumber = updateFullmoveNumber(
    state.fullmoveNumber,
    state.turn
  );

  /* ================= SAN ================= */

  if (!move.special) {
    move.san = generateSAN(
      from,
      to,
      piece,
      state.board,
      state.turn,
      nextState.promotion,
      state.enPassantSquare
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

  const gameResult = evaluateGameEnd(state.turn, enemyColor, nextState.board, nextState.halfmoveClock, fen);

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
